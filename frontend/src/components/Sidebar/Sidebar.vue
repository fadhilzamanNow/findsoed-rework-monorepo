<script setup lang="ts">
import {
  HomeFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  SettingFilled,
} from "@ant-design/icons-vue";
import { Avatar, AvatarProps } from "ant-design-vue";
import Iconitem from "./Iconitem.vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/authStore";
import logo from "../../assets/icon.png";
import { ref } from "vue";

const listMenu = [
  {
    name: "Home",
    icon: HomeFilled,
    link: "/home",
  },
  {
    name: "Add",
    icon: PlusCircleOutlined,
    link: "/add",
  },
  {
    name: "Setting",
    icon: SettingFilled,
    link: "/setting",
  },
];
const auth = useAuthStore();
const { userInfo } = storeToRefs(auth);
const isExpand = ref(false);

const profileProps = computed<AvatarProps>(() => ({
  /* @ts-expect-error Variabel didefine dari Bundler */
  src: `${BACKEND_URL}static/images/${userInfo.value?.imageUrl}`,
  size: 36,
  shape: "square",
}));

const toggleSidebar = () => {
  isExpand.value = !isExpand.value;
};
</script>

<template>
  <aside
    :class="`fixed top-0 left-0 z-51 h-[100vh] hidden md:block`"
    ref="sidebarRef"
  >
    <nav
      class="h-full flex flex-col bg-white border-r border-r-gray-200 shadow-sm"
    >
      <div
        class="p-3 pb-2 flex items-center justify-between border-b-gray-300 h-16"
      >
        <div
          :class="`overflow-hidden transition-all duration-300 ${
            isExpand ? 'w-34' : 'w-0'
          }`"
        >
          <div class="flex items-center gap-2">
            <div class="size-10">
              <img :src="logo" alt="" class="h-full w-full object-contain" />
            </div>
            <div class="flex items-center text-xl font-bold">
              <span class="text-black">Find</span>
              <span class="text-blue-600">Soed</span>
            </div>
          </div>
        </div>
        <div
          @click="toggleSidebar"
          class="text-xl hover:bg-blue-600 p-2 transition-color bg-white hover:text-white text-black rounded-md flex justify-center items-center"
        >
          <MenuFoldOutlined v-if="isExpand" />
          <MenuUnfoldOutlined v-else />
        </div>
      </div>
      <ul class="flex-1 px-3 pt-4">
        <Iconitem
          v-for="(v, i) of listMenu"
          :key="i"
          :name="v.name"
          :link="v.link"
          :isExpand="isExpand"
        >
          <template v-slot:icon>
            <component :is="v.icon"></component>
          </template>
        </Iconitem>
      </ul>
      <div
        class="border-t border-t-gray-200 flex p-3"
        :class="[isExpand ? '' : 'justify-center']"
      >
        <Avatar v-if="userInfo?.imageUrl" v-bind="profileProps" />
        <Avatar v-else :size="36" shape="square">{{
          userInfo?.username.slice(0, 2)
        }}</Avatar>
        <div
          class="flex justify-between items-center overflow-hidden transition-all duration-300"
          :class="[isExpand ? 'w-52 ml-3' : 'w-0']"
        >
          <div class="leading-4">
            <h1 class="font-semibold text-sm">
              {{ userInfo?.username }}
            </h1>
            <h2 class="text-gray-600 text-xs">{{ userInfo?.email }}</h2>
          </div>
          <MoreOutlined class="text-lg" />
        </div>
      </div>
    </nav>
  </aside>
</template>
