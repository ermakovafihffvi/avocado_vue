import useClient from "@/api/useClient";
import AddExpCategory from "@/components/modals/AddExpCategory.vue";
import { useMainStore } from "@/store/main";
import { scroll, useQuasar } from "quasar";

export default function useOpenAddExpCategory (q) {

    const api = useClient();
    const mainStore = useMainStore();
    const $q = useQuasar();
    const { getScrollTarget, setVerticalScrollPosition } = scroll;

    const openModal = (props = {}) => {
        q.dialog({
            component: AddExpCategory,
    
            // props forwarded to your custom component
            componentProps: props
        }).onOk(async (category) => {
            const { data, error } = await api('api/expenses-category/add').post({
                title: category.title,
                str_id: category.str_id,
                desc: category.desc,
                isActive: category.isActive,
                special: category.special,
                limit: category.limit,
                currency: category.currency
            }).json();
            if (error.value) {
                $q.notify({
                    type: 'error',
                    message: error.value,
                    color: 'negative'
                });
                return;
            } else {
                $q.notify({
                    type: 'positive',
                    message: 'Expenses category has been successfully added',
                    color: 'positive'
                });
                mainStore.state.allExpensesCategoriesReloadable.push(data.value);
                if (category.isActive && !category.special) {
                    mainStore.state.expensesCategories?.push(data.value);
                }
                setTimeout(() => {
                    const scrollTargetElement = getScrollTarget(document.querySelector('div[data-attr-key="' + data.value.id + '"]'));
                    setVerticalScrollPosition(scrollTargetElement, document.querySelector('div[data-attr-key="' + data.value.id + '"]').offsetTop, 500);
                }, 100);
            }
        }).onCancel(() => {
            console.log('Cancel')
        }).onDismiss(() => {
            console.log('Called on OK or Cancel')
        });
    };

    return {
        openModal
    };
};