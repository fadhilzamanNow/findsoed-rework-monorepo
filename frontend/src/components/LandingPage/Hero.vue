<script setup lang="ts">
import heroImage from "../../assets/herobetter.png";
import { motion } from "motion-v";
import { textFromLeft, textFromRight } from "../../utils/motion";
import { ArrowRightOutlined } from "@ant-design/icons-vue";
import { Input, InputProps } from "ant-design-vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
const navigate = useRouter();

const inputHeroProps = computed<InputProps | { class: string }>(() => ({
  placeholder: "Cari Barang Hilang",
  onPressEnter: () => navigate.push("/login"),
  type: "text",
  class:
    "flex-1 w-30 px-6 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transtion-all justify-center items-center",
}));

const handleSend = () => {
  navigate.push("/login");
};
</script>

<template>
  <main
    id="home"
    class="container mx-auto flex flex-col md:flex-row justify-between items-center pt-30 b-6 px-4 sm:px-6 lg:px-8"
  >
    <!-- {/* BAGIAN KIRI */} -->
    <div class="w-full md:w-1/2 space-y-8">
      <!-- {/* CARI BARANG */} -->
      <div
        class="flex items-center gap-2 bg-gray-50 w-fit px-4 py-2 rounded-full hover:bg-gray-100 transition-colors group"
      >
        <span class="text-blue-600 group-hover:scale-150 transition-transform"
          >🔎</span
        >
        <span class="text-sm font-medium text-black/65"
          >Duhhh barangku mana yahh</span
        >
      </div>

      <motion.h1
        class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        initial="hidden"
        while-in-view="show"
        :variants="textFromLeft(0.1)"
      >
        Cari Barangmu Sekarang
        <span class="text-blue-600 relative inline-block">
          dengan FindSoed
          <span
            class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
          ></span>
        </span>
      </motion.h1>

      <motion.p
        class="text-gray-600 text-lg md:text-xl max-w-xl"
        initial="hidden"
        while-in-view="show"
        :variants="textFromLeft(0.2)"
      >
        Platform Pencari Barang Terbaik Sekitar Fakultas Teknik Unsoed
      </motion.p>

      <motion.div
        class="flex gap-3 max-w-md h-10 relative"
        initial="hidden"
        while-in-view="show"
        :variants="textFromLeft(0.3)"
      >
        <Input v-bind="inputHeroProps" />
        <button
          @click="handleSend"
          class="absolute right-2 top-1/2 -translate-y-1/2 flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-300"
        >
          <ArrowRightOutlined />
        </button>
      </motion.div>
    </div>
    <!-- {/* BAGIAN KANAN */} -->
    <div class="w-full md:w-1/2">
      <motion.div
        class="relative"
        initial="hidden"
        while-in-view="show"
        :variants="textFromRight(0.2)"
      >
        <img
          :src="heroImage"
          alt=""
          class="rounded-lg relative z-10 hover:scale-100 lg:hover:scale-110 transition-transform duration-500"
        />
      </motion.div>
    </div>
  </main>
</template>
