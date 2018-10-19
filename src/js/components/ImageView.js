Vue.component('x-imageview', {
    data: function () {
        return {
            show: false,
            index: 0,
            extra: "data:image/jpg;base64,"
        }
    },
    methods: {
        copyright: function () { shell.openExternal(this.img().html) },
        view: function (img) {
            this.setIndex(img);
            this.show = true;
        },
        toLeft: function () {
            this.index--; if (this.index < 0) this.index = cmd.grid.images().length - 1;
        },
        toRight: function () {
            this.index++; if (this.index > cmd.grid.images().length - 1) this.index = 0;
        },
        setIndex: function (img) {
            const images = cmd.grid.images();
            for (let i = 0; i < images.length; i++) if (images[i].id === img.id) { this.index = i; return true; }
            return false;
        },
        img: function () {
            if (!cmd) return;
            if (!cmd.grid) return;
            if (!cmd.grid.images()) return;
            return cmd.grid.images()[this.index];
        }
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
    },
    template: `
        <transition enter-active-class="section-in" leave-active-class="section-out" appear>
            <div class="imageview section" v-show="show">
                <img :src="extra + img().full" v-if="img()">
                <div class="close" @click="show=false">&times;</div>
                <div class="left" @click="toLeft"></div>
                <div class="right" @click="toRight"></div>
                <div class="menu">
                    <slot></slot>
                </div>
                <div class="copyright" @click="copyright" v-if="img()">Unsplash / {{ img().user }} / {{ img().description }}</div>
            </div>
        </transition>
    `
})
