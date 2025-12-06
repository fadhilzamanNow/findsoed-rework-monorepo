<script setup lang="ts">
import { Avatar, AvatarProps, Flex } from "ant-design-vue";
import { computed } from "vue";

type CommentType = {
  userName: string;
  userProfile: string;
  message: string;
  created_at: string;
};

const { userName, userProfile, message, created_at } =
  defineProps<CommentType>();

const commentAvatarProps = computed<AvatarProps>(() => ({
  // @ts-expect-error Variabel didefine dari bundler
  src: `${BACKEND_URL}static/images/${userProfile}`,
  shape: "square",
  class: "select-none",
}));
</script>

<template>
  <div class="h-full flex flex-col gap-2 p-1 hover:bg-gray-50 cursor-pointer">
    <div class="flex gap-2.5">
      <div class="text-xs self-start">
        <Avatar v-if="userProfile" v-bind="commentAvatarProps" />
        <Avatar v-else shape="square">{{ userName }}</Avatar>
      </div>
      <Flex vertical gap="8">
        <Flex align="start" gap="6" class="">
          <span
            class="text-[8px] text-black/40 font-semibold lg:font-bold lg:text-xs"
          >
            {{ userName }}
          </span>
          <span className="text-[8px] text-black/40 font-normal lg:text-xs  ">
            {{ created_at }}
          </span>
        </Flex>
        <p
          class="text-[10px] font-normal w-full text-black text-wrap wrap-break-word lg:text-xs"
        >
          {{ message }}
        </p>
      </Flex>
    </div>
  </div>
</template>
