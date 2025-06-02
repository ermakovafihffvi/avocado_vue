import useClient from "@/api/useClient";
import AddCurrency from "@/components/modals/AddCurrency.vue";
import { useMainStore } from "@/store/main";

export default function useOpenAddCurrency (q) {

    const api = useClient();
    const mainStore = useMainStore();

    const openModal = (props = {}) => {
        q.dialog({
            component: AddCurrency,
    
            // props forwarded to your custom component
            componentProps: props
        }).onOk(async (currency) => {
            const { data, error } = await api('api/add-currency').post({
                title: currency.title,
                str_id: currency.str_id,
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