import { defineStore } from "pinia";
import { reactive } from "vue";

export const useViewPortStore = defineStore('viewport', () => {
  
    interface ViewType {
        width : number,
        height : number
    }

    const view  = reactive<ViewType>({
        width : 0,
        height : 0,
    })

    const handleViewport = () => {
        view.width = window.innerWidth
        view.height = window.innerHeight
    }

    return {view, handleViewport}

})