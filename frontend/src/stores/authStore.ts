import { defineStore } from "pinia";
import { ref } from "vue";


export type userInfoType = {
    userId : string,
    username : string,
    email : string,
    phoneNumber : string,
    imageUrl : string
}

interface userStateType {
    isLoading : boolean,
    authToken : string | null
    userInfo : userInfoType | null
}

export const useAuthStore = defineStore('auth', () => {
    const isLoading = ref<userStateType['isLoading']>(false)
    const authToken = ref<userStateType['authToken']>()
    const userInfo = ref<userStateType['userInfo']>(null)

    const toggleLoading = () => {
        isLoading.value = !isLoading.value
    }

    const setAuthToken = (token : userStateType['authToken']) => {
        authToken.value = token
    }

    const setUserInfo = (user : userStateType['userInfo']) => {
        userInfo.value = user
    }
    
    return {isLoading,authToken, userInfo, toggleLoading, setAuthToken, setUserInfo}

})