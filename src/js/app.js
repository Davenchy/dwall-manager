const app = new Vue({
    el: '#app',
    data: {
        store: null,
        collection: null,
        status: '',
        page: 1,
        pages: null,
        query: '',
        web: []
    },
    methods: {
        isCollectionSelected: function (id) { return this.collection ? id === this.collection.id : false; },
        onCollectionSelection: function (c) {
            downloader.stopAll();
            this.web = [];
            this.pages = null;
            this.collection = c;
        },
        onCollectionCreate: function () {
            this.$refs.model.show("Collection Name?", "New Collection", (v) => {
                this.store.collections.push(utils.initCollection(v));
                app.$emit('save');
            });
        },
        onCollectionRename: function (c) {
            this.$refs.model.show("Rename Collection", c.name, (v) => {
                this.onCollectionSelection(c);
                this.collection.name = v;
                app.$emit('save');
            });
        },
        onCollectionRemove: function (c) {
            this.$refs.model.show("Remove Collection", "YES", (v) => {
                if (this.isCollectionSelected(c.id)) this.collection = null;
                this.store.collections = this.store.collections.filter(f => c.id !== f.id);
                app.$emit('save');
            });
        },
        Pager: function () {
            var self = this;

            this.status = 'Loading...';
            Server.search(this.store.settings.client_id,
                function (images, pages) {
                    self.web = images;
                    self.pages = pages;
                    self.status = 'Page: ' + self.page + ' of ' + pages;
                }, this.query, this.page || 1);
            app.$emit('save');
        },
        IncPage: function () { if (this.page + 1 <= this.pages) this.page++; this.Pager(); },
        DecPage: function () { if (this.page - 1 > 0) this.page--; this.Pager(); },
        setPage: function () {
            this.$refs.model.show("Go To Page Number? Pages = " + this.pages, this.page, (v) => {
                if (v < 1) v = 1;
                if (v > this.pages) v = this.pages;
                this.page = v;
                this.Pager();
            });
        }
    },
    computed: {
        level: function () {
            try {
                if (this.loading) return 2;
                else if (this.collection.images.length == 0 && this.web.length === 0) return 1;
            }
            catch(e) { return 0; }
        }
    },
    created: function () {
        var self = this;
        this.store = utils.load();
        this.$on('save', () => utils.save(self.store) );
    },
    mounted: function () {
        if (!this.store.collections) this.store = utils.save(utils.initStore());
        const c = this.store.collections[0] || null;
        if (c) {
            this.onCollectionSelection(c);
        }
    },
});
