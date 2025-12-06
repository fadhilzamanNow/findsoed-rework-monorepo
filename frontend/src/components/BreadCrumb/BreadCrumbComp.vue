<script setup lang="ts">
import { HomeOutlined } from "@ant-design/icons-vue";

const {title = ""} = defineProps<{title : string}>()
</script>

<template>
    <div class="flex gap-2 items-center">
      <div class="flex items-center gap-2 text-base text-gray-600 py-2 group">
        <RouterLink to="/home" class="flex items-center gap-2">
          <HomeOutlined class="group-hover:text-gray-700 group-hover:cursor-pointer"  />
          <span class="text-sm group-hover:text-gray-700 group-hover:cursor-pointer">Home</span>
        </RouterLink>
          <span class="text-sm"> / {{ title }}</span>
      </div>
    </div>

</template>
