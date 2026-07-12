const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  openWebsite: (url) => ipcRenderer.invoke('open-website', url),
  takeScreenshot: () => ipcRenderer.invoke('take-screenshot')
});
