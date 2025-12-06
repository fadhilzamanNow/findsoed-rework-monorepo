<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import fadhilganteng from "../../assets/FADHILGANTENG.jpg";
import ferdi from "../../assets/FERDITAIK.jpg";
import imron from "../../assets/IMRONTAIK.jpg";
import naufal from "../../assets/NOPALTAIK.jpg";
import ade from "../../assets/ADETAIK.jpg";
import { motion } from "motion-v";

import "swiper/css";
import "swiper/css/navigation";
import { fadeIn } from "../../utils/motion";

type testimonialType = {
  img: string;
  name: string;
  description: string;
};

const testimonialList: testimonialType[] = [
  {
    img: fadhilganteng,
    name: "Muhammad Ilham Isfadhillah",
    description:
      "Findsoed Bagus Banget sihhh brooasdasdahd loreaskdnadnad nandjabdajbdajbdajbasjbdjasbdjh",
  },
  {
    img: ade,
    name: "Prasetyo Ade",
    description: "Kalo Nyari Barang Hilang Emang enaknya disini sih",
  },
  {
    img: ferdi,
    name: "Ferdi Agus Purwanda",
    description:
      "Behh gila waktu itu ada yang barangnya hilang, langsung ketemu pake platform ini",
  },
  {
    img: naufal,
    name: "Naufal Hakim",
    description: "Gak nyangka sih platform bisa sepenting ini",
  },
  {
    img: imron,
    name: "Imron Nur Wahid",
    description:
      "Wahh aku seneng malah kalo ada platform ini, bisa ikut ngeshare barang temen yang hilang",
  },
];
</script>

<template>
  <section id="testimoni" class="py-16 px-4 max-w-7xl mx-auto">
    <!-- {/* HEADER */} -->
    <motion.div
      class="text-center mb-12"
      initial="hidden"
      while-in-view="show"
      :variants="fadeIn('up', 0.4)"
    >
      <h2 class="text-3xl font-bold md:text-4xl mb-4">
        Bagaimana FindSoed kata mereka?
      </h2>
      <p class="text-gray-400">
        FindSoed platform pencarian barang hilang terbaik
      </p>
    </motion.div>

    <!-- {/* CARD SECTION */} -->
    <motion.div
      class=""
      initial="hidden"
      while-in-view="show"
      :variants="fadeIn('up', 0.6)"
    >
      <!-- {/* CARDS */} -->
      <Swiper
        :slidesPerView="1"
        :spaceBetween="10"
        :navigation="{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }"
        :breakpoints="{
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }"
        :modules="[Navigation]"
        class="md:mb-12 own-swiper"
      >
        <SwiperSlide
          v-for="(v, i) in testimonialList"
          :key="i"
          class="h-full md:py-12 py-4"
        >
          <div
            class="text-center bg-white p-4 rounded-lg h-full flex flex-col border border-gray-200 shadow-md"
          >
            <div class="size-24 mx-auto mb-4">
              <img
                :src="v.img"
                alt=""
                class="w-full h-full object-cover rounded-full border border-gray-200"
              />
            </div>

            <h3 class="text-3xl font-semibold mb-3">{{ v.name }}</h3>
            <p class="text-[12px] font-normal text-gray-600">
              {{ v.description }}
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
      <!-- {/* BUTTON CARDS */} -->
      <div class="flex items-center justify-center gap-4 mt-8">
        <button
          class="swiper-button-prev-custom size-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
        >
          <LeftOutlined />
        </button>
        <button
          class="swiper-button-next-custom size-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
        >
          <RightOutlined />
        </button>
      </div>
    </motion.div>
  </section>
</template>
