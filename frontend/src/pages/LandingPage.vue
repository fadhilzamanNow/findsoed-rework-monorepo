<script setup lang="ts">
import Hero from "../components/LandingPage/Hero.vue";
import Navbar from "../components/LandingPage/Navbar.vue";
import SponsorContainer from "../components/LandingPage/SponsorContainer.vue";
import MissionSection from "../components/LandingPage/MissionSection.vue";
import FeatureSection from "../components/LandingPage/FeatureSection.vue";
import QuoteSection from "../components/LandingPage/QuoteSection.vue";
import OtherQuoteSection from "../components/LandingPage/OtherQuoteSection.vue";
import StatisticSection from "../components/LandingPage/StatisticSection.vue";
import TestimonialSection from "../components/LandingPage/TestimonialSection.vue";
import UpdateSection from "../components/LandingPage/UpdateSection.vue";
import Footer from "../components/LandingPage/Footer.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useSeoMeta } from "@unhead/vue";

useSeoMeta({
  title: "SSR RSbuild Landing Page - Findsoed Rework",
  description: "SSR Rsbuild Halaman Landing Page untuk Findsoed Rework",
  ogTitle: "SSR Rsbuild Landing Page - Findsoed Rework",
  ogDescription:
    "SSR Halaman Landing Page untuk Findsoed Rework yang berisikan informasi secara umum mengenai Findsoed",
  ogUrl: "http://localhost:3500/",
  ogSiteName: "Findsoed Rework",
  ogType: "website",
  author: "Muhammad Ilham Isfadhillah",
  twitterTitle: "SSR Rsbuild Landing Page - Findsoed Rework",
  robots: "index, follow",
});

const { authToken } = storeToRefs(useAuthStore());
const navigate = useRouter();

watchEffect(() => {
  if (authToken.value) {
    navigate.push("/home");
  }
});
</script>

<template>
  <main class="relative min-h-screen overflow-hidden overscroll-none">
    <div
      class="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-blue-700/20 to-pink-100/20 rounded-full blur-[80px] -z-10"
    ></div>
    <div class="overflow-hidden">
      <Navbar />
      <Hero />
      <SponsorContainer />
      <MissionSection />
      <FeatureSection />
      <QuoteSection />
      <OtherQuoteSection />
      <StatisticSection />
      <TestimonialSection />
      <UpdateSection />
      <Footer />
    </div>
  </main>
</template>
