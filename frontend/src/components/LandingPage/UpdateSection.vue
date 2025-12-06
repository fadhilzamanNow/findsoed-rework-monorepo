<script setup lang="ts">
import { ArrowRightOutlined } from "@ant-design/icons-vue";
import { Input, InputProps, Modal } from "ant-design-vue";
import { computed, ref } from "vue";

const updateVal = ref("");

const handleSend = () => {
  Modal.warning({
    title: "Upss Terdapat Kesalahan",
    content: "Fitur ini belum hadir di versi saat ini",
    centered: true,
  });
  updateVal.value = "";
};

const inputUpdateProps = computed<InputProps | { class: string }>(() => ({
  placeholder: "Kirim Pesan",
  value: updateVal.value,
  onInput: (e) => (updateVal.value = (e.target as HTMLInputElement).value),
  onPressEnter: handleSend,
  type: "text",
  class: "!py-2",
}));
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 md:px-8 py-16">
    <div class="bg-blue-600 rounded-2xl overflow-hidden">
      <div class="relative md:px-16 py-16 md:py-24">
        <div
          class="absolute top-0 right-0 w-1/2 h-full hidden md:block custom-clip bg-blue-700"
        ></div>
        <div
          class="relative flex flex-col md:flex-row justify-between items-center"
        >
          <!-- {/* BAGIAN KIRI */} -->
          <div class="text-blue-100 text-center max-w-lg md:text-left lg:w-1/2">
            <h2 class="text-2xl sm:text-3xl md:text-3xl font-medium mb-4">
              Harapan untuk Findsoed
            </h2>
            <p class="text-sm sm:text-base">
              Ayo berikan saranmu untuk Findsoed
            </p>
          </div>
          <!--  {/* BAGIAN KANAN */} -->
          <div
            class="flex flex-col md:flex-row h-full w-3/4 lg:w-1/2 justify-center mt-6 sm:mt-4 md:mt-0"
          >
            <div class="w-full relative">
              <Input v-bind="inputUpdateProps" />
              <button
                @click="handleSend"
                class="absolute right-2 top-1/2 -translate-y-1/2 flex justify-center items-center bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 cursor-pointer transition-all hover:shadow-sm hover:shadow-green-600"
              >
                <ArrowRightOutlined />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
