const electron = require('electron');

const { app, BrowserWindow, ipcMain } = electron;

let win;

app.on('ready', function () {
    win = new BrowserWindow({ show: false, minWidth: 800, minHeight: 400 });
    win.loadFile('./src/main.html');
    win.webContents.openDevTools();
    win.show();

    win.on('closed', function () {
        win = null;
    });

    ipcMain.on('quit-app', () => { app.quit(); })
});
