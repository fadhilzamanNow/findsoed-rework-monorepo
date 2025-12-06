import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { LostItem } from "../dummy/listLost";
export const useCardStore = defineStore('card', () => {
    const itemList = ref<Array<LostItem>>([]);
    const cardPerPage = ref<number>(6);
    const currentPage = ref<number>(1);
    const searchItem = ref<string>("");
    const filteredItemList = computed(() => {
        return [...itemList.value].filter((v) => v.title.includes(searchItem.value))
    })

    const showItemList = computed(() => {
        return itemList.value.slice(currentPage.value*cardPerPage.value - cardPerPage.value, currentPage.value * cardPerPage.value)
    })

    const refreshItemList = (list : LostItem[]) => {
        itemList.value = list
    }

    const handleCardPerPage = (height : number) => {
        if(height > 800){
            cardPerPage.value = 6
        }else{
            cardPerPage.value = 4
        }
    }


    return {itemList, refreshItemList, showItemList, currentPage, handleCardPerPage, cardPerPage, searchItem, filteredItemList}
})