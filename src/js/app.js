const app = new Vue({
    el: '#app',
    data: {
        // the current memory file
        memory: null,
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
            this.collection = c;
            this.status = '';
            if(cmd.grid) { cmd.grid.update(); }
        },
        // create new collection
        onCollectionCreate: function () {
            const self = this;
            cmd.dialog.build({
                autoKill: false,
                content: [
                    { type: 'title', text: 'Collection Name?' },
                    { type: 'input', value: 'New Collection', placeholder: 'Collection Name', ref: 'name', endPoint: true },
                    { type: 'group', class: 'clearfix', children: [
                        { type: 'button', text: 'create', class: 'right', endPoint: true },
                        { type: 'button', text: 'close', class: 'red right', closeAndKill: true }
                    ]}
                ],
                done: function () {
                    var name = this.refs.name.value;
                    if (name === '') return alert('Enter collection name please!');
                    self.memory.collections.push(utils.initCollection(name));
                    cmd.save();
                    this.kill();
                }
            });
        },
        // rename collection
        onCollectionRename: function (c) {
            const self = this;
            cmd.dialog.build({
                autoKill: false,
                content: [
                    { type: 'title', text: 'Rename Collection' },
                    { type: 'input', value: c.name, placeholder: 'Collection Name', ref: 'name', endPoint: true },
                    { type: 'group', class: 'clearfix', children: [
                        { type: 'button', text: 'create', class: 'right', endPoint: true },
                        { type: 'button', text: 'close', class: 'red right', closeAndKill: true }
                    ]},
                ],
                done: function () {
                    const name = this.refs.name.value;
                    if (name === '') return alert('Enter collection name please!');
                    if (name !== c.name) {
                        self.onCollectionSelection(c);
                        self.collection.name = name;
                        cmd.save();
                    }
                    this.kill();
                }
            });
        },
        // remove collection
        onCollectionRemove: function (c) {
            const self = this;
            cmd.dialog.build({
                content: [
                    { type: 'title', text: 'Remove Collection' },
                    { type: 'group', class: 'clearfix', children: [
                        { type: 'button', text: 'yes', class: 'right', endPoint: true },
                        { type: 'button', text: 'no', class: 'red right', close: true }
                    ]},
                ],
                done: function () {
                    if (self.isCollectionSelected(c.id)) self.collection = null;
                    self.memory.collections = self.memory.collections.filter(f => c.id !== f.id);
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
            Server.search(this.memory.settings.client_id,
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
            const self = this;
            // check if results are on the screen
            if (!this.pages) return;
            // when running the app for the first time show login message
            else if (this.login) {
                // show the help page
            } else {
                var list = [];
                for (let i = 1; i < this.pages + 1; i++) list.push(i)
                cmd.dialog.build({
                    content: [
                        {type: 'title', text: 'Go To Page Number?'},
                        {type: 'raw', class: 'center flex', children: [
                            {type: 'label', class: 'col', text: 'Page :'},
                            {type: 'options', class: 'col', ref: 'page', value: this.page, list}
                        ]},
                        {type: 'group', class: 'clearfix', children: [
                            {type: 'button', text: 'go to page', class: 'right', endPoint: true},
                            {type: 'button', text: 'close', class: 'red right', close: true}
                        ]}
                    ],
                    done: function () {
                        var n = this.refs.page.value;
                        if (n < 1) n = 1;
                        if (n > self.pages) n = self.pages;
                        self.page = n;
                        self.Pager();
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
        cmd.save = function () { utils.save(self.memory) };
        this.memory = utils.load();

        const c = this.memory.collections[0] || null;
        if (c) this.onCollectionSelection(c);

        cmd.underdevelopment = function () { alert('This feature is under development'); }
        cmd.about = function () {
            cmd.dialog.build([
                { type: 'title', text: 'About' },
                { type: 'label', text: 'DWall Manager V1.1.0' },
                { type: 'label', text: 'Created by Davenchy' },
                { type: 'html', html: `
                    <a class="btn" style="background-color: transparent; color: #222;"
                        target="_blank" href="https://github.com/Davenchy/dwall_manager">
                            <i class="fab fa-github-alt"></i>
                            <p style= ' margin-left: 5px; display: inline-block;'>
                                Open In Github.com
                            </p>
                    </a>
                `},
                { type: 'button', text: 'close', class: 'red right', close: true }
            ]);
        }
        cmd.images = function () { return self.collection ? self.collection.images: undefined; }
    },
    mounted: function() {
        if(cmd.grid) { cmd.grid.update(); }
        cmd.settings.import(this.memory.settings);
        cmd.test();
    }
});
