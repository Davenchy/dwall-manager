const app = new Vue({
    el: '#app',
    data: {
        // the current store file
        store: null,
        // current selected collection to render and edit
        collection: null,
        // status or current page number to display
        status: '',
        // current page
        page: 1,
        // result pages number
        pages: null,
        // the search keyword
        query: '',
        // check if user need to login
        login: false,
        // the results array
        web: []
    },
    methods: {
        // if collection is selected return it's id or return false
        isCollectionSelected: function (id) { return this.collection ? id === this.collection.id : false; },
        // select collection
        onCollectionSelection: function (c) {
            downloader.killGroup('main');
            this.web = [];
            this.pages = null;
            this.status = '';
            this.collection = c;
        },
        // create new collection
        onCollectionCreate: function () {
            cmd.model({
                title: "Collection Name?",
                value: "New Collection",
                positive: "create",
                done: name => {
                    this.store.collections.push(utils.initCollection(name));
                    cmd.save();
                }
            });
        },
        // rename collection
        onCollectionRename: function (c) {
            cmd.model({
                title: "Rename Collection",
                value: c.name,
                positive: "rename",
                done: name => {
                    this.onCollectionSelection(c);
                    this.collection.name = name;
                    cmd.save();
                }
            });
        },
        // remove collection
        onCollectionRemove: function (c) {
            cmd.model({
                title: 'Remove Collection',
                showInput: false,
                positive: 'yes',
                negative: 'no',
                done: (v) => {
                    if (!v) return;
                    if (this.isCollectionSelected(c.id)) this.collection = null;
                    this.store.collections = this.store.collections.filter(f => c.id !== f.id);
                    cmd.save();
                }
            });
        },
        // send search request for specific page and get the results
        Pager: function () {
            if (this.query == '') return;
            var self = this;

            this.status = 'Loading...';
            app.$refs.grid.clear();
            Server.search(this.store.settings.client_id,
                function (images, pages) {
                    self.web = images;
                    self.pages = pages;
                    self.status = 'Page: ' + self.page + ' of ' + pages;
                }, this.query, this.page || 1);
        },
        // go to the next page
        IncPage: function () { if (this.page + 1 <= this.pages) this.page++; this.Pager(); },
        // go to the previous page
        DecPage: function () { if (this.page - 1 > 0) this.page--; this.Pager(); },
        // set the page number
        setPage: function () {
            // check if results are on the screen
            if (!this.pages) return;
            // when running the app for the first time show login message
            else if (this.login) {
                // show the help page
            } else {
                // show dialog to get the page number
                cmd.model({
                    title: "Go To Page Number? Pages = " + this.pages,
                    value: this.page,
                    positive: "go",
                    done: v => {
                        if (v < 1) v = 1;
                        if (v > this.pages) v = this.pages;
                        this.page = v;
                        this.Pager();
                    }
                });
            }
        },
        // chech if collection downloading images
        isDownloading: function (c) {
            for (let i = 0; i < c.images.length; i++)
                if (!c.images[i].fullmode) return true;
            return false;
        },
        showcontainer: function() { console.log(location.hash); return location.hash != '' }
    },
    created: async function () {
        const self = this;
        cmd.save = function () { utils.save(self.store) };
        this.store = utils.load();

        const c = this.store.collections[0] || null;
        if (c) this.onCollectionSelection(c);

        cmd.underdevelopment = function () {
            cmd.model({
                title: 'This feature is under development',
                showInput: false, showNegative: false, positive: 'ok'
            });
        }

        cmd.images = function () { return self.collection ? self.collection.images: undefined; }
    },
    mounted: function() { cmd.grid.update(); cmd.settings.import(this.store.settings); }
});
