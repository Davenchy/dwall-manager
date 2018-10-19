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
        openView: function () {
            if (!this.img.fullmode) return;
            cmd.view.show(this.img);
        },
        render: function () {
            var self = this;
            // download image thumb id not selected
            // or full if selected
            if (!this.img.selected) {
                self.loading = true;
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
                self.loading = true;
                downloader.Task({
                    url: this.img.full,
                    group: 'getfull',
                    done: (task) => {
                        if (task.ok && !task.downloading) {
                            self.img.full = task.data; self.img.fullmode = true;
                            cmd.save();
                        } else if (!task.ok && !task.downloading) self.error = true;
                        self.loading = false;
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
    template: `
        <div>
            <div class="imgc">
                <img
                    :src="'data:image/jpg;base64,'+img.data"
                    :class="{selected: img.selected, downloaded: img.fullmode, downloading}"
                    v-if="!error && (!loading || img.selected)"
                >
                <div v-else class="space"></div>
                <span class="selector" @click="onSelection"></span>
                <span class="viewbtn" @click="openView" v-show="img.fullmode"><i class="far fa-eye"></i></span>
                <div class="loading" v-if="loading && !error">Loading ({{ progress }})%</div>
                <div class="loading" v-if="error">ERROR!</div>
            </div>
        </div>
    `
});
