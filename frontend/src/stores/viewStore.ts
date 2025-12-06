import { defineStore } from "pinia";
import { ref } from "vue";

type viewType = {
    width : number,
    height : number
}


export const useViewStore = defineStore('view', () => {
    const width = ref<viewType['width']>(0);
    const height = ref<viewType['height']>(0);

    const changeView = (viewInfo : viewType) => {
        width.value = viewInfo.width
        height.value = viewInfo.height
    }
    return {width,height, changeView}
})