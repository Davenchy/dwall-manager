Vue.component('x-model', {
    data: function () {
        return {
            value: 'Default Value',
            title: 'Hello World!',
            active: false,
            done: null
        }
    },
    methods: {
        onDone: function () {
            this.active = false;
            this.done(this.value);
        },
        onClose: function () {
            this.active = false;
        },
        show: function (title = '', value = '', done) {
            this.active = false;
            this.title = title;
            this.value = value;
            this.done = done;
            this.active = true;
            this.$nextTick(() => this.$refs.output.focus())
        }
    },
    template: '#model'
});
