<script setup lang="ts">
import { Button } from "ant-design-vue";
const { text = "" } = defineProps<{ text: string }>();
</script>

<template>
  <Button
    type="primary"
    :danger="text === 'Hilang' ? true : false"
    :class="[
      text !== 'Hilang'
        ? '!bg-green-400 hover:!bg-green-500 transition duration-50 '
        : '',
    ]"
  >
    {{ text }}
  </Button>
</template>
