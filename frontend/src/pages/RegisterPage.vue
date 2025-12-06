<script setup lang="ts">
import { Flex } from "ant-design-vue";
import RegisterBox from "../components/RegisterPage/RegisterBox.vue";
import Navbar from "../components/LandingPage/Navbar.vue";

import { ref, watchEffect } from "vue";
import { useAuthStore } from "../stores/authStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Footer from "../components/LandingPage/Footer.vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { useSeoMeta } from "@unhead/vue";

useSeoMeta({
  title: "SSR RSbuild Register Page - Findsoed Rework",
  description:
    "SSR Rsbuild Halaman Register Page untuk Findsoed Rework yang dapat digunakan untuk mendaftarkan akun mereka",
  ogTitle: "SSR Rsbuild Register Page - Findsoed Rework",
  ogDescription:
    "SSR Rsbuild Halaman Register Page untuk Findsoed Rework yang dapat digunakan untuk mendaftarkan akun mereka",
  ogUrl: "http://localhost:3500/register",
  ogSiteName: "Findsoed Rework",
  ogType: "website",
  author: "Muhammad Ilham Isfadhillah",
  twitterTitle: "SSR Rsbuild Register Page - Findsoed Rework",
  robots: "index, follow",
});

const auth = useAuthStore();
const { authToken } = storeToRefs(auth);
const navigate = useRouter();
const registerLoading = ref(false);

watchEffect(() => {
  if (authToken.value) {
    navigate.push("/home");
  }
});

const handleLoading = () => {
  registerLoading.value = !registerLoading.value;
};
</script>

<template>
  <Flex vertical gap="2" class="h-screen">
    <!-- HALAMAN LOADED -->
    <Navbar />
    <div class="flex flex-col justify-between h-full">
      <RegisterBox @toggle-loading="handleLoading" />
      <Footer />
    </div>
    <!-- HALAMAN LOADING -->
    <div
      v-if="registerLoading"
      class="fixed w-full h-screen flex justify-center items-center bg-black/20 z-51 text-7xl text-blue-600"
    >
      <LoadingOutlined />
    </div>
  </Flex>
</template>
