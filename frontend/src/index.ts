import { createApp } from "vue";
import App from "./App.vue";
import createRouter from "./router";
import "./index.css";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue/client";

const head = createHead();

const router = createRouter();
const pinia = createPinia();
createApp(App).use(head).use(pinia).use(router).mount("#root", true);
