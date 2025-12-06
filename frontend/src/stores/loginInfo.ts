import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoginStore = defineStore('login', () => {
    const isLogin = ref<boolean>(false);
    const username = ref<string>("");
    const userEmail = ref<string>("");

    function login(email : string){
        isLogin.value = true
        userEmail.value = email
    }

    function logout(){
        isLogin.value = false
        username.value = ""
        userEmail.value = ""
    }

    return {isLogin, userEmail, login, logout}
} )