/**
 * BootstrapDatepicker
 * <p>for Vue 2.6.14 with Bootstrap 4.2</p>
 * @version 0.01
 * @author RCF jasonchiang
 * @since 2024/1/11
 * <p>請直接使用v-model跟一個Array物件綁定此元件</p>
*/
export const BootstrapDatepicker = {
    name:'BootstrapDatepicker',

    props: {
        value: {
            type: Array,
            default: () => []
        }
    },

    template:`
              <div class="row p-1">

                <div class="mr-2">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">時間區間</span>
                    </div>
                    <input type="text"
                           placeholder="請輸入起始時間"
                           onfocus="this.type = 'date'"
                           :max="end"
                           @change="startOnChange()"
                           v-model="start"
                           class="form-control">

                    <input type="text"
                           placeholder="請輸入結束時間"
                           onfocus="this.type = 'date'"
                           v-model="end"
                           :min="start"
                           class="form-control"
                           @change="setResult(); startEventsControl = true;"
                           :disabled="start === null || start === ''">
                  </div>
                </div>
                
              </div>
            `,

    data(){
        return {
            start: "",
            end: "",

            // 第一次只更動起始日期時不應該更新最終數值
            // 所以有這個卡控
            startEventsControl: false,
        }
    },

    methods: {
        setResult(){
            this.result = []

            this.result.push(this.start)
            this.result.push(this.end)

            this.$emit('input', this.result);
        },

        /**
         * 起始日期更新卡控
         */
        startOnChange(){
            if (this.startEventsControl)
                this.setResult()
        }
    },

    watch: {
        value(newVal) {
            this.result = newVal;
        }
    }
}