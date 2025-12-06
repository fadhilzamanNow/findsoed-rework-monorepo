<script setup lang="ts">
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { Button, Input, InputProps, Modal } from "ant-design-vue";
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import validator from "email-validator";
import { findUserInfo, loginUser } from "../../api/Auth/Auth";
import { ChangeEvent } from "ant-design-vue/es/_util/EventInterface";
import { useAuthStore } from "../../stores/authStore";
import { validateTokenHandler } from "../../utils/validateToken";

const emailVal = ref("");
const passVal = ref("");
const passShow = ref(false);
const auth = useAuthStore();
const router = useRouter();

const emit = defineEmits<{ toggleLoading: [] }>();

const togglePass = () => {
  passShow.value = !passShow.value;
};

const isEmailValid = computed(() => {
  return validator.validate(emailVal.value);
});

const emailProps = computed<InputProps>(() => ({
  placeholder: "Email",
  onInput: (e) => {
    emailVal.value = (e.target as HTMLInputElement).value;
  },
  onPressEnter: () => handleLogin(),
  value: emailVal.value,
}));

const passProps = computed<InputProps>(() => ({
  value: passVal.value,
  onInput: (e: ChangeEvent) =>
    (passVal.value = (e.target as HTMLInputElement).value),
  type: passShow.value ? "text" : "password",
  onPressEnter: () => handleLogin(),
  placeholder: "*****",
}));

const handleLogin = async () => {
  if (isEmailValid.value && passVal.value.length > 1) {
    try {
      emit("toggleLoading");
      const response = await loginUser({
        email: emailVal.value,
        password: passVal.value,
      });
      if (response) {
        localStorage.setItem("authToken", response.data.token);
        auth.setAuthToken(response.data.token as string);
        if (response.data) {
          emit("toggleLoading");
          const findUser = await findUserInfo();
          if (findUser) {
            auth.setUserInfo({
              username: findUser.data.username,
              userId: findUser.data.userId,
              email: findUser.data.email,
              imageUrl: findUser.data.imageUrl,
              phoneNumber: findUser.data.phoneNumber,
            });
            setTimeout(() => {
              auth.setAuthToken(null);
              auth.setUserInfo(null);
            }, validateTokenHandler(response.data.token) as number);
          }
        }
        Modal.success({
          title: "Berhasil untuk login",
          ///@ts-expect-error response message is still random
          message: response.data.message,
          centered: true,
          zIndex: 99999,
          onOk: () => router.push("/home"),
        });
      }
    } catch (e) {
      emit("toggleLoading");
      Modal.error({
        title: "Gagal untuk Login",
        // @ts-expect-error error response message is still random
        content: e.message,
        centered: true,
        zIndex: 99999,
      });
    }
  }
};
</script>

<template>
  <div
    class="container mx-auto items-center justify-center mt-16 pt-10 px-4 sm:px-6 md:px-8 h-full mb-10"
  >
    <div
      class="flex flex-col h-full gap-4 w-full lg:w-3xl lg:mx-auto lg:px-4 rounded-md py-4"
    >
      <div class="text-center text-blue-600 font-semibold text-xl">LOGIN</div>
      <!-- EMAIL -->
      <div class="flex flex-col gap-2 items-center justify-center">
        <label for="email" class="text-xs w-full font-semibold"
          >Alamat Email</label
        >
        <div class="w-full flex flex-col">
          <Input v-bind="emailProps" />
          <span
            class="text-red-500 transition-all duration-300"
            :class="
              isEmailValid
                ? 'invisible opacity-0'
                : emailVal.length > 0
                ? 'visible opacity-100'
                : 'invisible opacity-0'
            "
            >Email yang kamu masukkan tidak valid</span
          >
        </div>
      </div>
      <!-- PASSWORD -->
      <div class="flex flex-col gap-2 items-center justify-center w-full">
        <label for="password" class="text-xs w-full font-semibold"
          >Password</label
        >
        <div class="w-full relative">
          <Input v-bind="passProps"> </Input>
          <div
            v-on:click="togglePass"
            class="absolute top-0 max-w-max right-2 flex justify-center items-center h-full"
          >
            <EyeInvisibleOutlined v-if="passShow" />
            <EyeOutlined v-if="!passShow" />
          </div>
        </div>
      </div>

      <!-- BUTTON -->
      <div class="flex gap-2 items-center justify-center">
        <div class="w-full justify-end flex">
          <div>
            <Button
              type="primary"
              :disabled="isEmailValid && passVal.length > 1 ? false : true"
              @click="handleLogin"
            >
              <span>Login</span>
            </Button>
          </div>
        </div>
      </div>
      <!-- BELUM PUNYA AKUN -->
      <div class="flex gap-2 items-center justify-center">
        <div class="w-full flex gap-x-1">
          <span>Belum memiliki akun?</span>
          <RouterLink to="/register">
            <span class="text-blue-600">Daftar</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
