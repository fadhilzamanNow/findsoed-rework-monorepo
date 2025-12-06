<script setup lang="ts">
import { useRoute } from "vue-router";
import logo from "../../assets/icon.png";
import { computed } from "vue";
import {
  FacebookOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from "@ant-design/icons-vue";

type linkType = {
  name: string;
  href: string;
};

type FooterLinkType = {
  company?: linkType[];
  support?: linkType[];
  contact?: linkType[];
};

const path = useRoute();

const footerLinks: FooterLinkType = {
  company: [
    { name: "Home", href: "#home" },
    { name: "Layanan", href: "#layanan" },
    { name: "Tentang Kami", href: "#about" },
    { name: "Testimoni", href: "#testimoni" },
  ],
  support: [
    { name: "FAQ", href: "#" },
    { name: "Policy", href: "#" },
    { name: "Business", href: "#" },
  ],
  contact: [{ name: "WhatsApp", href: "https://web.whatsapp.com/" }],
};

const footerFilter = computed<FooterLinkType>(() => {
  if (path.path === "/") {
    return {
      ...footerLinks,
    };
  } else {
    let newFooter = { ...footerLinks };
    delete newFooter.support;
    delete newFooter.company;
    delete newFooter.contact;
    return newFooter;
  }
});
</script>

<template>
  <footer class="bg-blue-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- {/* ALL COLUMN */} -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-13"
      >
        <!-- {/* FIRST COLUMN */} -->
        <div class="lg:col-span-4">
          <div class="flex gap-1 items-center mb-6">
            <!-- {/* LOGO */} -->
            <div class="size-10">
              <img
                :src="logo"
                alt=""
                class="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <h1 class="text-xl font-bold group cursor-pointer">
              <span>Find</span>
              <span
                class="group-hover:text-blue-600 transition-colors duration-300"
                >Soed</span
              >
            </h1>
          </div>
          <!-- {/* SOCIAL MEDIA */} -->
          <p class="text-gray-600 mb-6">
            Platform Pencarian Barang Sekitar Unsoed
          </p>
          <div class="flex gap-2 items-center">
            <a
              href=""
              class="size-10 flex justify-center items-center !text-gray-600 hover:!bg-gray-600 hover:!text-white rounded-xl transition-all duration-300 text-2xl"
              ><LinkedinOutlined
            /></a>
            <a
              href=""
              class="size-10 flex justify-center items-center !text-gray-600 hover:!bg-gray-600 hover:!text-white rounded-xl transition-all duration-300 text-2xl"
              ><FacebookOutlined
            /></a>
            <a
              href=""
              class="size-10 flex justify-center items-center !text-gray-600 hover:!bg-gray-600 hover:!text-white rounded-xl transition-all duration-300 text-2xl"
              ><YoutubeOutlined
            /></a>
          </div>
        </div>

        <!-- {/* SECOND COLUMN */} -->
        <div class="lg:col-span-8">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div v-for="(list, i) in footerFilter" :key="i">
              <h3 class="text-lg font-medium mb-4 uppercase">{{ i }}</h3>
              <ul class="space-y-2">
                <li v-for="(l, ii) in list" :key="`child-${ii}`">
                  <a :href="l.href" class="text-gray-600 hover:text-gray-900">{{
                    l.name
                  }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
