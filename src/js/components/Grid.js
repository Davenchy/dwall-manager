Vue.component('x-grid', {
    props: {
        collection: { default: null },
        web: { default: [] },
        cols: { type: Number, default: 3 }
    },
    data: function () {
        return {
            list: []
        }
    },
    methods: {
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
        merge: function (local, online) {
            var list = [];
            for (let i = 0; i < online.length; i++) {
                const img = online[i];
                const limg = find(local, img.id);
                if (limg) list.push(limg);
                else list.push(img);
            }
            if (list.length == 0) list = local.filter(f => true);
            console.log(online);
            return list;
        },
        update: function () {
            console.log('update')
            const images = this.merge(this.collection.images, this.web);
            this.build(images);
        },
        onSelection: function (img) {
            if (img.selected) {
                this.collection.images.push(img);
            } else {
                var list = this.collection.images.filter(i => i.id !== img.id);
                this.collection.images = list;
            }
            app.$emit('save');
        }
    },
    watch: {
        collection: function (v) {
            if (v === null) return;
            this.build(this.images);
        },
        web: function (v) {
            this.build(this.images);
        }
    },
    computed: {
        images: function () { return this.merge(this.collection.images, this.web); }
    },
    template: '#grid'
});

function find(list, id) {
    for (let i = 0; i < list.length; i++) {
        const img = list[i];
        if (img.id === id) return img;
    }
    return null;
}
