<script setup lang="ts">
import { motion } from "motion-v";
import { storeToRefs } from "pinia";
import { useNavbarStore } from "../../stores/navbarInfo";
import { MotionConfig } from "motion-v";

const { isNavbarOpen } = storeToRefs(useNavbarStore());
const handleOpen = () => {
  isNavbarOpen.value = !isNavbarOpen.value;
};
</script>

<template>
  <MotionConfig :transition="{ duration: 0.2, ease: 'easeInOut' }">
    <motion.button
      :initial="false"
      class="relative h-[40px] w-[40px] rounded-md bg-transparent transition-colors hover:bg-gray-200/30"
      @click="handleOpen"
      :animate="isNavbarOpen ? 'open' : 'closed'"
    >
      <motion.span
        :style="{ left: '50%', top: '35%', x: '-50%', y: '-50%' }"
        :variants="{
          open: {
            rotate: ['0deg', '0deg', '-45deg'],
            top: ['35%', '50%', '50%'],
          },
          closed: { rotate: ['-45deg', '0deg', '0deg'] },
        }"
        class="absolute h-0.5 w-5 bg-black"
      ></motion.span>
      <motion.span
        :style="{ left: '50%', top: '50%', x: '-50%', y: '-50%', rotate: '45' }"
        :variants="{ open: { rotate: '45deg' }, closed: { rotate: '0deg' } }"
        class="absolute h-0.5 w-5 bg-black"
      ></motion.span>
      <motion.span
        :style="{ left: 'calc(50% + 5px)', top: '65%', x: '-50%', y: '-50%' }"
        :variants="{
          open: {
            rotate: ['0deg', '0deg', '45deg'],
            top: ['65%', '50%', '50%'],
            left: '50%',
          },
          closed: {
            rotate: ['45deg', '0deg', '0deg'],
            left: 'calc(50% + 5px)',
          },
        }"
        class="absolute h-0.5 w-2.5 bg-black"
      ></motion.span>
    </motion.button>
  </MotionConfig>
</template>
