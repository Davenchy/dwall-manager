const electron = require('electron');
const wallpaper = require('wallpaper');
const fs = require('fs');
const name = 'memory.json';
const wp = 'wallpaper.jpg';

const { app, BrowserWindow, ipcMain, dialog } = electron;

let win;

app.on('ready', function () {
    win = new BrowserWindow({ show: false, minWidth: 950, minHeight: 400, center: true });
    win.maximize()
    win.loadFile('./src/main.html');
    // win.webContents.openDevTools();
    win.show();

    win.on('closed', function () {
        win = null;
    });

});

// exit app
ipcMain.on('app:exit', event => { app.quit(); })

// load data
ipcMain.on('memory:load', event => {
    var data;
    if (!fs.existsSync(name)) return event.returnValue = null;
    try {
        data = fs.readFileSync(name, 'utf-8');
        event.returnValue = data;
    } catch (e) { event.returnValue = null }
});

// save data
ipcMain.on('memory:save', (event, data) => {
    try {
        fs.writeFileSync(name, data);
        event.returnValue = true;
    } catch (e) { event.returnValue = null; }
});

// reset data
ipcMain.on('memory:reset', event => {
    try {
        fs.unlinkSync(name);
        event.returnValue = true;
    } catch (e) { event.returnValue = false; }
});

// set desktop wallpaper
ipcMain.on('wallpaper:set', (event, data) => {
    fs.writeFile(wp, data, 'base64', err => {
        if (err) event.sender.send('feedback:wallpaper:set', false);
        else {
            wallpaper.set(wp).then(() => event.sender.send('feedback:wallpaper:set', true))
            .catch(e => event.sender.send('feedback:wallpaper:set', false));
        }
    })
});

// get desktop wallpaper
ipcMain.on('wallpaper:get', () => {
    wallpaper.get()
    .then(path => ipcMain.send('feedback:wallpaper:get', path))
    .catch(e => ipcMain.send('feedback:wallpaper:get'));
});

// save image
ipcMain.on('wallpaper:save', (event, args) => {
    const {name, data} = args;
    console.log(name)
    const saveDialog = dialog.showSaveDialog({
        options: {
            title: 'save wallpaper as',
            buttonLabel: 'save as',
            message: 'save wallpaper as',
            defaultPath: name + '.jpg' || 'wallpaper.jpg',
            filters: [{name: 'Image', extensions: ['jpg']}]
        }
    }, (path) => {
        if (!path) return event.sender.send('feedback:wallpaper:save', 2);

        fs.writeFile(path, data, 'base64', err => {
            if (err) event.sender.send('feedback:wallpaper:save', false);
            else event.sender.send('feedback:wallpaper:save', 1);
        })
    });

});
