import useClient from "@/api/useClient";
import UpdateExpense from "@/components/modals/UpdateExpense.vue";
import { useMainStore } from "@/store/main";
import { useQuasar } from "quasar";

export default function useOpenAddExpenses (q) {

    const $q = useQuasar();
    const api = useClient();
    const mainStore = useMainStore();

    const openModal = (props = {}) => {
        q.dialog({
            component: UpdateExpense,
    
            // props forwarded to your custom component
            componentProps: props
        }).onOk(async (expense) => {
            const userId = expense.user_id ?? mainStore.state.currentUser?.id;
            const { data, error } = await api('api/expense/update').post({
                id: expense.id,
                date: expense.date,
                description: expense.description,
                sum: expense.sum,
                user_id: userId,
                category_id: expense.categoryId,
                repeatable: expense.repeatable,
                repeat_times: expense.repeatTimes
            }).json();
            if (error.value) {
                $q.notify({
                    type: 'error',
                    message: error.value,
                    color: 'negative'
                });
            } else {
                $q.notify({
                    type: 'positive',
                    message: 'Expenses have been successfully updated',
                    color: 'positive'
                });
                if (expense.id) {
                    mainStore.state.usersExpenses[userId] = mainStore.state.usersExpenses[userId].reduce((acc, item) => {
                        if (item.id == data.value.id) {
                            acc.push(data.value);
                        } else {
                            acc.push(item);
                        }
                        return acc;
                    }, []);
                } else {
                    mainStore.state.usersExpenses[userId].push(data.value);
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