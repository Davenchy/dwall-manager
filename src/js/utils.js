// consts
const uuid = require('uuid');
// const uuid = function () {
//     return Date.now();
//}

const version = '1.0.0';

// utils object
const utils = new Vue({
    methods: {
        fakeStore: function () {
            // create fake store object for development
            return {
                version: '1.0.0',
                settings: {
                    cols: 3,
                    client_id: ''
                },
                collections: [
                    {
                        id: uuid(),
                        name: 'My New Collection',
                        filters: [{keyword: 'sun'}],
                        images: [
                            // {
                            //     id: uuid(),
                            //     url: './images/1.jpg',
                            //     selected: true,
                            //     compile: true
                            // },
                            // {
                            //     id: uuid(),
                            //     url: './images/2.jpg',
                            //     selected: true,
                            //     compile: true
                            // },
                            // {
                            //     id: uuid(),
                            //     url: './images/3.jpg',
                            //     selected: true,
                            //     compile: true
                            // },
                            // {
                            //     id: uuid(),
                            //     url: './images/4.jpg',
                            //     selected: true,
                            //     compile: true
                            // }
                        ]
                    }
                ]
            };
        },
        initStore: function () {
            // create init store object
            return {
                client_id: '', version, collections: [], settings: {}
            }
        },
        load: function () {
            // if store not exists
            // create init store then save it as new
            // else save to the exists one
        },
        save: function () {
            // save store to file if state is ready
            // if not ready throw error
        },
        initCollection: function (name = 'New Collection') {
            return{
                id: uuid(),
                name, images: [], filters: []
            };
        },
        buffer2base64: function (buffer) {
            buffer = new Uint8Array(buffer);
            data = '';
            for (let i = 0; i < buffer.length; i++) {
                const c = buffer[i];
                data += String.fromCharCode(c);
            }
            return btoa(data);
        },
        writeFilters: function (filters = []) {
            var t = "";
            filters.forEach(f => {
                if (f.collection) t += '@' + f + ', ';
                else t += f.keyword + ', ';
            });
            if (t.endsWith(', ')) t = t.substring(0, t.length - 2);
            return t;
        },
        readFilters: function (filters = '') {
            var data = filters.trim().split(',');
            var list = [];
            var keywords = [];
            var collections = [];
            data.forEach(f => {
                f = f.trim();
                if (f.startsWith('@')) {
                    var k = f.substring(1, f.length - 1);
                    list.push({collection: k});
                    collections.push(k);
                } else {
                    list.push({keyword: f});
                    keywords.push(f);
                }
            });
            return {filters: list, keywords, collections};
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
        API('https://api.unsplash.com/search/photos?orientation=landscape&per_page=20&page=' + page + '&' + query + '&client_id=' + id)
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
        .catch(xhr => {alert('can not connect to server!'); console.error(xhr)});
    }
}
const Caches = {};
