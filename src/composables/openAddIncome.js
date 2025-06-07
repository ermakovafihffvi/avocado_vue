import useClient from "@/api/useClient";
import UpdateIncome from "@/components/modals/UpdateIncome.vue";
import { useMainStore } from "@/store/main";

export default function useOpenAddIncomes (q) {

    const api = useClient();
    const mainStore = useMainStore();

    const openModal = (props = {}) => {
        q.dialog({
            component: UpdateIncome,
    
            // props forwarded to your custom component
            componentProps: props
        }).onOk(async (income) => {
            const userId = income.user_id ?? mainStore.state.currentUser?.id;
            const { data, error } = await api('api/income/update').post({
                id: income.id,
                date: income.date,
                description: income.description,
                sum: income.sum,
                user_id: userId,
                currency_id: income.currency
            }).json();
            if (error.value) {

            } else {
                if (income.id) {
                    mainStore.state.usersIncomes[userId] = mainStore.state.usersIncomes[userId].reduce((acc, item) => {
                        if (item.id == data.value.id) {
                            acc.push(data.value);
                        } else {
                            acc.push(item);
                        }
                        return acc;
                    }, []);
                } else {
                    mainStore.state.usersIncomes[userId].push(data.value);
                }
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