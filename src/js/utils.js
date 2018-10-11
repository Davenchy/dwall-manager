// consts
const fs = require('fs');
const { ipcRenderer } = require('electron');
const wallpaper = require('wallpaper');

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
        // load store object from file
        load: function () {
            var store = this.initStore();
            if (fs.existsSync(storePath)) {
                try {
                    var data = fs.readFileSync(storePath, 'utf-8');
                    data = JSON.parse(data);
                    return data;
                } catch(e) {
                }
            }
            return this.save(store);
        },
        // save store object to file
        save: function (data = {}) {
            try {
                jd = JSON.stringify(data);
                fs.writeFileSync(storePath, jd, 'utf-8');
                return data;
            } catch(e) {
                alert('can not save data!');
                ipcRenderer.send('quit-app');
            }
            return null;
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
        API('https://api.unsplash.com/search/photos?orientation=landscape&per_page=20&page=' + page + '&query=' + query + '&client_id=' + id)
        .then(xhr => {
            var json = xhr.toJSON()
            pages = json['total_pages'];

            json.results.forEach(i => {
                images.push({
                    id: i.id,
                    thumb: i.urls.thumb,
                    full: i.urls.full,
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
    app.$refs.model.showadv({ title: "Check your internet!", yesorno: true, positive: 'ok', showNegative: false });
}
function access_key_dialog() {
    app.status = "unsplash user app access key is needed!";
    app.$refs.model.show({
        title: "Unsplash client access key is needed, go to settings and set it",
        yesorno: true,
        positive: 'settings',
        done: (v) => {
            if (!v) return;
            // go to settings
        }
    });
}


// desktop wallpaper manager
desktop = new Vue({
    methods: {
        setWallpaper: function (image) {
            wallpaper.set(image.data);
        }
    }
});
