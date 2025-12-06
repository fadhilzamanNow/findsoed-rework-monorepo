<script setup lang="ts">
import { SearchOutlined } from "@ant-design/icons-vue";
import { Input, InputProps } from "ant-design-vue";
import { computed, ref } from "vue";
import BreadCrumbComp from "../BreadCrumb/BreadCrumbComp.vue";
import { storeToRefs } from "pinia";
import { findPost } from "../../api/Post/Post";
import { usePostStore } from "../../stores/postStore";
import lodash from "lodash";

const search = ref("");
const post = usePostStore();
const { isLoading, postData } = storeToRefs(post);

const debounceSearch = lodash.debounce(async (searchItem: string) => {
  try {
    search.value = searchItem;
    const response = await findPost(search.value);
    if (response) {
      isLoading.value = false;
      post.setPost(response.data);
    }
  } catch (e) {}
}, 1000);

const inputSearch = computed<InputProps>(() => ({
  placeholder: "Cari Barang",
  onInput: (e) => {
    isLoading.value = true;
    debounceSearch((e.target as HTMLInputElement).value);
  },
  value: search.value,
}));
</script>

<template>
  <div class="flex flex-col gap-4 relative">
    <div class="flex justify-between">
      <BreadCrumbComp title="" />

      <div class="w-1/2 lg:w-3/8 relative">
        <Input v-bind="inputSearch" class="h-full" />
        <div
          class="absolute h-full top-0 right-2 flex justify-end items-center w-max text-gray-400 z-1"
        >
          <SearchOutlined />
        </div>
      </div>
    </div>
    <span class="text-sm text-gray-500"
      >Telah ditemukan {{ postData?.length }} barang
    </span>
  </div>
</template>
