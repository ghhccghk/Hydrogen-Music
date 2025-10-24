<br />
<p align="center">
  <a href="https://github.com/Kaidesuyo/Hydrogen-Music" target="blank">
    <img src="img/icon.png" alt="Logo" width="156" height="156">
  </a>
  <h2 align="center" style="font-weight: 600">Hydrogen Music</h2>
  <img src="img/rebuilding.png" alt="">

## 🌟 主要特性

- 修复 **登录** 功能
- 修复 **音乐视频** 功能，现在支持在线音乐播放视频
- 修复 **云盘** 功能，现在可以正常在云盘进行上传/删除操作，内存管理一切正常
- 新增 **桌面歌词** 功能，播放器界面可打开独立桌面歌词窗口（可拖动/锁定、可调整大小），支持显示当前/下一句，右键菜单可切换歌词来源（自动/原文/翻译/罗马音）、锁定位置与字体大小调节
- 新增 **深色模式**功能，可在设置中自行调节浅色/深色模式
- 支持了多系统版本的安装包
- 支持了Linux Mpris 控制

## 📦️ 安装

访问 [Releases](https://github.com/ghhccghk/Hydrogen-Music/releases)
页面下载安装包。

## 👷‍♂️ 打包客户端

如果本地无法打包可以下载Github Ci 构建测试

```shell
# 打包
npm run dist
```

## 💻 配置开发环境

运行本项目

```shell
# 安装依赖
npm install

# 运行Vue服务
npm run dev

# 运行Electron客户端
npm start
```

## 📜 开源许可

本项目仅供个人学习研究使用，禁止用于商业及非法用途。

基于 [MIT license](https://opensource.org/licenses/MIT) 许可进行开源。

## 灵感来源

网易云音乐API：[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)<br />
哔哩哔哩API：[SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

- [qier222/YesPlayMusic](https://github.com/qier222/YesPlayMusic)
- [Apple Music](https://music.apple.com)
- [网易云音乐](https://music.163.com)

## 🖼️ 截图

![lyric2][lyric2-screenshot]
![home][home-screenshot]
![playlist][playlist-screenshot]
![lyric1][lyric1-screenshot]
![music_video][music_video-screenshot]
![setting][setting]

[lyric2-screenshot]: img/lyric2.png
[home-screenshot]: img/home.png
[playlist-screenshot]: img/playlist.png
[lyric1-screenshot]: img/lyric1.png
[music_video-screenshot]: img/music_video.png
[setting]: img/setting.png
