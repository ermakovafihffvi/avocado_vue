import useClient from "@/api/useClient";
import AddExpCategory from "@/components/modals/AddExpCategory.vue";
import { useMainStore } from "@/store/main";

export default function useOpenAddExpCategory (q) {

    const api = useClient();
    const mainStore = useMainStore();

    const openModal = (props = {}) => {
        q.dialog({
            component: AddExpCategory,
    
            // props forwarded to your custom component
            componentProps: props
        }).onOk(async (category) => {
            const { data, error } = await api('api/add-exp-category').post({
                title: category.title,
                str_id: category.str_id,
                desc: category.desc,
                isActive: category.isActive,
                special: category.special,
                limit: category.limit,
                rate: currency.rate
            }).json();
            if (error.value) {
                console.log(error.value);
                return;
            } else {
                mainStore.state.currencies.push(data.value);
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