/**
 * Bootstrap Icon
 * <p>for Vue 2.6.14 with Bootstrap 4.2</p>
 * @version 0.01
 * @since 2024/1/18
 * @author jasonchiang
 */
export const BootstrapIcon = {
    name: 'BootstrapIcon',

    props: {
        name: {
            type: String,
            required: true,
            validator: function (value) {
                const regex = /^bi-[a-z-]+$/;
                if (!regex.test(value)) {
                    console.error('錯誤的icon名字，必須是以"bi-"做為開頭。你可以前往 https://icons.getbootstrap.com/ 取得正確的icon名字。');
                    return false;
                }
                return true;
            }
        }
    },

    template: `
                <i :class="{'bi': true, [name]: true}"></i>
            `,
}