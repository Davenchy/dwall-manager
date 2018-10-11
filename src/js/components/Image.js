// image component
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
        // on image selection
        onSelection: function () {
            this.img.selected = !this.img.selected
            this.$emit('selection', this.img);
            this.render();
        },
        render: function () {
            var self = this;
            // download image thumb id not selected
            // or full if selected

            if (!this.img.selected) {
                this.loading = true;
                downloader.Task({
                    url: this.img.thumb,
                    group: 'getthumb',
                    done: (task) => {
                        if (task.ok && !task.downloading) {
                            self.img.data = task.data;
                        } else if (!task.ok && !task.downloading) self.error = true;
                        self.loading = false;
                    },
                    prog: (p) => { self.progress = p; }
                })
            } else if (this.img.selected && !this.img.fullmode) {
                loading = true;
                downloader.Task({
                    url: this.img.full,
                    group: 'getfull',
                    done: (task) => {
                        if (task.ok && !task.downloading) {
                            self.img.full = task.data; self.img.fullmode = true;
                            // emit save event to the app to write the store object to file
                            app.$emit('save');
                        } else if (!task.ok && !task.downloading) self.error = true;
                        loading = false;
                    },
                    prog: (p) => { self.progress = p; }
                })
            }
        }
    },
    created: function () { this.render() },
    computed: {
        downloading: function () { return !this.img.fullmode && this.img.selected; }
    },
    template: '#image'
});
