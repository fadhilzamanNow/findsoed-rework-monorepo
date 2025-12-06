import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";
import { z } from "zod";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { getS3Url } from "../services/s3Upload";

const router = express.Router();
const prisma = new PrismaClient();
dayjs.extend(localizedFormat);

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      console.log("hasil decoded : ", decoded);
      //@ts-ignore
      req.userId = decoded.userId;
      next();
    } else {
      throw "Token is invalid";
    }
  } catch (err) {
    console.log("err :", err);
    res.status(401).json({
      success: false,
      message: err,
    });
  }
};

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const findComment = await prisma.comments.findMany({
        where: {
          postId: req.params.id,
        },
        select: {
          id: true,
          message: true,
          created_at: true,
          userId: true,
          postId: true,
          updated_at: true,
          user: {
            select: {
              username: true,
              profile: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: "asc",
        },
      });

      if (findComment) {
        const dateFormatted = "YYYY-MM-DD";
        const formattedComment = findComment.map((v) => {
          return {
            userName: v.user.username,
            userProfile: v.user.profile?.imageUrl
              ? getS3Url(v.user.profile.imageUrl)
              : null,
            message: v.message,
            created_at: dayjs(v.created_at, "YYYY-MM-DD").format("lll"),
          };
        });
        res.status(200).json({
          success: true,
          message: "Berhasil mendapatkan komen dari post",
          data: formattedComment,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
});

router.post("/create/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { message = null } = req.body;
    if (message && req.params.id) {
      //@ts-ignore
      console.log("userId : ", req.userId);
      console.log("params :", req.params.id);
      const comments = await prisma.comments.create({
        data: {
          message: message,
          postId: req.params.id,
          //@ts-ignore
          userId: req.userId,
        },
      });
      res.status(200).json({
        success: true,
        message: comments,
      });
    }
  } catch (err) {
    console.log("err : ", err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
});

router.patch("/edit/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { message = null } = req.body;
    if (message && req.params.id) {
      const newComments = await prisma.comments.update({
        where: {
          //@ts-ignore
          id: req.params.id.trim(),
        },
        data: {
          message: message,
          updated_at: new Date(),
        },
      });
      res.status(201).json({
        success: true,
        message: newComments,
      });
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err,
    });
  }
});

router.delete(
  "/delete/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const comments = await prisma.comments.delete({
        where: {
          //@ts-ignore
          id: req.params.id.trim(),
        },
      });
      res.status(200).json({
        success: true,
        message: `Komen dengan id : ${comments.id} berhasil dihapus`,
      });
    } catch (err) {
      console.log("error : ", err);
      res.status(400).json({
        success: false,
        message: err,
      });
    }
  },
);

export { router as commentRouter };
