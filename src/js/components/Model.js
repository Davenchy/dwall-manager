// to show dialog model
Vue.component('x-model', {
    data: function () {
        return {
            value: 'Default Value',
            title: 'Hello World!',
            active: false,
            done: function(){},
            close: function(){},
            pos: 'done',
            neg: 'close',
            yesorno: false,
            showpos: true,
            showneg: true,
            placeholder: '',
            hideid: null
        }
    },
    methods: {
        // return answer after close the model
        onDone: function () {
            this.active = false;
            if (this.yesorno) this.done(true);
            else this.done(this.value);
        },
        // on close event
        onClose: function () {
            this.active = false;
            if (this.yesorno) this.done(false);
            this.close();
        },
        // popup a new model one per time
        show: function (title = '', value = '', done, obj = {}) {
            this.showadv({ title, value, done, ...obj });
        },
        // more advanced options
        // title: model title
        // value: textbox default value
        // yesorno: don't render textbox
        // positive: positive button value
        // negative: negative button value
        // placeholder: textbox placeholder
        // showPositive: display positive button
        // showNegative: display negative button
        // done: on done callback
        // close: on close callback
        showadv: function (obj) {
            this.active = false;

            this.title = obj.title || '';
            this.value = obj.value || '';
            this.done = obj.done || function(){};
            this.close = obj.close || function(){};
            this.pos = obj.positive || 'done';
            this.neg = obj.negative || 'close';
            this.yesorno = obj.yesorno || false;
            this.placeholder = obj.placeholder || '';
            this.showpos = obj.showPositive || true;
            this.showneg = obj.showNegative || true;

            this.active = true;
            if (!this.yesorno) this.$nextTick(() => this.$refs.output.focus())
        },
        // hide model after time[ms] then callback
        hide: function (time = 0, cb) {
            if (this.hideid) clearTimeout(this.hideid)
            var self = this;
            this.hideid = setTimeout(() => { self.active = false; cb(); self.hideid = null; }, time);
        }
    },
    template: '#model'
});
