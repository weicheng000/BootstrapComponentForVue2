import {BootstrapIcon} from "../BootstrapIcon.js";

const AutocompleteBar = {
    name: 'AutocompleteBar',

    props: {
        value: {
            type: Array,
            required: true
        }
    },

    template: `
          <div class="overflow-auto"
               style="max-height: 250px;">
            <template v-if="value.length === 0">
              <span class="dropdown-item">沒有匹配的結果</span>
            </template>
            <template v-else>
              <template v-for="(select, index) in value">

                <a class="dropdown-item" href="#" @click="itemClickEvent($event, select)" v-if="select.slot">
                  <slot :name="select.slot"></slot>
                </a>

                <template v-if="!select.isDivider && !select.slot">
                  <a :class="{'dropdown-item': true, 'active': focusTarget(index)}" href="#" @click="itemClickEvent($event, select)">
                    {{ select.option }}
                  </a>
                </template>

                <template v-else-if="select.isDivider">
                  <div class="dropdown-divider"></div>
                </template>

              </template>
            </template>
          </div>
        `,

    data() {
        return {
            nowIndex: -1
        };
    },

    watch: {
        value(){
            this.nowIndex = -1;
        }
    },

    mounted() {
        this.nowIndex = -1;
        window.addEventListener('keydown', this.windowKeyboardEvent)
    },

    methods: {
        focusTarget(index){
            return this.nowIndex === index;
        },

        windowKeyboardEvent(event){
            if (event.keyCode === 38){
                this.decrementIndex();
            }else if (event.keyCode === 40){
                this.incrementIndex();
            }else if (event.keyCode === 13){
                const data = this.value[this.nowIndex].option;
                if (data !== undefined){
                    this.$emit('update', this.value[this.nowIndex]);
                }
            }
        },

        decrementIndex() {
            if (this.nowIndex === -1){
                this.nowIndex = 0;
                return;
            }

            if (this.nowIndex - 1 >= 0) {
                this.nowIndex -= 1;
                this.focusDisplayTarget()
            }
        },

        incrementIndex(){
            if (this.nowIndex === -1){
                this.nowIndex = 0;
                return;
            }

            if (this.nowIndex + 1 < this.value.length){
                this.nowIndex += 1;
                this.focusDisplayTarget()
            }
        },

        focusDisplayTarget(){
            this.$nextTick(() => {
                const activeItem = this.$el.querySelector('.active');
                if (activeItem) {
                    activeItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            });
        },

        itemClickEvent(event, select) {
            event.preventDefault();
            this.$emit('update', select)
        }
    },

    beforeDestroy(){
        this.nowIndex = -1;
        window.removeEventListener('keydown', this.windowKeyboardEvent);
    }
}

export const BootstrapAutocompleteInput = {
    name: 'BootstrapAutocompleteInput',

    components: {
        'ABar': AutocompleteBar,
        'BIcon': BootstrapIcon
    },

    props: {
        selectArray: {
            type: Array,
            required: true
        },

        value: {
            required: true
        }
    },

    template: `
          <div class="dropdown">
            <div class="btn-group">
              <span class="btn btn-primary">
                <b-icon name="bi-search"></b-icon>
              </span>
              <input class="btn border-primary dropdown-toggle text-left"
                     v-model="dropSearch"
                     ref="input"
                     placeholder="請按 / 快速聚焦"
                     @focus="showDropDown"
                     type="text">
            </div>


            <div :class="{'dropdown-menu w-100 shadow': true, 'show': isOpen}">
              <a-bar
                  @update="autocompleteEvent"
                  v-model="filteredArray"></a-bar>
            </div>
          </div>

        `,

    data() {
        return {
            isOpen: false,
            dropSearch: ''
        }
    },

    mounted() {
        document.body.addEventListener('click', this.clickOutsideHandler);
        window.addEventListener('keyup', this.keyPressed);
    },

    watch:{
        dropSearch(newValue){
            this.$emit('input', newValue)
        }
    },

    computed: {
        filteredArray() {
            const escapedSearch = this.escapeRegExp(this.dropSearch);
            const regex = new RegExp(escapedSearch, 'i');

            return this.selectArray.filter(item => regex.test(item.option));
        }
    },

    methods: {
        showDropDown() {
            this.isOpen = true;
        },

        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        autocompleteEvent(select) {
            this.dropSearch = select.option;
            this.isOpen = false
        },

        clickOutsideHandler(event) {
            if (!this.$el.contains(event.target)) {
                this.isOpen = false;
            }
        },

        keyPressed(event){
            if (event.key === '/' && this.dropSearch === ''){
                this.$refs.input.focus();
            } else if (event.key === 'Escape') {
                this.$refs.input.blur();
                this.isOpen = false;
            }
        },
    }
}