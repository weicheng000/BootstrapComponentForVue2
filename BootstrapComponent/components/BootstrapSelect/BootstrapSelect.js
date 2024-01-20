import {BootstrapIcon} from "../BootstrapIcon.js";

export const BootstrapSelect = {
    name: 'BootstrapSelect',

    components: {
        'BootstrapIcon': BootstrapIcon
    },

    props: {
        selectArray: {
            type: Array,
            required: true
        },

        value: {
            required: true
        },

        placeholder: {
            type: String,
            default: () => 'Action'
        }
    },

    template: `
      <div :class="{'btn-group btn-sm': true,  'show': isOpen}" @click="isOpen = !isOpen; dropSearch = '';">
        <template v-if="title === ''">
          <span class="btn btn-light">{{ placeholder }}</span>
        </template>
        <template v-else>
          <input type="button" :value="title" class="btn btn-light">
          <span class="btn btn-light" @click="title = ''; nowValue = ''">
            <bootstrap-icon name="bi-x-circle"></bootstrap-icon>
          </span>
        </template>

        <span class="btn btn-primary dropdown-toggle dropdown-toggle-split"></span>

        <div :class="{'dropdown-menu': true, 'show': isOpen}"
             style="padding-top: 0.25rem;" @click.stop>
          <div class="input-group input-group-sm pl-1 pr-1 mb-1">
            <div class="input-group-prepend">
                  <span class="input-group-text bg-primary text-white">
                    <bootstrap-icon name="bi-search"></bootstrap-icon>
                  </span>
            </div>
            <input class="form-control" v-model="dropSearch" type="text">
          </div>
          
          <div class="overflow-auto" style="max-height: 250px;">
            <template v-if="filteredArray.length === 0">
              <span class="dropdown-item">沒有匹配的結果</span>
            </template>
            <template v-else>
              <template v-for="select in filteredArray">
                
                <a class="dropdown-item" href="#" @click="itemClickEvent($event, select)" v-if="select.slot">
                  <slot :name="select.slot"></slot>
                </a>
                
                <template v-if="!select.isDivider && !select.slot">
                  <a class="dropdown-item" href="#" @click="itemClickEvent($event, select)">
                      {{ select.option }}
                  </a>
                </template>
                
                <template v-else-if="select.isDivider">
                  <div class="dropdown-divider"></div>
                </template>
                
              </template>
            </template>
          </div>
          
        </div>
      </div>
    `,

    data() {
        return {
            isOpen: false,
            title: '',
            dropSearch: '',
            nowValue: null
        }
    },

    mounted() {
        document.body.addEventListener('click', this.clickOutsideHandler);
    },

    computed: {
        filteredArray() {
            const regex = new RegExp(this.dropSearch, 'i');
            return this.selectArray.filter(item => regex.test(item.option));
        }
    },

    watch: {
        nowValue(newValue) {
            this.$emit('input', newValue);
        }
    },

    methods: {
        itemClickEvent(event, select) {
            event.preventDefault();
            this.title = select.option;
            this.nowValue = select.value;
            this.isOpen = false;
        },

        clickOutsideHandler(event) {
            if (!this.$el.contains(event.target)) {
                this.isOpen = false;
            }
        }
    },
}