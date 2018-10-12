// images grid
Vue.component('x-grid', {
    props: {
        // the current selected collection
        collection: { default: null },
        // array of images from the server
        web: { default: [] },
        // number of columns
        cols: { type: Number, default: 3 }
    },
    data: function () {
        return {
            // list of columns and images to render
            list: []
        }
    },
    methods: {
        // build the list object to render it
        build: function (images) {
            const c = this.cols;
            const l = images.length;
            const list = [];

            if (c === 0 || l === 0) { this.list = []; return; }

            for (let i = 0; i < c; i++) list.push([]);

            var cc = 0;
            for (let i = 0; i < l; i++) {
                const img = images[i];
                if (cc > c - 1) cc = 0;
                list[cc].push(img);
                cc++;
            }

            this.list = list;
        },
        // merge the store, cached and downloaded images in one list to build it and render
        merge: function (local, online) {
            var list = [];
            for (let i = 0; i < online.length; i++) {
                const img = online[i];
                const limg = find(local, img.id);
                if (limg) list.push(limg);
                else list.push(img);
            }
            if (list.length == 0) list = local.filter(f => true);
            return list;
        },
        // rerender images with each component update
        update: function () {
            // const images = this.merge(this.collection.images, this.web);
            this.build(this.images);
        },
        // clear all images
        clear: function () { this.list = []; },
        // on image select save it to the store file [as local image]
        // or remove it from the store file
        onSelection: function (img) {
            if (img.selected) {
                this.collection.images.push(img);
            } else {
                var list = this.collection.images.filter(i => i.id !== img.id);
                this.collection.images = list;
            }
            // emit save event to the app to write the store object to file
            cmd.save();
        }
    },
    watch: {
        // chech if the collection object is updated
        collection: function (v) {
            if (v === null) return;
            this.build(this.images);
        },
        // chech if the web list is updated
        web: function (v) {
            this.build(this.images);
        }
    },
    computed: {
        // compute the images object
        images: function () { return this.merge(this.collection.images, this.web); }
    },
    mounted: function() {
        cmd.updateGrid = this.update.bind(this);
    },
    template: '#grid'
});

// chech if the image in the list or not
// return the image or null
function find(list, id) {
    for (let i = 0; i < list.length; i++) {
        const img = list[i];
        if (img.id === id) return img;
    }
    return null;
}
