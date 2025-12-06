<script lang="ts" setup>
import Card from "./Card.vue";
import { storeToRefs } from "pinia";
import { Empty } from "ant-design-vue";
import { usePostStore } from "../../stores/postStore";
import { LoadingOutlined } from "@ant-design/icons-vue";

const { postData, isLoading } = storeToRefs(usePostStore());
</script>

<template>
  <div class="rounded-md transition-all duration-300" v-if="!isLoading">
    <div
      v-if="postData?.length as number > 0"
      class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-2 justify-between mx-auto transition-all duration-300 ease-in h-[75vh] w-full place-content-start gap-5"
    >
      <div v-for="(d, i) in postData" :key="i" class="flex justify-center">
        <Card
          :itemName="d.itemName"
          :userName="d.userName"
          :commentNum="d.commentNum"
          :id="d.id"
          :likeNum="d.likeNum"
          :status="d.statusName"
          :images="d.images"
          :userProfile="d.userProfile || null"
          :itemDetail="d.itemDetail"
          :itemCategory="d.categoryName"
          :created_at="d.created_at"
          :updated_at="d.updated_at"
        />
      </div>
    </div>
    <div v-if="postData?.length === 0" class="">
      <Empty description="">
        <span class="text-gray-400">Barang Yang Kamu Cari Tidak Ditemukan</span>
      </Empty>
    </div>
  </div>
  <div
    v-else
    class="text-4xl flex justify-center items-center h-[50vh] text-blue-600"
  >
    <LoadingOutlined />
  </div>
</template>
