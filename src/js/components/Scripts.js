Vue.component('x-scripts', {
    data: function () {
        return {
            show: false,
            settings: {},
        }
    },
    methods: {},
    created: function() {
        const self = this;
        cmd.scripts = new Object();
        cmd.scripts.show = function () { self.show = true; }.bind(this);
    },
    template: `
        <transition enter-active-class="section-in" leave-active-class="section-out" appear>
            <div class="section settings" v-show="show">
                <div class="close" @click="show=false">&times;</div>
            </div>
        </transition>
    `
})
