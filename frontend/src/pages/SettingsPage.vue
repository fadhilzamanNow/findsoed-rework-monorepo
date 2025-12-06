<script setup lang="ts">
import Navbar from "../components/LandingPage/Navbar.vue";
import Sidebar from "../components/Sidebar/Sidebar.vue";
import SettingsBox from "../components/SettingPage/SettingsBox.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import { useSeoMeta } from "@unhead/vue";
import { onMounted, watchEffect } from "vue";

useSeoMeta({
  title: "SSR RSbuild Setting Page - Findsoed Rework",
  description:
    "SSR Rsbuild Halaman Setting Page untuk Findsoed Rework yang dapat digunakan untuk mengatur profil dan history barang pengguna",
  ogTitle: "SSR Rsbuild Home Page - Findsoed Rework",
  ogDescription:
    "SSR Rsbuild Halaman Setting Page untuk Findsoed Rework yang dapat digunakan untuk mengatur profil dan history barang pengguna",
  ogUrl: "http://localhost:3500/setting",
  ogSiteName: "Findsoed Rework",
  ogType: "website",
  author: "Muhammad Ilham Isfadhillah",
  twitterTitle: "SSR Rsbuild Setting Page - Findsoed Rework",
  robots: "index, follow",
});

const auth = useAuthStore();
const { authToken } = storeToRefs(auth);
const navigate = useRouter();

watchEffect(() => {
  if (!authToken.value) {
    navigate.push("/login");
  }
});

onMounted(() => {
  window.scroll(0, 0);
});
</script>

<template>
  <div class="min-h-screen overflow-auto w-full">
    <Navbar />
    <Sidebar />
    <SettingsBox />
  </div>
</template>
