<script setup lang="ts">
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { Button, Input, InputProps, Modal } from "ant-design-vue";
import { computed } from "vue";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import zxcvbn from "zxcvbn";
import validator from "validator";
import underscore from "underscore";
import lodash from "lodash";
import parsePhoneNumber from "libphonenumber-js";
import { registerUser } from "../../api/Auth/Auth";
import { CustomErrorResponse, CustomSuccessResponse } from "../../api/baseApi";

type PhoneValidType = {
  success: boolean;
  message: string;
};

const emit = defineEmits<{ toggleLoading: [] }>();

const userVal = ref<string>("");
const emailVal = ref<string>("");
const passVal = ref<string>("");
const passShow = ref<boolean>(false);
const cPassVal = ref<string>("");
const cPassShow = ref<boolean>(false);
const phoneVal = ref<string>("");
const navigate = useRouter();

const isPhoneValid = computed<PhoneValidType>(() => {
  if (parsePhoneNumber(phoneVal.value, "ID")?.isValid()) {
    return {
      success: true,
      message: "Nomor valid",
    };
  } else {
    return {
      success: false,
      message:
        "Nomor yang anda masukkan tidak valid, gunakan nomor Indonesia yang valid",
    };
  }
});

const debouncedEmailValidation = underscore.debounce((email: string) => {
  emailVal.value = email;
}, 100);

const handleEmail = (e: Event) => {
  const email = (e.target as HTMLInputElement).value;
  debouncedEmailValidation(email);
};

const emailIndicator = computed(() => {
  if (validator.isEmail(emailVal.value) && emailVal.value.length > 1) {
    return {
      status: true,
      text: "Email Valid",
      textcolor: "text-green-500",
      isEmpty: false,
    };
  } else if (!validator.isEmail(emailVal.value) && emailVal.value.length > 1) {
    return {
      status: false,
      text: "Email Tidak Valid",
      textcolor: "text-red-500",
      isEmpty: false,
    };
  } else {
    return {
      status: false,
      text: "",
      textcolor: "",
      isEmpty: true,
    };
  }
});

const passwordStrength = computed(() => {
  return zxcvbn(passVal.value);
});

const passwordIndicator = computed(() => {
  switch (passwordStrength.value.score) {
    case 1: {
      return {
        number: 1,
        bgcolor: "bg-red-500",
        text: "Masih Lemah",
        textcolor: "text-red-500",
      };
    }
    case 2: {
      return {
        number: 2,
        bgcolor: "bg-yellow-300",
        text: "Lumayan",
        textcolor: "text-yellow-300",
      };
    }
    case 3: {
      return {
        number: 3,
        bgcolor: "bg-blue-500",
        text: "Lumayan Kuat",
        textcolor: "text-blue-500",
      };
    }
    case 4: {
      return {
        number: 4,
        bgcolor: "bg-green-500",
        text: "Sangat Kuat",
        textcolor: "text-green-400",
      };
    }
    default: {
      return {
        number: 0,
        bgcolor: "",
        text: "",
      };
    }
  }
});

const cPasswordStrength = computed(() => {
  return zxcvbn(cPassVal.value);
});

const cPasswordIndicator = computed(() => {
  switch (cPasswordStrength.value.score) {
    case 1: {
      return {
        number: 1,
        bgcolor: "bg-red-500",
        text: "Masih Lemah",
        textcolor: "text-red-500",
      };
    }
    case 2: {
      return {
        number: 2,
        bgcolor: "bg-yellow-300",
        text: "Lumayan",
        textcolor: "text-yellow-300",
      };
    }
    case 3: {
      return {
        number: 3,
        bgcolor: "bg-blue-500",
        text: "Lumayan Kuat",
        textcolor: "text-blue-500",
      };
    }
    case 4: {
      return {
        number: 4,
        bgcolor: "bg-green-500",
        text: "Sangat Kuat",
        textcolor: "text-green-400",
      };
    }
    default: {
      return {
        number: 1,
        bgcolor: "",
        text: "",
      };
    }
  }
});

const isPasswordSame = computed(() => {
  if (passVal.value === cPassVal.value) {
    return true;
  } else {
    return false;
  }
});

const isNoError = computed(() => {
  if (phoneVal.value.length > 0) {
    return (
      !lodash.isEmpty(userVal.value) &&
      emailIndicator.value.status &&
      passwordIndicator.value.number > 1 &&
      cPasswordIndicator.value.number > 1 &&
      isPhoneValid.value.success &&
      isPasswordSame.value
    );
  } else {
    return (
      !lodash.isEmpty(userVal.value) &&
      emailIndicator.value.status &&
      passwordIndicator.value.number > 1 &&
      cPasswordIndicator.value.number > 1 &&
      isPasswordSame.value
    );
  }
});

const inputUserProps = computed<InputProps | { class?: string }>(() => ({
  value: userVal.value,
  placeholder: "Username",
  onInput: (e) => (userVal.value = (e.target as HTMLInputElement).value),
  class: "w-full",
  onPressEnter: handleRegister,
}));

const inputEmailProps = computed<InputProps | { class?: string }>(() => ({
  onInput: (e: Event) => handleEmail(e),
  placeholder: "Email",
  id: "email",
  status: emailIndicator.value.status
    ? ""
    : emailIndicator.value.isEmpty
    ? ""
    : "error",
  class: "w-full",
  onPressEnter: handleRegister,
}));

const inputPhoneProps = computed<InputProps | { class?: string }>(() => ({
  value: phoneVal.value,
  onInput: (e) => (phoneVal.value = (e.target as HTMLInputElement).value),
  class: `w-full focus:!shadow-none duration-300 transition-all ${
    isPhoneValid.value.success
      ? "!border-gray-200 "
      : phoneVal.value.length > 0
      ? "!border-red-500"
      : "!border-gray-200"
  }`,
  placeholder: "Nomor Telefon",
  onPressEnter: handleRegister,
}));

const spanPhoneProps = computed<{ class?: string }>(() => ({
  class: `text-xs transition-all duration-300 text-red-500 ${
    isPhoneValid.value.success
      ? "invisible"
      : phoneVal.value.length > 0
      ? "visible opacity-100"
      : "invisible opacity-0"
  }`,
}));

const inputPassProps = computed<InputProps | { class?: string }>(() => ({
  value: passVal.value,
  onInput: (e) => (passVal.value = (e.target as HTMLInputElement).value),
  type: passShow.value ? "text" : "password",
  status:
    passwordIndicator.value.number > 1
      ? ""
      : passVal.value.length > 0
      ? "error"
      : "",
  placeholder: "Password",
  onPressEnter: handleRegister,
}));

const inputCPassProps = computed<InputProps | { class?: string }>(() => ({
  value: cPassVal.value,
  onInput: (e) => (cPassVal.value = (e.target as HTMLInputElement).value),
  type: cPassShow.value ? "text" : "password",
  status:
    cPasswordIndicator.value.number > 1
      ? ""
      : cPassVal.value.length > 0
      ? "error"
      : "",
  placeholder: "Konfirmasi Password",
  onPressEnter: handleRegister,
}));

const handleRegister = async () => {
  if (isNoError) {
    try {
      emit("toggleLoading");
      const response = await registerUser({
        username: userVal.value,
        email: emailVal.value,
        password: passVal.value,
        ...(phoneVal.value.length > 0 && { phoneNumber: phoneVal.value }),
      });

      if (response) {
        emit("toggleLoading");
        Modal.success({
          title: "Berhasil Melakukan Registrasi",
          content: (response as CustomSuccessResponse).message,
          onOk: () => navigate.push("/login"),
          centered: true,
        });
      }
    } catch (err) {
      emit("toggleLoading");
      Modal.error({
        title: "Gagal Melakukan Registrasi",
        content: (err as CustomErrorResponse).message,
        centered: true,
      });
    }
  }
};
</script>

<template>
  <div
    class="container mx-auto items-center justify-center pt-10 mt-16 px-4 sm:px-6 md:px-8 h-full"
  >
    <!-- BOX -->
    <div
      class="flex flex-col h-full gap-4 w-full lg:w-3xl lg:mx-auto lg:px-4 rounded-md py-4"
    >
      <!-- TITLE -->
      <div class="text-center text-blue-600 font-semibold text-xl">Daftar</div>
      <!-- USERNAME -->
      <div class="flex flex-col gap-2 items-center justify-center">
        <label for="email" class="text-xs w-full font-semibold"
          >Username <span class="text-red-500">*</span></label
        >
        <div class="w-full">
          <Input v-bind="inputUserProps" />
        </div>
      </div>

      <!-- EMAIL -->
      <div class="flex flex-col gap-2 items-center justify-center">
        <label for="email" class="text-xs w-full font-semibold"
          >Email <span class="text-red-500">*</span></label
        >
        <div class="w-full">
          <Input v-bind="inputEmailProps" />
        </div>
        <div class="w-full text-xs" :class="[emailIndicator.textcolor]">
          {{ emailIndicator.text }}
        </div>
      </div>

      <!-- PHONE -->
      <div class="flex flex-col gap-2 items-center justify-center">
        <label for="phone" class="text-xs w-full font-semibold">Phone</label>
        <div class="w-full">
          <Input v-bind="inputPhoneProps" />
          <span v-bind="spanPhoneProps">{{ isPhoneValid.message }}</span>
        </div>
      </div>

      <!-- PASSWORD SATU -->
      <div class="flex flex-col gap-2 items-center justify-center">
        <label for="password" class="text-xs w-full font-semibold"
          >Password <span class="text-red-500">*</span></label
        >
        <div class="w-full relative">
          <Input v-bind="inputPassProps" />
          <div
            @click="() => (passShow = !passShow)"
            class="absolute top-0 right-2 max-w-max h-full flex justify-center items-center"
          >
            <EyeInvisibleOutlined v-if="passShow" />
            <EyeOutlined v-if="!passShow" />
          </div>
        </div>
        <div class="h-[5px] w-full flex gap-x-0.5 items-center">
          <div
            v-for="(_, i) in passwordStrength.score"
            :key="i"
            class="w-[20%] h-full"
            :class="[passwordIndicator.bgcolor]"
          ></div>
          <div class="text-xs" :class="[passwordIndicator.textcolor]">
            {{ passwordIndicator.text }}
          </div>
        </div>
      </div>

      <!-- PASSWORD CONFIRM -->
      <div class="flex flex-col gap-2 items-center justify-center">
        <label for="password" class="text-xs w-full font-semibold"
          >Konfirmasi Password <span class="text-red-500">*</span></label
        >
        <div class="w-full relative">
          <Input v-bind="inputCPassProps" />
          <div
            v-on:click="() => (cPassShow = !cPassShow)"
            class="absolute top-0 right-2 h-full max-w-max flex justify-center items-center"
          >
            <EyeInvisibleOutlined v-if="cPassShow" />
            <EyeOutlined v-if="!cPassShow" />
          </div>
        </div>
        <div class="h-[5px] w-full flex gap-x-0.5 items-center">
          <div
            v-for="(_, i) in cPasswordStrength.score"
            :key="i"
            class="w-[20%] h-full"
            :class="[cPasswordIndicator.bgcolor]"
          ></div>
          <div class="text-xs" :class="[cPasswordIndicator.textcolor]">
            {{ cPasswordIndicator.text }}
          </div>
        </div>
        <span
          class="w-full items-center transition-all duration-200 ease-in-out text-red-500 text-xs"
          :class="[
            isPasswordSame ? 'opacity-0 invisible' : 'visible opacity-100',
          ]"
          >Password Tidak Sama</span
        >
      </div>

      <!-- DAFTAR BUTTON -->
      <div class="flex gap-2 items-center justify-center">
        <div class="w-full flex justify-end">
          <Button type="primary" :disabled="!isNoError" @click="handleRegister">
            <span>Daftar</span>
          </Button>
        </div>
      </div>

      <!-- NAVIGATION TO LOGIN -->
      <div class="flex gap-2 items-center justify-center">
        <div class="w-full flex gap-x-1">
          <span>Belum memiliki akun?</span>
          <RouterLink to="/login">
            <span class="text-blue-600">Login</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
