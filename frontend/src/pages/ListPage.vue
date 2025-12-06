<script setup lang="ts">
import { onMounted } from "vue";
import ListBox from "../components/ListPage/ListBox.vue";
import Sidebar from "../components/Sidebar/Sidebar.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import Navbar from "../components/LandingPage/Navbar.vue";
import { useSeoMeta } from "@unhead/vue";
import { watchEffect } from "vue";

useSeoMeta({
  title: "SSR RSbuild Home Page - Findsoed Rework",
  description:
    "SSR Rsbuild Halaman Home Page untuk Findsoed Rework yang dapat digunakan untuk melihat seluruh barang hilang yang tersedia",
  ogTitle: "SSR Rsbuild Home Page - Findsoed Rework",
  ogDescription:
    "SSR Rsbuild Halaman Home Page untuk Findsoed Rework yang dapat digunakan untuk melihat seluruh barang hilang yang tersedia ",
  ogUrl: "http://localhost:3500/home",
  ogSiteName: "Findsoed Rework",
  ogType: "website",
  author: "Muhammad Ilham Isfadhillah",
  twitterTitle: "SSR Rsbuild Home Page - Findsoed Rework",
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
  <div class="min-h-screen">
    <!-- NAVBAR -->
    <Navbar />
    <ListBox />
    <Sidebar />
  </div>
</template>
