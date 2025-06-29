import useClient from "@/api/useClient";
import AddStateCategory from "@/components/modals/AddStateCategory.vue";
import { useMainStore } from "@/store/main";
import { scroll } from 'quasar';

export default function useOpenAddStateCategory (q) {

    const api = useClient();
    const mainStore = useMainStore();
    const { getScrollTarget, setVerticalScrollPosition } = scroll;

    const openModal = (props = {}) => {
        q.dialog({
            component: AddStateCategory,
    
            // props forwarded to your custom component
            componentProps: props
        }).onOk(async (category) => {
            const { data, error } = await api('api/state/category/add').post({
                title: category.title,
                str_id: category.str_id,
                desc: category.desc,
                currency: category.currency
            }).json();
            if (error.value) {
                console.log(error.value);
                return;
            } else {
                mainStore.state.stateCategories.push(data.value);
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