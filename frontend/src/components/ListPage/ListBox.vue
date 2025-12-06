<script setup lang="ts">
import { watchEffect } from "vue";
import { getAllPost } from "../../api/Post/Post";
import { usePostStore } from "../../stores/postStore";
import HeaderListPage from "./HeaderListPage.vue";
import ListCard from "./ListCard.vue";

const post = usePostStore();

const getAllPostData = async () => {
  try {
    const response = await getAllPost();
    if (response) {
      post.setPost(response.data);
    }
  } catch (e) {
    post.setPost([]);
  }
};

watchEffect(() => {
  getAllPostData();
});
</script>

<template>
  <div class="md:ml-16 mt-16 pt-5.5 px-4 sm:px-6 md:px-8 h-full">
    <div class="flex flex-col gap-6 h-full w-full">
      <HeaderListPage />
      <ListCard />
    </div>
  </div>
</template>
