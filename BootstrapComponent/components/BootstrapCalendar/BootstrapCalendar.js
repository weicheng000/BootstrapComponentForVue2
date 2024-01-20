/**
 * BootstrapCalendar
 * <p>for Vue 2.6.14 with Bootstrap 4.2</p>
 * @version 0.05
 * @author RCF jasonchiang
 * @since 2024/1/17
 * <p>請直接使用v-model跟一個Array物件綁定此元件</p>
 * <p>title 日歷的標題</p>
 * <p>modal屬性啟用鍵盤監聽ESC, 以及外部點擊監控</p>
 */
export const BootstrapCalendar = {
    name: 'BootstrapCalendar',

    props: {
        value: {
            type: Array,
            default: () => []
        },
        title:{
            type: String,
            default: () => 'Select Date'
        }
    },

    template: `
          <div class="bc-picker-container">
            <div class="card-header bg-primary text-white font-weight-bold">
              <p>{{ title }}</p>
              <template>
                {{ headerDisplayText }}
              </template>
            </div>

            <div class="card-body">
              <div class="row justify-content-between align-items-center p-2">

                <div @click="isSubSelect = true"
                    class="yearAndMonth p-2">
                  <span>{{ year }}</span>
                  <span> 年 </span>
                  <span>{{ month }} 月</span>
                </div>

                <div>
                  <button type="button"
                          @click="buttonChangeEvent(-1)"
                          class="btn btn-sm" :disabled="isSelectYear === false">&lt;</button>
                  <button type="button"
                          @click="buttonChangeEvent(1)"
                          class="btn btn-sm" :disabled="isSelectYear === false">&gt;</button>
                </div>

              </div>

              <!-- 副控件 年份月份選擇器 -->
              <template v-if="isSubSelect">
                <div class="row p-2">
                  <template v-if="isSelectYear">
                    <button v-for="year in selectYearArray" :key="year"
                            @click="changeYearBySubSelect(year)"
                            class="col-6 text-center btn">{{ year }}</button>
                  </template>
                  <template v-else>
                    <button v-for="(month, index) in monthSelectArray" :key="index"
                            @click="changeMonthBySubSelect(index + 1)"
                            class="col-4 text-center btn">{{ month }}</button>
                  </template>
                </div>
              </template>

              <!-- 主控件 日期選擇器 -->
              <template v-else>
                <div class="row justify-content-between align-items-center p-2">

                      <span v-for="title in weekday"
                            class="itemDiv"
                            :key="title">
                        <b>{{ title }}</b>
                      </span>
                </div>
                <div v-for="(week, weekIndex) in currentMonthArray"
                     class="row justify-content-between p-2"
                     :key="weekIndex">
                  <template>
                    <div v-for="(day, index) in week" class="itemDiv"
                         :key="index">
                      <template v-if="day !== 0">
                          <span :class="{'dateItem': true, 'isBetweenRange': isBetweenRange(day) || isFinishSelect(day) ,'active': isActive(day)}"
                                @mouseenter="getNowHoverItem(day)"
                                @mouseleave="resetNowHoverItem()"
                                @click="getSelectDate(day)">
                            {{ day }}
                          </span>
                      </template>

                      <template v-else>
                            <span v-if="weekIndex === 0" class="another" @click="changeMonth(-1)">
                              {{ lastMonthDaysArray[index] }}
                            </span>
                        <span v-else class="another" @click="changeMonth(1)">
                              {{ nextMonthDaysArray[index] }}
                            </span>
                      </template>

                    </div>
                  </template>

                </div>

                <div class="row justify-content-center align-items-center p-2">
                  <button type="button"
                          @click="sendResult()"
                          class="btn btn-primary btn-sm mr-2">確定</button>
                </div>
              </template>


            </div>
          </div>
        `,

    data() {

        const currentDate = new Date();

        return {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,

            headerDisplay: "",

            // 副控件選擇器
            isSubSelect: false,

            // 年月份選擇器
            isSelectYear: true,

            // 星期標題，預計設計成可實現i18n
            weekday: ['日', '一', '二', '三', '四', '五', '六'],

            // 月份選擇標題，預計設計成可實現i18n
            monthSelectArray:[
                '一月', '二月', '三月', '四月',
                '五月', '六月', '七月', '八月',
                '九月', '十月', '十一月', '十二月'
            ],

            // 追蹤懸停日期
            nowHoverItem: "",

            // 回傳物件
            result: [],

            isModal: false,
            outSideClickTime: 0,
        }
    },

    computed: {
        currentMonthArray() {
            return this.buildDaysArray(this.year, this.month);
        },

        lastMonthDaysArray() {
            return this.buildLastMonthDaysArray();
        },

        nextMonthDaysArray() {
            return this.buildNextMonthDaysArray();
        },

        selectYearArray() {
            let decade = Math.floor(this.year / 10) ;
            return this.buildYearArray(decade);
        },

        // 顯示文字，帶改成可實現i18n的形式
        headerDisplayText(){
            if (this.result.length === 0){
                return "請選擇時間";
            } else if (this.result.length === 1){
                const startDateText = this.buildDisplayDate(this.result[0]);
                return startDateText + "到 請選擇結束時間";
            }else {
                const startDateText = this.buildDisplayDate(this.result[0]);
                const endDateText = this.buildDisplayDate(this.result[1]);
                return startDateText + " 到 " + endDateText;
            }
        }

    },

    created(){
        // 判定是否有modal屬性
        if (this.$attrs.modal !== undefined) {
            this.isModal = true;
        }
    },

    mounted() {
        this.result = [...this.value];

        if (this.value[0] !== undefined){
            const dateObject = new Date(this.value[0]);
            const year = dateObject.getFullYear();
            const month = dateObject.getMonth() + 1;

            this.year = year;
            this.month = month;
        }

        // 如果有，就註冊鍵盤監聽Esc鍵
        if (this.isModal){
            document.addEventListener('keydown', this.handleEscKey);
        }
    },

    methods: {
        // 計算日期陣列區塊 開始

        getDaysInMonth(year, month) {
            if (month === 4 || month === 6 || month === 9 || month === 11) {
                return 30;
            } else if (month === 2) {
                return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
            } else {
                return 31;
            }
        },

        buildDaysArray(year, month) {
            let dayInMonth = this.getDaysInMonth(year, month);
            let firstDayOfMonth = new Date(year, month - 1, 1).getDay();
            let date = [];

            for (let i = 0; i < firstDayOfMonth; i++) {
                date.push(0);
            }

            for (let i = 0; i < dayInMonth; i++) {
                date.push(i + 1);
            }

            let monthArray = [];
            let weekArray = [];

            for (let i = 0; i < date.length; i++) {
                weekArray.push(date[i]);

                if (weekArray.length === 7) {
                    monthArray.push([...weekArray]);
                    weekArray = [];
                }
            }

            if (weekArray.length > 0) {
                while (weekArray.length < 7) {
                    weekArray.push(0);
                }
                monthArray.push([...weekArray]);
            }

            return monthArray;
        },

        buildLastMonthDaysArray() {
            let yearOfLastMonth = this.month === 1 ? this.year - 1 : this.year;
            let monthOfLastMonth = this.month === 1 ? 12 : this.month - 1;
            let lastMonthDaysArray = this.buildDaysArray(yearOfLastMonth, monthOfLastMonth);
            return lastMonthDaysArray[lastMonthDaysArray.length - 1];
        },

        buildNextMonthDaysArray() {
            let yearOfNextMonth = this.month === 12 ? this.year + 1 : this.year;
            let monthOfNextMonth = this.month === 12 ? 1 : this.month + 1;
            return this.buildDaysArray(yearOfNextMonth, monthOfNextMonth)[0];
        },

        buildYearArray(decade, range = 10) {
            const yearBase = decade * 10;
            let yearArray = [];

            for (let i = 0; i < range; i++){
                yearArray.push(yearBase + i);
            }

            return yearArray;
        },
        // 計算日期陣列區塊 結束

        // 顯示選擇控件 開始

        isActive(day) {
            if (this.result.length === 0) {
                return false;
            }

            const targetDate = this.buildHtmlDate(this.year, this.month, day);

            return this.result.some(date => targetDate === date);
        },

        isBetweenRange(day) {
            if (this.result.length === 0 || this.result.length === 2) {
                return false;
            }

            if (this.nowHoverItem === ""){
                return false;
            }

            const targetDate = this.buildHtmlDate(this.year, this.month, day);

            const minDate = Math.min(Date.parse(this.result[0]), Date.parse(this.nowHoverItem));
            const maxDate = Math.max(Date.parse(this.result[0]), Date.parse(this.nowHoverItem));

            return minDate < Date.parse(targetDate) && Date.parse(targetDate) < maxDate;
        },

        isFinishSelect(day){
            if (this.result.length === 2){
                const targetDate = this.buildHtmlDate(this.year, this.month, day);

                return Date.parse(this.result[0]) < Date.parse(targetDate) && Date.parse(targetDate) < Date.parse(this.result[1]);
            }
        },

        // 顯示選擇控件 結束

        // 功能區塊 開始

        buttonChangeEvent(number){
            if (this.isSubSelect){
                this.changeYear(number);
            }else {
                this.changeMonth(number);
            }
        },

        changeYear(number, range = 10){
            this.year += number * range;
        },

        changeMonth(number) {
            const tempMonth = this.month + number

            if (tempMonth < 1) {
                this.month = 12;
                this.year -= 1;
            } else if (tempMonth > 12) {
                this.month = 1;
                this.year += 1;
            } else {
                this.month = tempMonth;
            }

        },

        changeYearBySubSelect(year){
            this.year = year;
            this.isSelectYear = false;

        },

        changeMonthBySubSelect(month){
            this.month = month;
            this.isSelectYear = true;
            this.isSubSelect = false;
        },

        getNowHoverItem(day){
            this.nowHoverItem = this.buildHtmlDate(this.year, this.month, day);
        },

        resetNowHoverItem(){
            this.nowHoverItem = "";
        },

        buildHtmlDate(year, month, day) {
            const paddedMonth = String(month).padStart(2, '0');
            const paddedDay = String(day).padStart(2, '0');

            return `${year}-${paddedMonth}-${paddedDay}`;
        },

        buildDisplayDate(date){
            const year = date.split("-")[0];
            const month = parseInt(date.split("-")[1], 10);
            const day = parseInt(date.split("-")[2], 10);

            return `${year}年${month}月${day}日`;
        },

        // 主選擇入口，目前只做了選時間範圍的分支
        getSelectDate(day) {
            let target = this.buildHtmlDate(this.year, this.month, day);

            this.getRangeSelectDate(target);
        },

        getRangeSelectDate(target) {
            if (target === this.result[0]) {
                this.result.shift();
                // console.log("Drop first element by double select.")
                return;
            } else if (target === this.result[1]) {
                this.result.pop();
                // console.log("Drop last element by double select.")
                return;
            }

            if (this.result.length < 2) {
                this.result.push(target)
            } else {
                this.result = [];
                // console.log("Drop array by triple select.")
            }

            if (this.result.length === 2) {
                this.result.sort((a, b) => Date.parse(a) - Date.parse(b));
            }
        },

        // 確保只由在長度為0或者長度為2時 點下確定才更新主元件的值
        sendResult() {
            let tempResult = [];

            if (this.result.length === 2 || this.result.length === 0) {
                tempResult = [...this.result];
                // console.log(tempResult);
            }

            this.$emit('input', tempResult);
        },

        // ESC按鍵綁定方法
        handleEscKey(event) {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        },

        // 父組件綁定事件

        // esc綁定
        closeModal() {
            this.$emit('esc-click');
        },

        // 功能區塊 結束
    },

    beforeDestroy() {
        if (this.isModal){
            // 在組件被銷毀之前移除全部監聽器，以防止內存洩漏
            document.removeEventListener('keydown', this.handleEscKey);
        }
    },
}