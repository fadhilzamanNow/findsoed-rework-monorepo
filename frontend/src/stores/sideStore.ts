import { defineStore } from "pinia";
import { ref } from "vue";

type SideType = {
    isSidebarOpen : boolean,
    isExpand : boolean,
    sidebarWidth : number
}

export const useSideStore = defineStore('side', () => {
    const isSidebarOpen = ref<SideType['isSidebarOpen']>(false);
    const isExpand = ref<SideType['isExpand']>(false);
    const sidebarWidth = ref<SideType['sidebarWidth']>(0);

    const toggleSidebar = () => {
        isExpand.value = !isExpand.value
    }

    const theToks = () => {
        console.log("testing here")
    }

    return {isSidebarOpen, isExpand, sidebarWidth, toggleSidebar, theToks}
})

