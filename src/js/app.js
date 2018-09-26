const app = new Vue({
    el: '#app',
    data: {
        ready: false,
        store: null,
        collection: null,
        status: '',
        filters: '',
        page: 1,
        pages: null,
        web: []
    },
    methods: {
        isCollectionSelected: function (id) { return this.collection ? id === this.collection.id : false; },
        onCollectionSelection: function (c) {
            downloader.stopAll();
            this.web = [];
            this.pages = 1;
            this.collection = c;
            this.filters = utils.writeFilters(c.filters);
        },
        onCollectionCreate: function () {
            this.$refs.model.show("Collection Name?", "New Collection", (v) => {
                this.store.collections.push(utils.initCollection(v));
            });
        },
        onCollectionRename: function (c) {
            this.$refs.model.show("Rename Collection", c.name, (v) => {
                this.onCollectionSelection(c);
                this.collection.name = v;
            });
        },
        onCollectionRemove: function (c) {
            this.$refs.model.show("Remove Collection", "YES", (v) => {
                if (this.isCollectionSelected(c.id)) this.collection = null;
                this.store.collections = this.store.collections.filter(f => c.id !== f.id);
            });
        },
        onFilter: function () {
            var self = this;
            this.pages = 1;

            var data = this.$refs.filter.value;

            var r = utils.readFilters(data);

            this.collection.filters = r.filters;
            const {keywords, collections} = r;

            var query = '';
            if (keywords.length > 0) {
                query += 'query=';
                keywords.forEach(k => query += k + ' ' );
                query += '&';
            }
            if (collections.length > 0) query += 'collections=';
            collections.forEach(k => query += k + ',' );

            this.status = 'Loading...';
            Server.search(this.store.settings.client_id,
                function (images, pages) {
                    self.web = images;
                    self.pages = pages;
                    self.status = 'Page: ' + self.page + ' of ' + pages;
                }, query, this.page);
        },
        IncPage: function () { if (this.page + 1 <= this.pages) this.page++; this.onFilter(); },
        DecPage: function () { if (this.page - 1 > 0) this.page--; this.onFilter(); },
        setPage: function () {
            this.$refs.model.show("Go To Page Number? Pages = " + this.pages, this.page, (v) => {
                if (v < 1) v = 1;
                if (v > this.pages) v = this.pages;
                this.page = v;
                this.onFilter();
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
    watch: {
        page: function (v) {
            if (this.page < 1) this.page = 1;
            if (this.page > this.pages) this.page = this.pages;
        },
        pages: function (v) {
            if (this.page < 1) this.page = 1;
            if (this.page > this.pages) this.page = this.pages;
        }
    },
    created: function () {
        this.store = utils.fakeStore();
        this.ready = true;
    },
    mounted: function () {
        if (!this.ready) return;
        const c = this.store.collections[0] || null;
        if (c) {
            this.onCollectionSelection(c);
            this.filters = utils.writeFilters(c.filters);
        }
    },
});
