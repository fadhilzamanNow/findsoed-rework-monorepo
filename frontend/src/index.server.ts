import { renderToString } from "vue/server-renderer";
import createRouter from "./router";
import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue/server";
import { useSeoMeta } from "@unhead/vue";

export async function render(_url: string) {
  const app = createSSRApp(App);
  const head = createHead();
  const pinia = createPinia();
  const router = createRouter();
  app.use(head).use(pinia).use(router);
  await router.push(_url);
  await router.isReady();

  useSeoMeta(
    {
      title: "Findsoed Rework",
      description: `Aplikasi Pencarian Barang Hilang : ${_url}`,
    },
    { head }
  );

  const context = {};
  const html = await renderToString(app, context);
  console.log("here");
  // return application content and state for server-side rendering
  return { html, head };
}
