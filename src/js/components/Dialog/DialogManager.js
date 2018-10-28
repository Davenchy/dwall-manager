Vue.component('x-dialog-manager', {
    data: function () {
        return {
            active: true,
            dialogs: {},
        }
    },
    methods: {
        createDialog: function (data, active = true) {
            const self = this;
            const id = uuid();
            var content = [];
            if (Array.isArray(data)) { content = data.map(i => i); data = {}; }
            var dialog = Object.assign({
                id, content, active, done: function () {},
                close: function () { this.hide(); },
                refs: {}, autoKill: true, actions: {}
            }, data);

            dialog['kill'] = function (timer = 0) { this.hide(); setTimeout(() => delete self.dialogs[id], timer); }.bind(dialog);
            dialog['hide'] = function (timer = 0) { setTimeout(() => this.active=false, timer) }.bind(dialog);
            dialog['show'] = function (timer = 0) { setTimeout(() => this.active=true, timer) }.bind(dialog);
            dialog['do'] = function (cb, timer = 0) { setTimeout(() => cb.bind(this)(), timer) }.bind(dialog);

            var done = dialog.done;
            dialog.done = function (state) {
                if (state === 'Close' || state === 'CloseAndKill') this.close.bind(this)();
                if (state === 'EndPoint') done.bind(this)();
                if (this.autoKill || state === 'CloseAndKill') this.kill(1000);
            }.bind(dialog);

            Vue.set(this.dialogs, id, dialog);
            return dialog;
        }
    },
    mounted: function () {
        cmd.dialog = new Object();
        cmd.dialog.build = this.createDialog.bind(this);
        cmd.dialog.alert = function (msg) {
            this.createDialog([
                { type: 'title', text: msg },
                { type: 'group', class: 'clearfix', children: [
                    { type: 'button', text: 'close', close: true, class: 'red right' }
                ]}
            ])
        }.bind(this);
        cmd.dialog.dialogs = this.dialogs;
    },
    template: `
<div>
    <x-dialog v-if="active" v-for="i in dialogs" :key="i.id" :data="i"/>
</div>
`
});

