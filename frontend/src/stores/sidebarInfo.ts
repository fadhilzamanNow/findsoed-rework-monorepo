import { defineStore } from "pinia";
import { ref } from "vue";


export const useSidebarStore = defineStore('sidebar', () => {
    const isExpand = ref<boolean>(false);

    const toggle = () => {
        isExpand.value = !isExpand.value
    }

    return {isExpand, toggle}
})