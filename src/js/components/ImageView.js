Vue.component('x-imageview', {
    data: function () {
        return {
            show: false,
            index: 0,
            img: '',
            extra: "data:image/jpg;base64,"
        }
    },
    methods: {
        view: function (data) {
            this.img = data;
            this.show = true;
        },
        wallpaper: function () {
            desktop.setWallpaper(this.img, true);
        }
    },
    template: `
        <div class="imageview" v-show="show">
            <img :src="extra + img" @click="wallpaper">
            <div class="close" @click="show=false">&times;</div>
            <!--<div class="left"></div>-->
            <!--<div class="right"></div>-->
            <!--<div class="top"></div>-->
        </div>
    `
})
