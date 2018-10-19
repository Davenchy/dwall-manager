Vue.component('x-settings', {
    data: function () {
        return {
            show: false,
            settings: {},
        }
    },
    methods: {},
    created: function() {
        const self = this;
        cmd.settings = new Object();
        cmd.settings.show = function () { self.show = true; }.bind(this);
        cmd.settings.import = function (settings) {self.settings = settings}.bind(this);
    },
    template: `
        <transition enter-active-class="section-in" leave-active-class="section-out" appear>
            <div class="section settings" v-show="show">
                <div class="close" @click="show=false">&times;</div>
                <h2 style="overflow: auto;">
                    <p>Settings:</p>
                    <span class="btn" style="float: right;" @click="cmd.save()">Save</span>
                </h2>
                <hr/>
                <div class="row flex center">
                    <p style="width: 200px;">Unsplash API</p>
                    <div class="col lg-1">
                        <input type="text" v-model="settings.client_id">
                    </div>
                    <p>
                        <span class="btn" @click="shell.openExternal('https://unsplash.com/oauth/applications')">Get One</span>
                    </p>
                </div>
                <hr/>
                <div class="row flex center">
                    <p style="width: 200px;">Grid Columns ({{ settings.cols }})</p>
                    <input type="range" min="1" max="5" v-model="settings.cols" class="col lg-1">
                </div>
            </div>
        </transition>
    `
})
