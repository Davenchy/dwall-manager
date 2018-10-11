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
            showinput: false,
            showpos: true,
            showneg: true,
            canclose: true,
            placeholder: '',
            hideid: null
        }
    },
    methods: {
        // return answer after close the model
        onDone: function () {
            this.active = false;
            if (!this.showinput) this.done(true);
            else this.done(this.value);
        },
        // on close event
        onClose: function () {
            if (!this.canclose) return;
            this.active = false;
            if (!this.showinput) this.done(false);
            this.close();
        },

        // popup a new model one per time
        show: function (title = '', value = '', done, obj = {}) {
            this.showadv({ title, value, done, ...obj });
        },
        // more advanced options
        // title: model title
        // value: textbox default value
        // showInput: don't render textbox
        // positive: positive button value
        // negative: negative button value
        // placeholder: textbox placeholder
        // showPositive: display positive button
        // showNegative: display negative button
        // canClose: can user close the model
        // done: on done callback
        // close: on close callback
        showadv: function (obj) {
            this.active = false;

            if (obj.showNegative !== false) obj.showNegative = true;
            if (obj.showPositive !== false) obj.showPositive = true;
            if (obj.showInput !== false) obj.showInput = true;
            if (obj.canClose !== false) obj.canClose = true;

            this.showpos = obj.showPositive;
            this.showneg = obj.showNegative;
            this.title = obj.title || '';
            this.value = obj.value || '';
            this.done = obj.done || function(){};
            this.close = obj.close || function(){};
            this.pos = obj.positive || 'done';
            this.neg = obj.negative || 'close';
            this.showinput = obj.showInput;
            this.placeholder = obj.placeholder || '';
            this.canclose = obj.canClose;

            this.active = true;
            if (this.showinput) this.$nextTick(() => this.$refs.output.focus())
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
