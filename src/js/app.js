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
            this.$refs.model.show("Collection Name?", "New Collection", (v) => {
                this.store.collections.push(utils.initCollection(v));
                app.$emit('save');
            }, { positive: 'create' });
        },
        // rename collection
        onCollectionRename: function (c) {
            this.$refs.model.show("Rename Collection", c.name, (v) => {
                this.onCollectionSelection(c);
                this.collection.name = v;
                app.$emit('save');
            }, { positive: 'rename' });
        },
        // remove collection
        onCollectionRemove: function (c) {
            this.$refs.model.showadv({
                title: 'Remove Collection',
                yesorno: true,
                positive: 'yes',
                negative: 'no',
                done: (v) => {
                    if (!v) return;
                    if (this.isCollectionSelected(c.id)) this.collection = null;
                    this.store.collections = this.store.collections.filter(f => c.id !== f.id);
                    app.$emit('save');
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
            app.$emit('save');
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
                this.$refs.model.show("Go To Page Number? Pages = " + this.pages, this.page, (v) => {
                    if (v < 1) v = 1;
                    if (v > this.pages) v = this.pages;
                    this.page = v;
                    this.Pager();
                });
            }
        },
        // chech if collection downloading images
        isDownloading: function (c) {
            for (let i = 0; i < c.images.length; i++)
                if (!c.images[i].fullmode) return true;
            return false;
        }
    },
    created: function () {
        var self = this;
        // load store from file
        this.store = utils.load();
        // save the current store to file on 'save' event
        this.$on('save', () => utils.save(self.store));
    },
    mounted: function () {
        // chech if store is loaded
        // if not create one and save it to file
        if (!this.store) this.store = utils.save(utils.initStore());
        // select the first collection
        const c = this.store.collections[0] || null;
        // if c not null then select the collection 'c'
        if (c) {
            this.onCollectionSelection(c, () => { app.$emit('save'); });
        }
    },
});
