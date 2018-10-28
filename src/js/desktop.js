// desktop wallpaper manager
desktop = new Vue({
    methods: {
        setWallpaper: function (image, ui = false) {
            if (!image.fullmode && !typeof image === 'string') return;
            var data = image.full || image;
            var d = undefined;
            if (ui) d = cmd.dialog.build([
                {type: 'title', ref: 't', text: 'processing desktop wallpaper...'},
                {type: 'group', ref: 'g', class: 'clearfix', show: false, children: [
                    {type: 'button', text: 'close', class: 'right red', close: true}
                ]}
            ]);

            ipcRenderer.send('wallpaper:set', data);
            ipcRenderer.on('feedback:wallpaper:set', (event, state) => {
                d.refs.g.show = true;
                if (state) {
                    console.log('Setup desktop wallpaper success');
                    if (ui) d.refs.t.text = "Setup desktop wallpaper success!";
                } else {
                    console.error('Error: while setting up desktop wallpaper');
                    if (ui) d.refs.t.text = "Error: while setting up desktop wallpaper!";
                }
            });
        },
        saveWallpaper: function (image, ui) {
            if (!image.fullmode && !typeof image === 'string') return;
            var data = image.full;
            var name = image.description;
            var d = undefined;
            if (ui) d = cmd.dialog.build([
                {type: 'title', ref: 't', text: 'processing wallpaper...'},
                {type: 'group', ref: 'g', class: 'clearfix', show: false, children: [
                    {type: 'button', text: 'close', class: 'right red', close: true}
                ]}
            ]);
            ipcRenderer.send('wallpaper:save', {data, name});
            ipcRenderer.on('feedback:wallpaper:save', (event, state) => {
                d.refs.g.show = true;
                console.log(state);
                if (state == 1) {
                    console.log('Wallpaper Saved!');
                    if (ui) d.refs.t.text = "Wallpaper Saved!";
                } else if (state == 2) {
                    console.log('Canceled Wallpaper Save Process!');
                    if (ui) d.refs.t.text = "Canceled Wallpaper Save Process!";
                } else {
                    console.error('Error: while saving wallpaper');
                    if (ui) d.refs.t.text = "Error: while saving wallpaper";
                }
            });
        }
    }
});
