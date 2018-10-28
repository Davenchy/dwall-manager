Vue.component('x-imageview', {
    data: function () {
        return {
            show: false,
            index: 0,
            extra: "data:image/jpg;base64,"
        }
    },
    methods: {
        copyright: function () { shell.openExternal(this.img.html) },
        view: function (img) {
            this.setIndex(img);
            this.show = true;
        },
        toLeft: function () {
            this.index--; if (this.index < 0) this.index = this.images.length - 1;
        },
        toRight: function () {
            this.index++; if (this.index > this.images.length - 1) this.index = 0;
        },
        setIndex: function (img) {
            const images = this.images;
            for (let i = 0; i < images.length; i++) if (images[i].id === img.id) { this.index = i; return true; }
            return false;
        }
    },
    computed: {
        img: function () {
            if (!cmd) return;
            if (!this.images) return;
            const img = this.images[this.index] || undefined;
            if (img == undefined) return;
            if (!img.fullmode && !img.data) return;
            return img;
        },
        images: function () { return cmd.images() }
    },
    created: function() {
        const self = this;
        cmd.view = new Object();
        cmd.view.show = function (img) { self.view(img) }.bind(this);
        cmd.view.setCurrentImageAsDesktopWallpaper = function() {
            if (self.show) desktop.setWallpaper(this.img, true);
        }.bind(this);
        cmd.view.saveCurrentImageAs = function() {
            if (self.show) desktop.saveWallpaper(this.img, true);
        }.bind(this);
        cmd.view.copyImageToCollection = function () {
            if (!self.show) return;

            var l = [];

            for (let i = 0; i < app.memory.collections.length; i++) {
                const name = app.memory.collections[i].name;
                l.push({key: `${i + 1}`, value: name});
            }

            cmd.dialog.build({
                autoKill: false,
                actions: {
                    has: function (c, id) {
                        for (let i = 0; i < c.length; i++) {
                            if (id == c[i].id) return true;
                        }
                        return false;
                    },
                    modes: function (i) {
                        if (i.checked) { this.refs.ns.show=true; this.refs.n.show=false; }
                        else { this.refs.ns.show=false; this.refs.n.show=true; }

                    }
                },
                content: [
                    { type: 'title', text: 'Copy to collection(s)?' },
                    {type: 'checkbox', ref: 'm', checked: false, text: 'more than one collection', action: 'modes'},
                    { type: 'input', endPoint: true, show: false, ref: 'ns', placeholder: 'but (,) between numbers e.g.: 1, 2, 3'},
                    { type: 'options', ref: 'n', advlist: l, value: '1'},
                    {type: 'group', class: 'clearfix', children: [
                        {type: 'button', class: 'right', text: 'copy', endPoint: true},
                        {type: 'button', class: 'right red', text: 'close', closeAndKill: true}
                    ]}
                ],
                done: function () {
                    v = this.refs.m.checked ? this.refs.ns.value : this.refs.n.value ;
                    if (!v.length > 0) return alert('Enter number(s) please!');
                    const ns = v.split(',');
                    ns.forEach(n => {
                        console.log(n)
                        c = app.memory.collections[parseInt(n) - 1] || undefined;
                        if (!c) return;
                        const img = Object.assign({}, {...self.img});
                        if (this.actions.has(c.images, img.id)) return;
                        // clone the image of the current collection
                        c.images.push(img);
                    });
                    cmd.save();
                    this.kill();
                }
            });
        }.bind(this);
    },
    template: `
        <transition enter-active-class="section-in" leave-active-class="section-out" appear>
            <div class="imageview section" v-show="show">
                <img :src="extra + (img.fullmode ? img.full : img.data)" v-if="img">
                <div class="close" @click="show=false">&times;</div>
                <div class="left" @click="toLeft"></div>
                <div class="right" @click="toRight"></div>
                <div class="menu">
                    <slot></slot>
                </div>
                <div class="copyright" @click="copyright" v-if="img">Unsplash / {{ img.user }} / {{ img.description }}</div>
            </div>
        </transition>
    `
});
