const startNeteaseMusicApi = require('./electron/services')
const IpcMainEvent = require('./electron/ipcMain')
const MusicDownload = require('./electron/download')
const LocalFiles = require('./electron/localmusic')
const InitTray = require('./electron/tray')
const registerShortcuts = require('./electron/shortcuts')
const {isCreateMpris, isLinux} = require('./utils/platform');
const {createMpris, createDbus} = require('./electron/mpris');

const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const Winstate = require('electron-win-state').default
const {autoUpdater} = require("electron-updater");
const path = require('path')
const Store = require('electron-store').default;
const settingsStore = new Store({name: 'settings'});

let myWindow = null
let lyricWindow = null
let forceQuit = false;
//electron单例
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore()
      if (!myWindow.isVisible()) myWindow.show()
      myWindow.focus()
    }
  })

  // disable chromium mpris
  if (isCreateMpris) {
    app.commandLine.appendSwitch(
      'disable-features',
      'HardwareMediaKeyHandling,MediaSessionService'
    );
  }

  // 尝试启用平台 HEVC 硬件解码（在支持的平台上）
  try {
    app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport')
    // 某些平台可能需要忽略 GPU 黑名单以启用硬件解码
    app.commandLine.appendSwitch('ignore-gpu-blocklist')
  } catch (e) {
    console.log("openHEVC error:" + e)
  }

  // const settings = await settingsStore.get('settings');
  //
  // if (isLinux && ){
  //   app.commandLine.appendSwitch('enable-features', 'WaylandWindowDecorations')
  //   app.commandLine.appendSwitch('ozone-platform', 'wayland')
  // }
  app.whenReady().then(async () => {
    process.on('uncaughtException', (err) => {
      console.error('捕获到未处理异常:', err)
    })

    //api初始化
    try {
      await startNeteaseMusicApi();  // 等待 API 启动
      console.log('Netease API 已就绪');
      createWindow();                 // API 启动后再创建窗口
    } catch (err) {
      console.error('Netease API 启动失败:', err);
      app.quit();                     // 启动失败退出
    }
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('will-quit', () => {
    // 注销所有快捷键
    globalShortcut.unregisterAll()
  })

  app.on('before-quit', () => {
    forceQuit = true;
  });
}
const createWindow = async () => {
  // 设置应用名称（在开发模式下也生效）
  app.setName('Hydrogen Music')
  process.env.DIST = path.join(__dirname, '../')
  const indexHtml = path.join(process.env.DIST, 'dist/index.html')
  const winstate = new Winstate({
    //自定义默认窗口大小
    defaultWidth: 1024,
    defaultHeight: 672,
  })
  const iconPath = getTrayIconPath();
  const win = new BrowserWindow({
    minWidth: 1024,
    minHeight: 672,
    frame: false,
    title: "Hydrogen Music",
    icon: path.resolve(__dirname, './assets/icon/' + (process.platform === 'win32' ? 'icon.ico' : 'icon.png')),
    backgroundColor: '#fff',
    //记录窗口大小
    ...winstate.winOptions,
    show: false,
    webPreferences: {
      //预加载脚本
      preload: path.resolve(__dirname, './electron/preload.js'),
      webSecurity: false,
      sandbox: false
    }
  })
  myWindow = win
  if (process.resourcesPath.indexOf('\\node_modules\\') != -1)
    win.loadURL('http://localhost:5173/')
  else
    win.loadFile(indexHtml)
  win.once('ready-to-show', () => {
    win.show()
    // if(process.resourcesPath.indexOf('\\node_modules\\') == -1) {
    //     autoUpdater.autoDownload = false
    //     autoUpdater.on('update-available', info => {
    //         win.webContents.send('check-update', info.version)
    //     });
    //     autoUpdater.checkForUpdatesAndNotify()
    // }
  })
  winstate.manage(win)
  const settings = await settingsStore.get('settings');
  win.on('close', async (event) => {

    if (forceQuit) {
      // 如果是强制退出 (Cmd+Q)，则不阻止默认行为
      myWindow = null;
      return;
    }

    // 在macOS上，'close'事件通常意味着窗口将被销毁，而不是隐藏
    if (process.platform === 'darwin') {
      // 如果用户设置为“最小化”，则阻止关闭并隐藏窗口
      if (settings && settings.other && settings.other.quitApp === 'minimize') {
        event.preventDefault();
        win.hide();
      } else {
        // 否则，允许窗口关闭，但不退出应用
        // `window-all-closed`事件会处理后续逻辑
        myWindow = null;
      }
    } else {
      // 在非macOS平台上，保留您原有的逻辑
      event.preventDefault();
      if (settings && settings.other && settings.other.quitApp === 'minimize') {
        win.hide();
      } else if (settings && settings.other && settings.other.quitApp === 'quit') {
        win.webContents.send('player-save');
        // 在发送保存指令后，需要一个机制来真正退出
        // 监听 'player-saved' 是一个好方法，但为了简单起见，我们设置一个超时
        setTimeout(() => {
          app.quit();
        }, 500);
      } else {
        app.quit(); // 默认行为
      }
    }

  })
  //ipcMain初始化
  IpcMainEvent(win, app, {
    createLyricWindow,
    closeLyricWindow,
    setLyricWindowMovable,
    getLyricWindow: () => lyricWindow
  })
  MusicDownload(win)
  LocalFiles(win, app)
  InitTray(win, app, path.resolve(__dirname, iconPath))
  await registerShortcuts(win)

  // create mpris
  if (isCreateMpris) {
    createMpris(win);
    // try to start osdlyrics process on start
    if (settings.lyric.enableOsdlyricsSupport) {
      await createDbus(win);
    }
  }
}

function getTrayIconPath() {
  if (process.platform === 'win32') {
    return path.join(__dirname, './assets/icon/icon.ico');
  } else if (process.platform === 'darwin') {
    // macOS
    return path.join(__dirname, './assets/icon/icon.icns');
  } else {
    // Linux
    return path.join(__dirname, './assets/icon/icon.png');
  }
}

// 创建桌面歌词窗口
const createLyricWindow = () => {
  if (lyricWindow) {
    lyricWindow.focus()
    return lyricWindow
  }

  const lyricWin = new BrowserWindow({
    width: 500,
    height: 350,
    minWidth: 500,
    minHeight: 250,
    maxWidth: 900,
    maxHeight: 500,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    movable: true,
    minimizable: false,
    maximizable: false,
    closable: true,
    // 保持可交互，但避免全屏干扰
    focusable: true,
    show: false,
    backgroundColor: 'transparent',
    webPreferences: {
      preload: path.resolve(__dirname, './electron/preload.js'),
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  lyricWindow = lyricWin

  const lyricHtml = path.join(process.env.DIST, 'dist/desktop-lyric.html')
  if (process.resourcesPath.indexOf('\\node_modules\\') != -1) {
    lyricWin.loadURL('http://localhost:5173/desktop-lyric.html')
  } else {
    lyricWin.loadFile(lyricHtml)
  }

  // Windows/UWP: 提升置顶效果的工具方法（无需管理员权限）
  const bumpTopMost = () => {
    try {
      // 再次声明置顶，提高 Z 序
      lyricWin.setAlwaysOnTop(true)
      // 若可用，进一步将窗口移至最上层（Windows 支持）
      if (typeof lyricWin.moveTop === 'function') {
        lyricWin.moveTop()
      }
    } catch (_) { }
  }

  lyricWin.once('ready-to-show', () => {
    lyricWin.show()
    // macOS: 提高层级，覆盖全屏和 Space（忽略异常以兼容跨平台）
    try { lyricWin.setAlwaysOnTop(true, 'screen-saver') } catch (_) { }
    // 可见后小延时再次顶置，规避某些 UWP 抢焦点导致的抢占
    setTimeout(() => bumpTopMost(), 50)
  })

  // 添加备用显示逻辑，防止ready-to-show事件不触发
  setTimeout(() => {
    if (lyricWin && !lyricWin.isDestroyed() && !lyricWin.isVisible()) {
      lyricWin.show()
    }
    // 再次顶置，确保在慢速环境中仍能覆盖
    bumpTopMost()
  }, 2000)

  lyricWin.on('closed', () => {
    lyricWindow = null
  })

  lyricWin.setMenu(null)

  // 监听关键事件并在 Windows 上重新顶置
  if (process.platform === 'win32') {
    const reboundEvents = ['show', 'focus', 'blur', 'resize', 'move', 'restore']
    reboundEvents.forEach(evt => {
      lyricWin.on(evt, () => bumpTopMost())
    })
    // 当主窗口获得/失去焦点时也尝试顶置一次（减少被 UWP 挤压的概率）
    if (myWindow) {
      myWindow.on('focus', () => bumpTopMost())
      myWindow.on('blur', () => bumpTopMost())
    }
  }

  return lyricWin
}

const closeLyricWindow = () => {
  if (lyricWindow) {
    lyricWindow.close()
    lyricWindow = null
  }
}

const setLyricWindowMovable = (movable) => {
  if (lyricWindow) {
    lyricWindow.setMovable(movable)
  }
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
