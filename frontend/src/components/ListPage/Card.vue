<script setup lang="ts">
import { Avatar } from "ant-design-vue";
import { MessageOutlined } from "@ant-design/icons-vue";
import { RouterLink } from "vue-router";
import { computed, ref, watchEffect } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/id";
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("id");

type PostType = {
  itemName: string;
  itemDetail: string;
  userName: string;
  itemCategory: string;
  status?: string | undefined;
  images: string[];
  commentNum: number;
  id: string;
  userProfile: string | null;
  statusName?: string;
  categoryName?: string | undefined;
  created_at: string | null;
  updated_at: string | null;
};

const {
  itemName,
  commentNum,
  id,
  images,
  userName,
  status,
  userProfile,
  itemDetail,
  itemCategory,
  created_at,
} = defineProps<PostType>();

const linkRef = computed<string>(() => {
  return `detail/${id}`;
});

const formattedDayNow = ref("");

watchEffect(() => {
  formattedDayNow.value = dayjs(created_at).fromNow();
});

const imageProps = computed<{ src: string; class: string; alt: string }>(
  () => ({
    // @ts-expect-error Variabel didefine dari bundler
    src: `${BACKEND_URL}static/images/${images[0]}`,
    class: "w-full h-[120px] object-cover rounded-t-md bg-gray-300",
    alt: `${images[0]}`,
  })
);
</script>

<template>
  <div
    class="w-[350px] transition-all duration-300 border-black/20 border rounded-md hover:shadow-2xl hover:shadow-gray-400/30 relative"
  >
    <div class="flex flex-col gap-y-2">
      <!-- GAMBAR -->
      <div class="relative">
        <!-- @vue-ignore -->
        <img v-bind="imageProps" />
        <span
          :class="[
            'p-0.5 text-white rounded-md absolute top-2 right-2 text-xs',
            status === 'Hilang' ? 'bg-red-500' : 'bg-green-400',
          ]"
          >{{ status }}</span
        >
      </div>

      <div class="mx-2 flex flex-col gap-y-2 mb-2 border-t-1 border-gray-400">
        <!-- NAMA - KATEGORI -->
        <div class="w-full flex justify-between mt-2">
          <span class="text-xs font-medium">
            {{ itemName }}
          </span>
          <span
            class="rounded-sm border-gray-300 border p-1 bg-gray-500/40 text-gray-500 text-[8px] w-max"
          >
            {{ itemCategory }}
          </span>
        </div>

        <!-- DETAIL -->
        <span class="text-[10px] font-normal text-black/40">
          <span v-if="itemDetail.length > 30">
            {{ itemDetail.slice(0, 35) }} ...
          </span>
          <span v-else>
            {{ itemDetail }}
          </span>
        </span>

        <!-- PROFIL - NAMA -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <Avatar
              v-if="userProfile"
              size="small"
              :src="`http://localhost:3500/static/images/${userProfile}`"
              shape="square"
            />
            <Avatar v-else shape="square" size="small">{{
              userName.toUpperCase().slice(0, 2)
            }}</Avatar>
            <span class="text-gray-400 text-xs">{{ userName }}</span>
          </div>
          <span class="text-gray-400 text-xs">{{ formattedDayNow }}</span>
        </div>
      </div>
    </div>
    <RouterLink :to="linkRef">
      <div
        class="absolute h-full w-full top-0 bg-black/80 rounded-md transition duration-300 opacity-0 hover:visible hover:opacity-100 flex justify-center gap-3 items-center text-white text-xl"
      >
        <MessageOutlined />
        {{ commentNum }}
      </div>
    </RouterLink>
  </div>
</template>
