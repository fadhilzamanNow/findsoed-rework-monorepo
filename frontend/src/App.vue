<script setup lang="ts">
import { watchEffect } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/authStore";
import { findUserInfo } from "./api/Auth/Auth";
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import { validateTokenHandler } from "./utils/validateToken";
useHead({
  title: "Findsoed Rework",
});

const auth = useAuthStore();
const { authToken } = storeToRefs(auth);

const findInfo = async () => {
  try {
    const response = await findUserInfo();
    if (response) {
      auth.setUserInfo({
        username: response.data.username,
        userId: response.data.userId,
        email: response.data.email,
        imageUrl: response.data.imageUrl,
        phoneNumber: response.data.phoneNumber,
      });
    }
  } catch (e) {
    auth.setAuthToken(null);
    auth.setUserInfo(null);
  }
};

watchEffect(() => {
  if (typeof window !== "undefined") {
    if (!authToken.value) {
      const token = localStorage.getItem("authToken");
      if (token) {
        const timeLeft = validateTokenHandler(token);
        if (timeLeft) {
          auth.setAuthToken(token);
          findInfo();
          setTimeout(() => {
            localStorage.removeItem("authToken");
            auth.setAuthToken(null);
            auth.setUserInfo(null);
          }, timeLeft);
        } else {
          auth.setAuthToken(null);
          auth.setUserInfo(null);
        }
      }
    }
  }
});
</script>

<template>
  <RouterView />
</template>
