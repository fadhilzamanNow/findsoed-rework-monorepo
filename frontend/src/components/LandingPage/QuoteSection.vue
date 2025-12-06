<script setup lang="ts">
import { motion } from "motion-v";
import quote4 from "../../assets/quote4.png";
import { textFromLeft } from "../../utils/motion";
import { ArrowRightOutlined } from "@ant-design/icons-vue";
</script>

<template>
  <motion.section
    id="about"
    class="max-w-7xl mx-auto px-4 py-16 md:py-24"
    initial="hidden"
    while-in-view="show"
    :variants="textFromLeft(0.3)"
  >
    <div
      class="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24"
    >
      <!-- {/* GAMBAR */} -->
      <motion.div
        class="w-full md:w-1/2 flex justify-center items-center"
        initial="hidden"
        while-in-view="show"
        :variants="textFromLeft(0.4)"
      >
        <img :src="quote4" alt="" class="size-[450px] object-contain" />
      </motion.div>
      <!-- {/* QUOTE */} -->
      <motion.div
        class="w-full md:w-1/2 text-center md:text-start"
        initial="hidden"
        while-in-view="show"
        :variants="textFromLeft(0.5)"
      >
        <h3 class="text-orange-600 font-semibold">
          Muhammad Ilham Isfadhillah
        </h3>
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-700 mt-4 mb-6">
          Jangan Hanya Diam
          <br />Ketika Ada Yang Hilang
        </h1>
        <p class="text-gray-600 mb-8">
          Wah saya pernah sih itu punya barang hilang, tapi saya ga langsung
          nyari, saya tunda tunda gitu dan akhirnya hilang beneran ga ketemu
          ketemu
        </p>

        <a
          href="#home"
          class="text-blue-600 font-semibold flex items-center justify-center md:justify-start gap-2 hover:gap-4 transition-all"
        >
          Coba FindSoed
          <ArrowRightOutlined class="size-8" />
        </a>
      </motion.div>
    </div>
  </motion.section>
</template>
