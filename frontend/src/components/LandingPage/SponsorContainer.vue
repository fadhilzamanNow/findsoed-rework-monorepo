<script setup lang="ts">
import altek from "../../assets/altek.png"
import google from "../../assets/google.png"
import hmte from "../../assets/hmte.jpg"
import unsoed from "../../assets/unsoed.png"

const sponsor = [altek, google, hmte, unsoed];

</script>

<template>
      <section class="w-full overflow-hidden container mx-auto py-20 gap-8 flex sm:flex-row flex-col sm:items-center items-start">
        <div class="w-[200px] shrink-0 px-5 text-gray-600 border-l-4 border-blue-600 bg-white py-2 z-10 sm:text-base textl-xl font-semibold text-left">
            Didukung Oleh
        </div>

        <div class="flex animate-infinity whitespace-nowrap">
                <img v-for="(l,i) in sponsor" :src="l" alt="" class="mx-12 h-8 w-36 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" :key="`duplicate-${i}`" />
        </div>
        
        </section>
</template>