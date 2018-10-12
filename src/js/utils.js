const version = '1.0.0';
const storePath = __dirname + '/store.json';

// utils object
const utils = new Vue({
    methods: {
        // create initial store object
        initStore: function () {
            return {
                version, collections: [], settings: { cols: 3, client_id: '' }
            }
        },
        // save store object to file
        save: function (data = this.initStore()) {
            const ans = ipcRenderer.sendSync('store:save', JSON.stringify(data));
            if (ans == null) {
                alert('can not read or save data!');
                ipcRenderer.send('app:exit');
            }
            return data;
        },
        // load store object from file
        load: function () {
            const self = this;
            var data = ipcRenderer.sendSync('store:load');
            try {
                data = JSON.parse(data==null?undefined:data);
                return data;
            } catch(e) { return self.save() }
        },
        // create initial collection
        initCollection: function (name = 'New Collection') {
            return{ id: uuid(), name, images: [] };
        },
        // convert downloaded image bytes buffer to base64 string to store in the store file
        buffer2base64: function (buffer) {
            buffer = new Uint8Array(buffer);
            data = '';
            for (let i = 0; i < buffer.length; i++) {
                const c = buffer[i];
                data += String.fromCharCode(c);
            }
            return btoa(data);
        }
    }
});

const Server = {
    // send search request to server and manage the response
    // id: the unsplash api client id
    // cb: callback function with images array, and result pages number
    // query: query to search for [the search keyward]
    // page: the current page
    search: function (id, cb, query = '', page = 1) {
        downloader.killGroup('main');
        const images = [];
        var pages = 0;
        var w = window.screen.width, h = window.screen.height;
        API('https://api.unsplash.com/search/photos?orientation=landscape&per_page=20&page=' + page + '&query=' + query + '&client_id=' + id)
        .then(xhr => {
            var json = xhr.toJSON()
            pages = json['total_pages'];

            json.results.forEach(i => {

                // get image with width and height
                images.push({
                    id: i.id,
                    thumb: i.urls.thumb,
                    full: i.urls.full,
                    raw: i.urls.raw,
                    user: i.user.name,
                    selected: false,
                    fullmode: false
                });
            });
            cb(images, pages);
        })
        .catch(xhr => {
            if (xhr.status === 401) access_key_dialog();
            else { check_internet_dialog(); console.error(xhr); }
        });
    }
}

// for server object dialogs
function check_internet_dialog() {
    app.status = "Check your internet!";
    cmd.model({ title: "Check your internet!", showInput: false, positive: 'ok', showNegative: false });
}
function access_key_dialog() {
    app.status = "unsplash user app access key is needed!";
    cmd.model({
        title: "Unsplash client access key is needed, go to settings and set it",
        showInput: false,
        positive: 'settings',
        done: (v) => {
            if (!v) return;
            // go to settings
            app.store.settings.client_id = "912a0f1d4b4c01dcabf718d12d6e05b74eafb16a65870cc0a3eb34746a25deb2";
            cmd.model({
                title: "Hack Mode Enabled, Access Key Was Set!",
                showPositive: false, showInput: false
            })
        }
    });
}
