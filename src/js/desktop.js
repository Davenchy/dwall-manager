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
            ipcRenderer.on('feedback:wallpaper:set', (event, state) => {
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
        },
        saveWallpaper: function (image, ui) {
            if (!image.fullmode && !typeof image === 'string') return;
            var data = image.full;
            var name = image.description;

            if (ui) cmd.model({
                title: 'processing wallpaper...',
                canClose: false, showNegative: false, showPositive: false, showInput: false
            });
            ipcRenderer.send('wallpaper:save', {data, name});
            ipcRenderer.on('feedback:wallpaper:save', (event, state) => {
                console.log(state);
                if (state == 1) {
                    console.log('Wallpaper Saved!');
                    if (ui) cmd.model({
                        title: 'Wallpaper Saved!',
                        canClose: true, showNegative: false, positive: 'close', showInput: false
                    });
                } else if (state == 2) {
                    console.log('Canceled Wallpaper Save!');
                    if (ui) cmd.model({
                        title: 'Canceled!',
                        canClose: true, showNegative: false, positive: 'close', showInput: false
                    });
                } else {
                    console.error('Error: while saving wallpaper');
                    if (ui) cmd.model({
                        title: 'Error: while saving wallpaper!',
                        canClose: true, showNegative: false, positive: 'close', showInput: false
                    });
                }
            });
        }
    }
});
