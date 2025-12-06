import express from "express";
import { createRsbuild, loadConfig, logger } from "@rsbuild/core";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { transformHtmlTemplate } from "@unhead/vue/server";
import path from "node:path";

const serverRender = (serverAPI) => async (_req, res) => {
  console.log("isi req test : ", _req.url);
  const indexModule = await serverAPI.environments.ssr.loadBundle("index");

  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`,
  });

  const otw = await renderToString(app);

  const markup = await indexModule.render(_req.url);

  const template = await serverAPI.environments.web.getTransformedHtml("index");

  console.log("isi markup : ", markup.html);
  /* const html = template.replace("<!--app-content-->", markup ); */
  const html = await transformHtmlTemplate(
    markup.head,
    template.replace("<!--app-content-->", markup.html)
  );

  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(html);
};

export async function startDevServer() {
  const { content } = await loadConfig({
    path: path.join(process.cwd(), "./rsbuildssr.config.ts"),
  });
  console.log("isi content : ", content);
  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
  });
  const app = express();

  const rsbuildServer = await rsbuild.createDevServer();
  const serverRenderMiddleware = serverRender(rsbuildServer);

  const findsoedRouter = [
    "/",
    "/register",
    "/login",
    "/home",
    "/add",
    "/setting",
    "/detail/:id",
  ];

  findsoedRouter.forEach((v) => {
    app.get(v, async (req, res, next) => {
      try {
        console.log("kesini");
        await serverRenderMiddleware(req, res, next);
      } catch (err) {
        logger.error("SSR render error, downgrade to CSR...\n", err);
        next();
      }
    });
  });

  app.use(rsbuildServer.middlewares);

  const httpServer = app.listen(rsbuildServer.port, () => {
    rsbuildServer.afterListen();
  });

  rsbuildServer.connectWebSocket({ server: httpServer });

  return {
    close: async () => {
      await rsbuildServer.close();
      httpServer.close();
    },
  };
}

startDevServer();
