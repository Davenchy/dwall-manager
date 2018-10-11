const fs = require('fs');
const { ipcRenderer } = require('electron');
const wallpaper = require('wallpaper');

// desktop wallpaper manager
desktop = new Vue({
    methods: {
        setWallpaper: function (image, ui = false) {
            if (!image.fullmode && !typeof image === 'string') return;
            var data = image.full || image;
            var name = '/wallpaper.jpg';
            console.log(__dirname + name);
            if (ui) app.$refs.model.showadv({
                title: 'processing desktop wallpaper...',
                canClose: false, showNegative: false, showPositive: false, showInput: false
            });
            fs.writeFile(__dirname + name, data, 'base64', (err) => {
                if (err) {
                    console.error(err);
                    if (ui) app.$refs.model.showadv({
                        title: 'Error: while setting up desktop wallpaper!',
                        canClose: true, showNegative: false, positive: 'close', showInput: false
                    });
                } else {
                    wallpaper.set(__dirname + name);
                    console.log('done!');
                    if (ui) app.$refs.model.showadv({
                        title: 'Setup desktop wallpaper success!',
                        canClose: true, showNegative: false, positive: 'close', showInput: false
                    });
                }
            })
        }
    }
});
