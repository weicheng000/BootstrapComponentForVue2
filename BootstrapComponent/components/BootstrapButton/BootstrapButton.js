import {BootstrapIcon} from "../BootstrapIcon.js";

/**
 * Bootstrap Button for Ajax
 * <p>for Vue 2.6.14 with Bootstrap 4.2</p>
 * @version 0.01
 * @since 2024/1/18
 * @author jasonchiang
 */
export const BootstrapButton = {
    name: 'BootstrapButton',

    components:{
        'BIcon':BootstrapIcon
    },

    props: {
        loading: {
            type: Boolean,
            default: false
        },
        loadingText:{
            type: String,
            default: () => 'loading...'
        },
        preIcon:{
            type: String
        },
        appendIcon:{
            type: String
        }
    },

    template: `
                <button type="button"
                        class="btn"
                        @click="handleClick"
                        :disabled="loading">
                  <template v-if="loading">
                    <div class="d-flex justify-content-center align-items-center">
                      <div class="spinner-border small-spinner" />
                      <span class="ml-1">{{ loadingText }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <slot name="pre">
                      <template v-if="preIcon">
                        <b-icon :name="preIcon" class="mr-1" />
                      </template>
                    </slot>
                    <slot>
                      Click
                    </slot>
                    <slot name="append">
                      <template v-if="appendIcon">
                        <b-icon :name="appendIcon" class="ml-1" />
                      </template>
                    </slot>
                  </template>
                </button>
            `,

    methods: {
        handleClick() {
            this.$emit('click');
        }
    }
}