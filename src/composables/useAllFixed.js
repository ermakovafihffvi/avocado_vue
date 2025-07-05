import { useMainStore } from "@/store/main";
import { computed } from "vue";

export default function useAllFixed () {

    const mainStore = useMainStore();
    const stateCategories = computed(() => mainStore.state.stateCategories ?? []);
    const users = computed(() => mainStore.state.users ?? []);

    const isAllFixed = function (pseudoMonth) {
        for (let i = 0; i < stateCategories.value.length; i++) {
            for (let j = 0; j < users.value.length; j++) {  
                let sum = mainStore.state.states?.find((el) => {
                    return el.user_id == users.value[j].id && el.category_id == stateCategories.value[i].id && el.pseudo_month == pseudoMonth;
                })?.sum;
                if (typeof sum == undefined || sum == null) {
                    return false;
                }
            }
        }
        return true;
    }

    return {
        isAllFixed
    };
};