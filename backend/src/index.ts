import express, { Request, Response } from "express";
import path from "path";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import { authRouter } from "./routes/auth";
import { postRouter } from "./routes/post";
import { commentRouter } from "./routes/comment";
import cors from "cors";
import { locationRouter } from "./routes/location";
import upload from "./middleware/upload";
import { uploadMultipleToS3, getS3Url } from "./services/s3Upload";
import { PrismaClient } from "../generated/prisma";
import url from "url";
var proxy = require("express-http-proxy");
const app = express();
const port = 3500;
const OASSpec = YAML.load(path.join(__dirname, "openapi.yaml"));

const apiProxy = proxy("http://10.232.91.128:9001", {
  proxyReqPathResolver: (req: any) => url.parse(req.baseUrl).path,
});
// const proxyMiddleware = createProxyMiddleware<Request, Response>({
//   target: "http://10.232.91.128:9001",
//   changeOrigin: true,
// });

app.get("/test3", (_, res: Response) => {
  res.json({
    message: "test 3",
  });
});
app.get("/", (_, res: Response) => {
  res.redirect("/api-docs");
});

app.get("/test2", (_, res: Response) => {
  res.json({
    message: "test 2",
  });
});

const prisma = new PrismaClient();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(OASSpec));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Testing aja" });
});

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/location", locationRouter);

app.use("/static", express.static(path.join(__dirname, "public")));

app.post(
  "/upload",
  upload.array("images", 5),
  async (req: Request, res: Response) => {
    try {
      console.log("ok");
      console.log(req.files);
      console.log(req.body);

      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        // Upload images to S3
        const s3Keys = await uploadMultipleToS3(
          req.files as Express.Multer.File[],
          "uploads",
        );

        const filesArray = s3Keys.map((key, i) => {
          return {
            id: i,
            filename: key,
            url: getS3Url(key),
          };
        });

        res.status(201).json({
          success: true,
          message: "Gambar berhasil untuk dikirim",
          data: {
            itemName: req.body.itemName,
            files: filesArray,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Gambar gagal untuk dikirim",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading images to S3",
        error: error,
      });
    }
  },
);

app.get("/category", async (req: Request, res: Response) => {
  try {
    const category = await prisma.postCategory.findMany();
    console.log("category :", category);
    res.json({
      category: category,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
});

export default app;
