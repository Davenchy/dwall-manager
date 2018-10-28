Vue.component('x-dialog-element', {
    props: {
        content: { type: Object, default: new Object }
    },
    data: function() {
        return {
            element: {}
        }
    },
    mounted() {
        // defaults
        this.element = Object.assign({
            value: '',
            required: false,
            min: 0, max: 0,
            canClose: true,
            children: [],
            focus: false,
            entPoint: false,
            action: function () {},
            show: true,
            inputType: 'text'
        }, this.content);

        if (this.element.list) this.element.list = this.element.list.map(i => { return {key: i, value: i}});
        else if (this.element.advlist) this.element.list = this.element.advlist;

        if (this.element.focus) this.$nextTick(() => this.$refs.element.focus())
        if (this.element.ref !== undefined) this.onBuild();
    },
    methods: {
        onAction: function (enter) {
            const {type, inputType} = this.element;
            if (type === 'input', !inputType === 'range', enter) this.$emit('action', this.element);
        },
        onComplexAction: function (item, enter) { this.$emit('action', item, enter); },
        onBuild: function () { this.$emit('build', this.element); },
        onComplexBuild: function (item) { this.$emit('build', item); }
    },
    template: `

    <input v-if="element.type == 'input'" v-show="element.show"
        :type="element.inputType"
        @keydown.enter="onAction(true)"
        @change="onAction(false)"
        :class="element.class"
        :title="element.title"
        :style="element.style"
        v-model="element.value"
        :placeholder="element.placeholder"
        ref="element"
        :min="element.min"
        :max="element.max"
        :requiered="element.required"
    >

    <p v-else-if="element.type == 'label'" v-show="element.show"
        class="label"
        :class="element.class"
        :title="element.title"
        :style="element.style"
        :requiered="element.required"
        ref="element"
    >{{ element.text }}</p>

    <p v-else-if="element.type == 'title'" v-show="element.show"
        class="label center title"
        :class="element.class"
        :title="element.title"
        :style="element.style"
        :requiered="element.required"
        ref="element"
    >{{ element.text }}</p>

    <div v-else-if="element.type == 'line'" v-show="element.show"
        class="line"
        :class="element.class"
        :style="element.style"
        ref="element"
    />

    <div v-else-if="element.type == 'html'" v-show="element.show"
        :class="element.class"
        :style="element.style"
        ref="element"
        v-html="element.html"
    />

    <input v-else-if="element.type == 'button'" v-show="element.show"
        class="btn"
        type="button"
        @click="onAction"
        :class="element.class"
        :title="element.title"
        :style="element.style"
        :value="element.text"
        ref="element"
        :requiered="element.required"
    >

    <select v-else-if="element.type == 'options'" v-show="element.show"
        class="options"
        :class="element.class"
        :style="element.style"
        :title="element.title"
        v-model="element.value"
        ref="element"
        @change="onAction"
        :requiered="element.required"
    >
        <option v-for="(k, i) in element.list" :key="i" :value="k.key">{{k.value}}</option>
    </select>


    <div v-else-if="element.type == 'checkbox'" v-show="element.show" class="group" :class="element.class" :style="element.style">
        <p style='display: inline-block' :title="element.title">{{ element.text }}</p>
        <input
            style="display: inline-block; width: 20px;"
            type="checkbox"
            @change="onAction"
            ref="element"
            :title="element.title"
            v-model="element.checked"
            :requiered="element.required"
        >
    </div>

    <div v-else-if="element.type == 'group'" v-show="element.show"
        class="group"
        :class="element.class"
        :style="element.style"
    >
        <template v-for="(item, i) in element.children">
            <x-dialog-element :content="item" @action="onComplexAction" @build="onComplexBuild" />
        </template>
    </div>

    <div v-else-if="element.type == 'raw'" v-show="element.show"
        class="raw"
        :class="element.class"
        :style="element.style"
    >
        <template v-for="(item, i) in element.children">
            <x-dialog-element :content="item" @action="onComplexAction" @build="onComplexBuild" />
        </template>
    </div>

    `
});
