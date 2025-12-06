import express from "express";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { transformHtmlTemplate } from "@unhead/vue/server";

const require = createRequire(import.meta.url);

const base = process.env.BASE || "/";

const serverRender = async (_req, res) => {
  const remotesPath = path.join(process.cwd(), `./dist/server/index.js`);

  const importedApp = require(remotesPath);
  console.log("isi url : ", _req.url);

  const markup = await importedApp.render(_req.url);

  console.log("isi markup : ", markup.html);

  const template = fs.readFileSync(`${process.cwd()}/dist/index.html`, "utf-8");

  /* const html = await transformHtmlTemplate(markup.header, template.replace("<!--app-content-->", markup.html)) */
  const html = await transformHtmlTemplate(
    markup.head,
    template.replace("<!--app-content-->", markup.html)
  );
  /* const html = template.replace(`<!--app-content-->`, markup); */

  res.status(200).set({ "Content-Type": "text/html" }).send(html);
};

const port = process.env.PORT || 3050;

export async function preview() {
  const app = express();

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
    app.get(v, (req, res, next) => {
      try {
        serverRender(req, res, next);
      } catch (err) {
        console.error("SSR render error, downgrade to CSR...\n", err);
        next();
      }
    });
  });

  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/static", { extensions: [] }));
  app.use(express.static("dist"));

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

preview(process.cwd());
