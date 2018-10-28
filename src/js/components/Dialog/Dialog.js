Vue.component('x-dialog', {
    props: ['data'],
    data: function () {
        return {}
    },
    methods: {
        onAction: function (item) {
            if (!item) return;
            if (item.action !== undefined) {
                // ref to action
                if (typeof item.action === 'string') {
                    this.data.actions[item.action]
                        .bind(this.data)(item);
                }
                // item action fn
                else item.action.bind(this.data)(item);
            }
            if (item.close) { this.data.done('Close'); }
            if (item.closeAndKill) { this.data.done('CloseAndKill'); }
            if (item.endPoint) { this.data.done('EndPoint'); }
        },
        onBuild: function (item) { this.data.refs[item.ref] = item; }
    },
    template: `
        <transition
            enter-active-class="dialog-anim-in"
            leave-active-class="dialog-anim-out"
            appear
        >
            <div class="dialog" v-show="data.active">
                <transition
                    enter-active-class="dialog-container-anim-in"
                    leave-active-class="dialog-container-anim-out"
                    appear
                >
                    <form class="container" @submit.prevent>
                        <template v-for="(item, i) in data.content">
                            <x-dialog-element :content="item" @action="onAction" @build="onBuild" :key="i" />
                        </template>
                    </form>
                </transition>
            </div>
        </transition>
    `
});

