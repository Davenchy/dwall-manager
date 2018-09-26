const electron = require('electron');

const { app, BrowserWindow, mainIpc } = electron;

let win;

app.on('ready', function () {
    win = new BrowserWindow({ show: false, minWidth: 800, minHeight: 400 });
    win.loadFile('./src/main.html');
    win.show();
    win.webContents.openDevTools();

    win.on('closed', function () {
        win = null;
    });
});
