Vue.component('x-image', {
    props: { img: { type: Object, required: true } },
    data: function () {
        return {
            loading: false,
            progress: -1,
            error: false
        }
    },
    methods: {
        onSelection: function () {
            this.img.selected = !this.img.selected
            this.$emit('selection', this.img);
        }
    },
    created: function () {
        var self = this;
        if (!this.img.selected || this.img.compile) {
            this.loading = true;

            var data = Caches[this.img.id] || null;
            if (data) { this.img.data = data; self.loading = false; }
            else {
                downloader.start(this.img.url,
                function (data) {
                    if (data) {
                        data = utils.buffer2base64(data);
                        Caches[self.img.id] = data;
                        self.img.data = data;
                        self.loading = false;
                    } else self.error = true;
                }, p => self.progress = Math.round(p));
            }
        }
    },
    template: '#image'
});
