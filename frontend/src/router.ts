import {
  createRouter as createVueRouter,
  createMemoryHistory,
  createWebHistory,
} from "vue-router";

import { defineAsyncComponent } from "vue";

const LazyLandingPage = defineAsyncComponent(
  () => import("./pages/LandingPage.vue")
);
const LazyLoginPage = defineAsyncComponent(
  () => import("./pages/LoginPage.vue")
);
const LazyRegisterPage = defineAsyncComponent(
  () => import("./pages/RegisterPage.vue")
);
const LazyListPage = defineAsyncComponent(() => import("./pages/ListPage.vue"));
const LazyAddPage = defineAsyncComponent(() => import("./pages/AddPage.vue"));
const LazySettingPage = defineAsyncComponent(
  () => import("./pages/SettingsPage.vue")
);
const LazyDetailPage = defineAsyncComponent(
  () => import("./pages/DetailItemPage.vue")
);

const routes = [
  {
    path: "/",
    name: "landing",
    component: defineAsyncComponent(() => import("./pages/LandingPage.vue")),
  },
  {
    path: "/login",
    name: "login",
    component: defineAsyncComponent(() => import("./pages/LoginPage.vue")),
  },
  {
    path: "/register",
    name: "about",
    component: defineAsyncComponent(() => import("./pages/RegisterPage.vue")),
  },
  {
    path: "/home",
    name: "list",
    component: defineAsyncComponent(() => import("./pages/ListPage.vue")),
  },
  {
    path: "/add",
    name: "add",
    component: defineAsyncComponent(() => import("./pages/AddPage.vue")),
  },
  {
    path: "/setting",
    name: "setting",
    component: defineAsyncComponent(() => import("./pages/SettingsPage.vue")),
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: defineAsyncComponent(() => import("./pages/DetailItemPage.vue")),
  },
];

const isServer = typeof window === "undefined";

const createRouter = () =>
  createVueRouter({
    history: isServer ? createMemoryHistory("/") : createWebHistory(),
    routes,
  });
export default createRouter;
