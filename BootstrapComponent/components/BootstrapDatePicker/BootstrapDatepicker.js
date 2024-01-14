import {BootstrapCalendar} from "../BootstrapCalendar/BootstrapCalendar.js";

/**
 * BootstrapDatepicker
 * <p>for Vue 2.6.14 with Bootstrap 4.2</p>
 * @version 0.02
 * @author RCF jasonchiang
 * @since 2024/1/15
 * <p>請直接使用v-model跟一個Array物件綁定此元件</p>
 */
export const BootstrapDatepicker = {
    components: {
        'BCalendar': BootstrapCalendar
    },

    props:{
        value: {
            type: Array,
            default: () => []
        }
    },

    template: `
                <div>
                  <div class="input-group position-relative" @click="showSelector = true">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <b>請選擇時間區間</b>
                      </span>
                    </div>
                    <span type="text" class="form-control bg-white text-center" style="width: 18rem">
                      {{ displayResult }}
                    </span>
                  </div>

                  <template v-if="showSelector">
                    <div class="position-absolute mt-2 ml-2" style="z-index: 100">
                      <b-calendar v-model="result"></b-calendar>
                    </div>
                  </template>

                </div>
            `,

    data(){
        return {
            result: [],

            showSelector: false
        }
    },

    computed:{
        displayResult(){
            if (this.result.length === 0){
                return "請點擊打開面板"
            }else {
                return this.buildDisplayDate(this.result[0]) + " 到 " + this.buildDisplayDate(this.result[1]);
            }
        },
    },

    watch: {
        result(newValue){
            if (newValue){
                this.showSelector = false;
                this.$emit('input', newValue);
            }
        }
    },

    methods: {
        buildDisplayDate(date){
            const year = date.split("-")[0];
            const month = parseInt(date.split("-")[1], 10);
            const day = parseInt(date.split("-")[2], 10);

            return `${year}年${month}月${day}日`;
        },
    },

}
