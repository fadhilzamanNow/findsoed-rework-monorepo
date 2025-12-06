import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

export const useHeroStore = defineStore('hero', () => {
    const scrollProgYBg = ref();

    const handleScroll = (l : number) => {
        scrollProgYBg.value = l
    }


    return {scrollProgYBg, handleScroll}
})