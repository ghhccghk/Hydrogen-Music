const getPlatform = () => {
  if (typeof process !== 'undefined' && process.platform) {
    return process.platform;
  }
  if (typeof navigator !== 'undefined') {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) return 'win32';
    if (platform.includes('mac')) return 'darwin';
    if (platform.includes('linux')) return 'linux';
  }
  return 'unknown';
};

const platform = getPlatform();

export const isWindows = platform === 'win32';
export const isMac = platform === 'darwin';
export const isLinux = platform === 'linux';
export const isDevelopment =
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
  (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development');

export const isCreateTray = isWindows || isLinux || isDevelopment;
export const isCreateMpris = isLinux;
