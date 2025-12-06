<script setup lang="ts">
import {
  FileSearchOutlined,
  ReconciliationOutlined,
  UserAddOutlined,
} from "@ant-design/icons-vue";
import gsap from "gsap";
import { h, onMounted, ref, VNode } from "vue";
import { motion } from "motion-v";
import { fadeIn } from "../../utils/motion";

const gridRef = ref<HTMLDivElement[]>([]);

type statisticType = {
  category: string;
  icon: VNode;
  count: number;
  description: string;
};

onMounted(() => {
  if (gridRef.value[0]) {
    const observer1 = new IntersectionObserver((e) => {
      e.forEach((entry) => {
        if (entry.isIntersecting && entry.target === gridRef.value[0]) {
          gsap.fromTo(
            gridRef.value[0],
            {
              textContent: 0,
              snap: {
                textContent: 1,
              },
              stagger: 1,
              duration: 2,
            },
            {
              textContent: 50,
              snap: {
                textContent: 1,
              },
              stagger: 1,
              duration: 2,
            }
          );
        }
      });
    });
    const observer2 = new IntersectionObserver((e) => {
      e.forEach((entry) => {
        if (entry.isIntersecting && entry.target === gridRef.value[1]) {
          gsap.fromTo(
            gridRef.value[1],
            {
              textContent: 0,
              snap: {
                textContent: 1,
              },
              stagger: 1,
              duration: 2,
            },
            {
              textContent: 25,
              snap: {
                textContent: 1,
              },
              stagger: 1,
              duration: 2,
            }
          );
        }
      });
    });
    const observer3 = new IntersectionObserver((e) => {
      e.forEach((entry) => {
        if (entry.isIntersecting && entry.target === gridRef.value[2]) {
          gsap.fromTo(
            gridRef.value[2],
            {
              textContent: 0,
              snap: {
                textContent: 1,
              },
              stagger: 1,
              duration: 2,
            },
            {
              textContent: 10,
              snap: {
                textContent: 1,
              },
              stagger: 1,
              duration: 2,
            }
          );
        }
      });
    });
    observer1.observe(gridRef.value[0]);
    observer2.observe(gridRef.value[1]);
    observer3.observe(gridRef.value[2]);
  }
});

const statisticList: statisticType[] = [
  {
    category: "Pengguna",
    icon: h(UserAddOutlined),
    count: 50,
    description: "Pengguna Baru Setiap Harinya",
  },
  {
    category: "Hilang",
    icon: h(FileSearchOutlined),
    count: 25,
    description: "Laporan Barang Hilang Setiap Harinya",
  },
  {
    category: "Ditemukan",
    icon: h(ReconciliationOutlined),
    count: 10,
    description: "Laporan Barang Ditemukan Setiap Harinya",
  },
];
</script>

<template>
  <section class="bg-blue-50">
    <motion.div
      class="max-w-7xl mx-auto text-center"
      initial="hidden"
      while-in-view="show"
      :variants="fadeIn('up', 0.4)"
    >
      <h1 class="font-bold text-2xl sm:text-3xl md:text-4xl pt-12 mb-4">
        Statistik Findsoed
      </h1>
      <p class="text-gray-600">
        Finsoed Platform Pencarian Barang Hilang Terbaik
      </p>
    </motion.div>
    <motion.div
      class="max-w-7xl mx-auto py-16 px-4 sm:px-6 md:px-8"
      initial="hidden"
      while-in-view="show"
      :variants="fadeIn('up', 0.6)"
    >
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          v-for="(v, i) in statisticList"
          class="bg-white text-center flex flex-col gap-3 shadow-md rounded-xl py-6 sm:py-8 md:py-10 px-4"
          :key="i"
        >
          <div class="text-5xl font-semibold text-blue-600 flex justify-center">
            <h1
              :ref="
                (el) => {
                  if (el) {
                    /* @ts-ignore */
                    gridRef[i] = el;
                  }
                }
              "
            >
              {{ v.count }}
            </h1>
            <span> +</span>
          </div>
          <h3 class="text-2xl font-medium">{{ v.category }}</h3>
          <p class="text-gray-600 text-sm">{{ v.description }}</p>
        </div>
      </div>
    </motion.div>
  </section>
</template>
