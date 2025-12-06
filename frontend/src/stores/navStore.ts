import { defineStore } from "pinia";
import { ref } from "vue";

interface navType {
    isNavbarOpen : boolean
}

export const useNavStore = defineStore('navbar',() => {
    const isNavOpen = ref<navType['isNavbarOpen']>(false);

    const toggleNavbar = () => {
        isNavOpen.value = !isNavOpen.value
    }

    return {toggleNavbar, isNavOpen} ;
}) 