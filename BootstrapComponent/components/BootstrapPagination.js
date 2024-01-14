/**
 * Bootstrap Table Pagination
 * <p>for Vue 2.6.14 with Bootstrap 4.2</p>
 * @version 0.01
 * @author RCF jasonchiang
 * @since 2024/1/11
 * <p>使用時必需傳入page.sync{Number}, totalItems{Number} 兩個props</p>
 * <p>主方法中，使用watch監控綁定page.sync的數值，在值有變化時進行相應的邏輯</p>
 */
export const BootstrapPagination = {
    name: 'BootstrapPagination',

    props: {
        /**
         * 頁碼
         */
        page: {
            type: Number,
            required: true
        },
        /**
         * 總資料數
         */
        totalItems: {
            type: Number,
            required: true
        }
    },

    template: `
              <nav v-if="total !== null">
                <ul class="pagination pagination-sm justify-content-center">

                  <li :class="{'page-item': true, 'disabled': page === 1}" 
                      @click="updatePage(1)">
                    <span class="page-link" aria-label="Previous">«</span>
                  </li>

                  <li :class="{'page-item': true, 'disabled': page === 1}" 
                      @click="changePage(-1)">
                    <span class="page-link" aria-label="Previous">上一頁</span>
                  </li>

                  <li class="page-item disabled" v-if="page > 3">
                    <span class="page-link">...</span>
                  </li>

                  <li :class="{'page-item': true, 'active': index === page}"
                      @click="updatePage(index)"
                      v-for="index in range" :key="index">

                  <span class="page-link">{{ index }}
                    <template v-if="index === page">
                      <span class="sr-only">(current)</span>
                    </template>
                  </span>

                  </li>

                  <li class="page-item disabled" v-if="page < total - 2">
                    <span class="page-link">...</span>
                  </li>

                  <li :class="{'page-item': true, 'disabled': page === total}"
                      @click="changePage(1)">
                    <span class="page-link" aria-label="Previous">下一頁</span>
                  </li>

                  <li :class="{'page-item': true, 'disabled': page === total}" 
                      @click="updatePage(total)">
                    <span class="page-link" aria-label="Next">»</span>
                  </li>

                  <li class="d-flex align-items-center justify-content-center p-2">
                    <span class="small text-muted">
                      共 {{ totalItems }} 筆，現在顯示第 {{ (page - 1) * 20 + 1 }} ~
                      {{ page * 20 < totalItems ? page * 20 : totalItems }} 筆資料
                    </span>
                  </li>

                </ul>
              </nav>
            `,

    computed: {
        total() {
            if (this.totalItems === null) console.error("Props 'total-items' can't be null.")

            return Math.ceil(this.totalItems / 20);
        },

        range() {
            let start = this.page - 2;
            if (start < 1) start = 1;
            let end = start + 4;
            if (end > this.total) end = this.total;
            return Array.from({length: end - start + 1}, (_, i) => start + i);
        }
    },

    methods: {
        changePage(number){
            const nextPage = this.page + number;
            if (nextPage <= this.total && nextPage >= 1) {
                this.updatePage(nextPage);
            }
        },

        updatePage(page) {
            this.$emit('update:page', page);
        }
    }
}