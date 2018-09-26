// consts
const uuid = require('uuid');
const fs = require('fs');
const { ipcRenderer } = require('electron');

const version = '1.0.0';
const storePath = __dirname + '/store.json';

// utils object
const utils = new Vue({
    methods: {
        initStore: function () {
            return {
                version, collections: [], settings: { cols: 3, client_id: '' }
            }
        },
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
        initCollection: function (name = 'New Collection') {
            return{ id: uuid(), name, images: [] };
        },
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

// downloader object
const downloader = new Vue({
    data: {
        downloads: {}
    },
    methods: {
        start: function (url, done, prog) {
            const xhr = new XMLHttpRequest();
            const id = uuid();
            const self = this;
            xhr.open('GET', url);
            xhr.responseType = 'arraybuffer';
            xhr.onerror = function () { done(null); }
            xhr.onloadend = function () { done(xhr.response); self.clear(id); }
            xhr.onprogress = function (e) {
                if (e.lengthComputable) {
                    var p = 100 * e.loaded / e.total;
                    prog(p);
                } else prog(-1);
            }
            xhr.send();

            this.downloads[id] = xhr;
            return id;
        },
        stop: function (id) {
            var process = this.downloads[id] || null;
            if (process != null) { process.abort(); this.clear(id); }
        },
        clear: function (id) { this.downloads[id] = undefined; },
        stopAll: function () {
            var self = this;
            var ids = Object.keys(this.downloads);
            ids.forEach(id => { self.stop(id) });
        }
    }
})

const Server = {
    search: function (id, cb, query = '', page = 1) {
        downloader.stopAll();
        const images = [];
        var pages = 0;
        API('https://api.unsplash.com/search/photos?orientation=landscape&per_page=20&page=' + page + '&query=' + query + '&client_id=' + id)
        .then(xhr => {
            var json = xhr.toJSON()
            pages = json['total_pages'];

            json.results.forEach(i => {
                images.push({
                    id: i.id,
                    url: i.urls.thumb,
                    // url: i.urls.full,
                    user: i.user.name,
                    selected: false
                });
            });
            cb(images, pages);
        })
        .catch(xhr => {
            if (xhr.status === 401) {
                app.$refs.model.show("Your Unsplash Client Access Serial:", "Go to help section [ctrl + h]");
            } else {
                alert('can not connect to server!'); console.error(xhr);
            }
        });
    }
}
const Caches = {};
