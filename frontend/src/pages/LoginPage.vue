<script setup lang="ts">
import { Flex } from "ant-design-vue";
import LoginBox from "../components/LoginPage/LoginBox.vue";
import { ref, watchEffect } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSeoMeta } from "@unhead/vue";
import Navbar from "../components/LandingPage/Navbar.vue";
import Footer from "../components/LandingPage/Footer.vue";

useSeoMeta({
  title: "SSR RSbuild Login Page - Findsoed Rework",
  description:
    "SSR Rsbuild Halaman Login Page untuk Findsoed Rework dapat digunakan untuk autentikasi pengguna",
  ogTitle: "SSR Rsbuild Login Page - Findsoed Rework",
  ogDescription:
    "SSR Rsbuild Halaman Login Page untuk Findsoed Rework dapat digunakan untuk autentikasi pengguna",
  ogUrl: "http://localhost:3500/login",
  ogSiteName: "Findsoed Rework",
  ogType: "website",
  author: "Muhammad Ilham Isfadhillah",
  twitterTitle: "SSR Rsbuild Login Page - Findsoed Rework",
  robots: "index, follow",
});

const auth = useAuthStore();
const { authToken } = storeToRefs(auth);
const loginLoading = ref(false);

const navigate = useRouter();

const toggleLoading = () => {
  loginLoading.value = !loginLoading.value;
};

watchEffect(() => {
  if (authToken.value) {
    navigate.push("/home");
  }
});
</script>

<template>
  <Flex vertical gap="2" class="h-[100vh]">
    <Navbar />
    <div class="flex flex-col justify-between h-full">
      <LoginBox @toggle-loading="toggleLoading" />
      <Footer />
    </div>
  </Flex>
</template>
