import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import analyzer from "vite-bundle-analyzer";
// import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  console.log("isi mode : ", mode);
  const env = loadEnv(mode, process.cwd());

  console.log("isi env : ", env);
  return {
    plugins: [vue()],
    define: {
      BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL),
    },
    build: {
      minify: false,
    },
  };
});
