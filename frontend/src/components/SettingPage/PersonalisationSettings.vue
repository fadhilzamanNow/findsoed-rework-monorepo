<script setup lang="ts">
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons-vue";
import {
  Avatar,
  Upload,
  Button,
  Flex,
  Input,
  InputProps,
  Modal,
  UploadProps,
  AvatarProps,
} from "ant-design-vue";
import { storeToRefs } from "pinia";
import { computed, h, ref } from "vue";
import { useAuthStore } from "../../stores/authStore";
import parsePhoneNumber from "libphonenumber-js";
import zxcvbn from "zxcvbn";
import { editDataProfile, editPhotoProfile } from "../../api/Auth/Auth";
import { FileType } from "ant-design-vue/es/upload/interface";
import estoolkit from "es-toolkit/compat";

const auth = useAuthStore();
const { userInfo } = storeToRefs(auth);
const phoneVal = ref<string>("");
const oPassword = ref("");
const password = ref("");
const cPassword = ref("");
const showOPassword = ref(false);
const showPassword = ref(false);
const showCPassword = ref(false);
const fileList = ref<UploadProps["fileList"]>([]);

const nameProps = computed<InputProps>(() => ({
  placeholder: userInfo.value?.username,
  disabled: true,
  id: "username",
}));

const emailProps = computed<InputProps>(() => ({
  placeholder: userInfo.value?.email,
  disabled: true,
  id: "email",
}));

const handlePhoneNumber = (val: string) => {
  if (val.match(/^[0-9]*$/)) {
    phoneVal.value = val;
  }
};

const phoneProps = computed<InputProps>(() => ({
  placeholder: userInfo.value?.phoneNumber,
  onInput: (e) => {
    e.preventDefault();
    handlePhoneNumber((e.target as HTMLInputElement).value);
  },
  value: phoneVal.value,
  id: "phone",
  onKeydown: (e) => {
    if (
      !e.key.match(/^[0-9]*$/) &&
      !(e.key === "Backspace") &&
      !(e.ctrlKey && e.key === "a")
    ) {
      e.preventDefault();
    }
  },
  status:
    phoneVal.value.length < 1 ? "" : isPhoneValid.value.success ? "" : "error",
}));

const isPhoneValid = computed(() => {
  if (parsePhoneNumber(phoneVal.value, "ID")?.isValid()) {
    return {
      success: true,
      message: "Nomor Valid",
    };
  } else {
    return {
      success: false,
      message: "Nomor yang anda masukkan tidak valid, gunakan nomor yang valid",
    };
  }
});

const handleReset = () => {
  phoneVal.value = "";
};

const oPasswordProps = computed<InputProps>(() => ({
  id: "oPassword",
  placeholder: "******",
  type: showOPassword.value ? "password" : "text",
  onInput: (e) => (oPassword.value = (e.target as HTMLInputElement).value),
  value: oPassword.value,
}));

const passProps = computed<InputProps>(() => ({
  id: "password",
  placeholder: "******",
  type: showPassword.value ? "password" : "text",
  onInput: (e) => (password.value = (e.target as HTMLInputElement).value),
  value: password.value,
  status:
    password.value.length < 1
      ? ""
      : passwordIndicator.value.number < 2
      ? "error"
      : "",
}));

const cPasswordProps = computed<InputProps | { class?: string }>(() => ({
  id: "cPassword",
  placeholder: "******",
  type: showCPassword.value ? "password" : "text",
  onInput: (e) => (cPassword.value = (e.target as HTMLInputElement).value),
  value: cPassword.value,
  status:
    cPassword.value.length < 1
      ? ""
      : cPasswordIndicator.value.number < 2
      ? "error"
      : "",
}));

const upProps = computed<UploadProps>(() => ({
  onRemove: (file) => {
    const index = fileList.value?.indexOf(file);
    const newFileList = fileList.value?.slice();
    newFileList?.splice(index as number, 1);
    fileList.value = newFileList;
  },
  beforeUpload: (file) => {
    fileList.value = [...(fileList.value || []), file];
    handleChangeProfile(file);
    return false;
  },
  fileList: fileList.value,
  maxCount: 1,
  itemRender: () => h("div"),
}));

const passwordStrength = computed(() => {
  return zxcvbn(password.value);
});

const cPasswordStrength = computed(() => {
  return zxcvbn(cPassword.value);
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
        number: 0,
        bgcolor: "",
        text: "",
      };
    }
  }
});

const isPasswordSame = computed(() => {
  return password.value === cPassword.value;
});

const handleChangeData = async (e: MouseEvent) => {
  e.preventDefault();
  try {
    const response = await editDataProfile({
      ...(isPhoneValid.value && { userPhoneNumber: phoneVal.value }),
      ...(isPasswordSame.value &&
        passwordStrength.value.score > 2 && { userPassword: password.value }),
    });

    if (response) {
      auth.setUserInfo({
        username: response.data.username,
        userId: response.data.userId,
        email: response.data.email,
        imageUrl: response.data.imageUrl,
        phoneNumber: response.data.phoneNumber,
      });
    }
    Modal.success({
      title: "Data profil berhasil untuk diubah",
      centered: true,
      zIndex: 999999,
    });
  } catch (e) {
    Modal.error({
      title: "Data profil gagal untuk diubah",
      centered: true,
      zIndex: 999999,
    });
  }
};

const handleChangeProfile = async (photo: FileType) => {
  try {
    const sendData = new FormData();

    if (photo) {
      sendData.append("profilePhoto", photo);
    }

    const response = await editPhotoProfile(sendData);
    if (response) {
      auth.setUserInfo({
        username: response.data.username,
        userId: response.data.userId,
        email: response.data.email,
        imageUrl: response.data.imageUrl,
        phoneNumber: response.data.phoneNumber,
      });
      Modal.success({
        title: "Foto Profil Berhasil untuk diubah",
        centered: true,
        zIndex: 99999,
      });
    }
  } catch (e) {
    Modal.error({
      title: "Foto Profil gagal untuk diubah",
      centered: true,
      zIndex: 99999,
    });
  }
};

const avatarExistProps = computed<AvatarProps>(() => ({
  size: 100,
  /* @ts-expect-error Variabel didefine dari Bundler */
  src: `${BACKEND_URL}static/images/${userInfo.value?.imageUrl}`,
}));

const avatarNotExistProps = computed<AvatarProps>(() => ({
  size: 100,
  icon: userInfo.value?.username.slice(0, 2),
}));

const isDisabled = computed(() => {
  if (
    isPasswordSame.value &&
    cPasswordStrength.value.score > 1 &&
    oPassword.value.length > 5 &&
    isPhoneValid.value.success
  ) {
    return true;
  } else if (
    isPhoneValid.value.success &&
    estoolkit.isEmpty(password.value) &&
    estoolkit.isEmpty(oPassword.value) &&
    estoolkit.isEmpty(cPassword.value)
  ) {
    return true;
  } else if (
    !estoolkit.isEmpty(password.value) &&
    !estoolkit.isEmpty(oPassword.value) &&
    !estoolkit.isEmpty(cPassword.value) &&
    isPasswordSame.value &&
    estoolkit.isEmpty(phoneVal.value)
  ) {
    return true;
  } else if (
    !(
      isPasswordSame.value &&
      cPasswordStrength.value.score > 1 &&
      oPassword.value.length > 5
    ) &&
    isPhoneValid.value.success
  ) {
    return false;
  } else if (
    isPasswordSame.value &&
    cPasswordStrength.value.score > 1 &&
    oPassword.value.length > 5 &&
    !isPhoneValid.value.success
  ) {
    return false;
  } else {
    return false;
  }
});
</script>

<template>
  <div class="flex h-full w-full">
    <Flex
      vertical
      gap="20"
      class="w-full sm:w-[640px] sm:rounded-md sm:border-gray-200"
    >
      <Flex gap="16" align="center">
        <Avatar v-if="userInfo?.imageUrl" v-bind="avatarExistProps" />
        <Avatar v-else v-bind="avatarNotExistProps" />
        <Upload v-bind="upProps">
          <Button>
            <Flex gap="8" align="center">
              <UploadOutlined />
              <span>Ganti Foto Profil</span>
            </Flex>
          </Button>
        </Upload>
      </Flex>
      <Flex vertical gap="8">
        <label for="username">Username</label>
        <Input v-bind="nameProps" />
      </Flex>
      <Flex vertical gap="8">
        <label for="username">Email</label>
        <Input v-bind="emailProps" />
      </Flex>
      <Flex vertical gap="8">
        <label for="phone" @click="() => handleReset()">Phones</label>
        <Input v-bind="phoneProps" />
        <span
          :class="[
            'text-xs transition-all duration-300',
            isPhoneValid.success
              ? 'visible opacity-100 text-green-500'
              : phoneVal.length > 0
              ? 'visible opacity-100 text-red-500'
              : 'invisible opacity-0',
          ]"
          >{{ isPhoneValid.message }}</span
        >
      </Flex>
      <Flex vertical gap="8">
        <label for="oPassword">Sandi Lama</label>
        <Input v-bind="oPasswordProps">
          <template #suffix>
            <EyeInvisibleOutlined
              v-if="!showOPassword"
              @click="() => (showOPassword = !showOPassword)"
            />
            <EyeOutlined
              v-else
              @click="() => (showOPassword = !showOPassword)"
            />
          </template>
        </Input>
      </Flex>
      <Flex vertical gap="8">
        <label for="password">Sandi Baru</label>
        <Input v-bind="passProps">
          <template #suffix>
            <EyeInvisibleOutlined
              v-if="!showPassword"
              @click="() => (showPassword = !showPassword)"
            />
            <EyeOutlined v-else @click="() => (showPassword = !showPassword)" />
          </template>
        </Input>
        <div class="h-[5px] w-[90%] flex gap-x-0.5 items-center">
          <div
            v-for="(_, i) in passwordStrength.score"
            :key="i"
            :class="[`${passwordIndicator.bgcolor} w-[20%] h-full`]"
          ></div>
          <div :class="`text-xs ${passwordIndicator.textcolor}`">
            {{ passwordIndicator.text }}
          </div>
        </div>
      </Flex>
      <Flex vertical gap="8">
        <label for="cPassword">Konfirmasi Sandi Baru</label>
        <Input v-bind="cPasswordProps">
          <template #suffix>
            <EyeInvisibleOutlined
              v-if="!showCPassword"
              @click="() => (showCPassword = !showCPassword)"
            />
            <EyeOutlined
              v-else
              @click="() => (showCPassword = !showCPassword)"
            />
          </template>
        </Input>
        <div class="h-[5px] w-full flex gap-x-0.5 items-center">
          <div
            v-for="(_, i) in cPasswordStrength.score"
            :key="i"
            :class="[`${cPasswordIndicator.bgcolor} w-[20%] h-full`]"
          ></div>
          <div :class="`text-xs ${cPasswordIndicator.textcolor}`">
            {{ cPasswordIndicator.text }}
          </div>
        </div>
        <div
          :class="[
            'text-xs text-red-500 transition-all duration-300',
            cPassword.length < 1
              ? 'invisible opacity-0'
              : isPasswordSame && cPasswordStrength.score > 2
              ? 'invisible opacity-0'
              : 'visible opacity-100',
          ]"
        >
          Password yang dikonfirmasi tidak sama
        </div>
      </Flex>
      <Flex>
        <Button type="primary" :disabled="!isDisabled" @click="handleChangeData"
          >Ubah Profil</Button
        >
      </Flex>
    </Flex>
  </div>
</template>
