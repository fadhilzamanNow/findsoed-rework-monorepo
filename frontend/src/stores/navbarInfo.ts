import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavbarStore = defineStore('navbar', () => {
    const isNavbarOpen = ref<boolean>(false);

    return {isNavbarOpen};
})