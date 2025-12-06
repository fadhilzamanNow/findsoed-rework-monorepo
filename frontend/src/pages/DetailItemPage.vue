<script setup lang="ts">
import Navbar from "../components/LandingPage/Navbar.vue";
import Sidebar from "../components/Sidebar/Sidebar.vue";
import { watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import DetailItem from "../components/DetailPage/DetailItem.vue";
import { useSeoMeta } from "@unhead/vue";

useSeoMeta({
  title: "SSR RSbuild Detail Item Page - Findsoed Rework",
  description:
    "SSR Rsbuild Halaman Detail Item Page untuk Findsoed Rework yang dapat digunakan untuk melihat detail dari barang yang dipilih",
  ogTitle: "SSR Rsbuild Detail Item Page - Findsoed Rework",
  ogDescription:
    "SSR Rsbuild Halaman Detail Item Page untuk Findsoed Rework yang dapat digunakan untuk melihat detail dari barang yang dipilih",
  ogUrl: "http://localhost:3500/detail",
  ogSiteName: "Findsoed Rework",
  ogType: "website",
  author: "Muhammad Ilham Isfadhillah",
  twitterTitle: "SSR Rsbuild Detail Item Page - Findsoed Rework",
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
</script>

<template>
  <div class="min-h-screen w-full overflow-hidden">
    <Navbar />
    <Sidebar />
    <DetailItem />
  </div>
</template>
