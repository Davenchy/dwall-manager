const { ipcRenderer } = require('electron');

// desktop wallpaper manager
desktop = new Vue({
    methods: {
        setWallpaper: function (image, ui = false) {
            if (!image.fullmode && !typeof image === 'string') return;
            var data = image.full || image;

            if (ui) cmd.model({
                title: 'processing desktop wallpaper...',
                canClose: false, showNegative: false, showPositive: false, showInput: false
            });

            ipcRenderer.send('wallpaper:set', data);
            ipcRenderer.on('feedback:wallpaper:set', state => {
                if (state) {
                    console.log('Setup desktop wallpaper success');
                    if (ui) cmd.model({
                        title: 'Setup desktop wallpaper success!',
                        canClose: true, showNegative: false, positive: 'close', showInput: false
                    });
                } else {
                    console.error('Error: while setting up desktop wallpaper');
                    if (ui) cmd.model({
                        title: 'Error: while setting up desktop wallpaper!',
                        canClose: true, showNegative: false, positive: 'close', showInput: false
                    });
                }
            });
        }
    }
});
