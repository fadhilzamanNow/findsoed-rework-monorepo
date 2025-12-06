import express, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { PrismaClient } from "../../generated/prisma";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import upload from "../middleware/upload";
import { uploadMultipleToS3, getS3Url } from "../services/s3Upload";

dayjs.extend(localizedFormat);

const router = express.Router();
const prisma = new PrismaClient();
router.use(express.json());
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      //@ts-ignore
      req.userId = decoded.userId;
      next();
    }
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err,
    });
  }
};

router.get("/userpost", verifyToken, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    console.log("isi userId userpost: ", req.userId);
    const findPost = await prisma.post.findMany({
      where: {
        //@ts-ignore
        userId: req.userId,
      },
      select: {
        id: true,
        status: {
          select: {
            statusName: true,
          },
        },
        itemName: true,
      },
    });
    if (findPost) {
      const userPost = findPost
        .map((v) => {
          return {
            postId: v.id,
            status: v.status.statusName,
            itemName: v.itemName,
          };
        })
        .sort((a, b) => a.postId.localeCompare(b.postId));

      res.status(200).json({
        success: true,
        message: "Data berhasil diperoleh",
        data: userPost,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
    });
  }
});

router.post(
  "/create",
  verifyToken,
  upload.array("postImage", 5),
  async (req: Request, res: Response) => {
    const {
      itemName = null,
      itemDetail = null,
      itemCategory = null,
      itemStatus = null,
      itemLatitude = null,
      itemLongitude = null,
      locationName = null,
      itemLostDate = null,
    } = req.body;
    try {
      if (!itemName) {
        throw new Error("Nama barang yang hilang masih kosong");
      }
      if (!itemDetail) {
        throw new Error("Deskripsi barang yang hilang masih kosong");
      }
      if (!itemCategory) {
        throw new Error("Kategori barang yang hilang masih kosong");
      }
      if (!itemLatitude) {
        throw new Error("Latitude Barang masih kosong");
      }
      if (!itemLongitude) {
        throw new Error("Longitude Barang masih kosong");
      }

      const statusId = await prisma.postStatus.findUnique({
        where: {
          statusName: "Hilang",
        },
      });

      const categoryId = await prisma.postCategory.findUnique({
        where: {
          categoryName: itemCategory,
        },
      });

      let imageArray = [];
      if (req.files && (req.files.length as number) > 0) {
        // Upload images to S3
        const s3Keys = await uploadMultipleToS3(
          req.files as Express.Multer.File[],
          "post-images",
        );

        imageArray = s3Keys.map((key) => {
          return {
            postImageUrl: key,
          };
        });
      } else {
        throw new Error("Mohon Masukkan Gambar");
      }

      if (statusId && categoryId) {
        const posts = await prisma.post.create({
          data: {
            itemName: itemName,
            itemDetail: itemDetail,
            itemLostDate: new Date(itemLostDate),
            //@ts-ignore
            userId: req.userId,
            categoryId: categoryId.id,
            statusId: statusId.id,
            image: {
              create: imageArray,
            },
            coordinate: {
              create: {
                locationName: locationName,
                latitude: Number(itemLatitude as string),
                longitude: Number(itemLongitude as string),
              },
            },
          },
        });
        res.status(200).json({
          success: true,
          message: "Barang Hilang telah dibuat",
          data: {
            id: posts.id,
            name: posts.itemName,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: `${!statusId ? "Status" : ""}${!statusId && !categoryId ? " dan " : ""}${!categoryId ? "Kategori" : ""} tidak tersedia`,
        });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err,
      });
    }
  },
);

router.patch("/edit/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const {
      itemStatus = null,
      itemDetail = null,
      itemLostDate = null,
      itemCategory = null,
    } = req.body;
    const oldPost = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
    });
    let statusId: null | number = null;
    if (itemStatus) {
      const findStatus = await prisma.postStatus.findFirst({
        where: {
          statusName: itemStatus,
        },
      });
      if (findStatus) {
        statusId = findStatus.id;
      }
    }
    if (oldPost) {
      const newPost = await prisma.post.update({
        where: {
          id: oldPost.id,
        },
        data: {
          updated_at: new Date(),
          itemDetail: itemDetail ? itemDetail : oldPost.itemDetail,
          statusId: itemStatus ? (statusId as number) : oldPost.statusId,
          itemLostDate: itemLostDate
            ? new Date(itemLostDate)
            : oldPost.itemLostDate,
        },
      });

      if (newPost) {
        res.status(200).json({
          success: true,
          message: "Data berhasil untuk diperbarui",
          data: newPost,
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Data gagal untuk diubah",
    });
  }
});

router.get("/detail/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const findDetailPost = await prisma.post.findFirst({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        user: {
          select: {
            username: true,
            profile: true,
            phoneNumber: true,
          },
        },
        status: {
          select: {
            statusName: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        created_at: true,
        updated_at: true,
        itemDetail: true,
        itemName: true,
        coordinate: true,
        comment: true,
        image: true,
        itemLostDate: true,
      },
    });
    if (findDetailPost) {
      const formattedPosts = {
        id: findDetailPost.id,
        userName: findDetailPost.user.username,
        userProfile: findDetailPost.user.profile?.imageUrl
          ? getS3Url(findDetailPost.user.profile.imageUrl)
          : null,
        itemName: findDetailPost.itemName,
        itemDetail: findDetailPost.itemDetail,
        statusName: findDetailPost.status.statusName,
        itemCategory: findDetailPost.category.categoryName,
        images: findDetailPost.image.map((v) => getS3Url(v.postImageUrl)),
        created_at: findDetailPost.created_at,
        updated_at: findDetailPost.updated_at,
        coordinate: {
          latitude: findDetailPost.coordinate?.latitude,
          longitude: findDetailPost.coordinate?.longitude,
        },
        commentNum: findDetailPost.comment.length,
        itemLostDate: dayjs(findDetailPost.itemLostDate, "YYYY-MM-DD").format(
          "LLL",
        ),
        phoneNumber: findDetailPost.user.phoneNumber,
      };
      if (formattedPosts) {
        res.status(200).json({
          success: true,
          message: "Berhasil mendapatkan detail Post",
          data: formattedPosts,
        });
      }
    }
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "Gagal mendapatkan detail Post",
    });
  }
});

router.get("/", verifyToken, async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      user: {
        select: {
          username: true,
          profile: true,
        },
      },
      status: {
        select: {
          statusName: true,
        },
      },
      category: {
        select: {
          categoryName: true,
        },
      },
      created_at: true,
      updated_at: true,
      itemDetail: true,
      itemName: true,
      coordinate: true,
      comment: true,
      image: true,
    },
  });

  const formattedPosts = posts.map((v) => {
    return {
      id: v.id,
      userName: v.user.username,
      userProfile: v.user.profile?.imageUrl
        ? getS3Url(v.user.profile.imageUrl)
        : null,
      itemName: v.itemName,
      itemDetail: v.itemDetail,
      statusName: v.status.statusName,
      categoryName: v.category.categoryName,
      images: v.image.map((img) => getS3Url(img.postImageUrl)),
      created_at: v.created_at,
      updated_at: v.updated_at,
      coordinate: {
        latitude: v.coordinate?.latitude,
        longitude: v.coordinate?.longitude,
      },
      commentNum: v.comment.length,
    };
  });
  res.status(200).json({
    success: true,
    data: formattedPosts,
  });
});

router.get("/:searchitem", async (req: Request, res: Response) => {
  try {
    const findPosts = await prisma.post.findMany({
      where: {
        itemName: {
          contains: req.params.searchitem,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        user: {
          select: {
            username: true,
            profile: true,
          },
        },
        status: {
          select: {
            statusName: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        created_at: true,
        updated_at: true,
        itemDetail: true,
        itemName: true,
        coordinate: true,
        comment: true,
        image: true,
      },
    });

    const formattedPosts = findPosts.map((v) => {
      return {
        id: v.id,
        userName: v.user.username,
        userProfile: v.user.profile?.imageUrl
          ? getS3Url(v.user.profile.imageUrl)
          : null,
        itemName: v.itemName,
        itemDetail: v.itemDetail,
        statusName: v.status.statusName,
        categoryName: v.category.categoryName,
        images: v.image.map((img) => getS3Url(img.postImageUrl)),
        created_at: v.created_at,
        updated_at: v.updated_at,
        coordinate: {
          latitude: v.coordinate?.latitude,
          longitude: v.coordinate?.longitude,
        },
        commentNum: v.comment.length,
      };
    });
    res.status(200).json({
      success: true,
      data: formattedPosts,
    });
  } catch (e) {
    res.status(500).json({
      success: true,
      message: "Gagal untuk mencari post",
    });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  if (req.params.id) {
    try {
      const deleteImages = await prisma.postImages.deleteMany({
        where: {
          postId: req.params.id,
        },
      });

      const deleteComments = await prisma.comments.deleteMany({
        where: {
          postId: req.params.id,
        },
      });

      const deleteCoordinates = await prisma.coordinates.deleteMany({
        where: {
          postId: req.params.id,
        },
      });

      const deletePosts = await prisma.post.delete({
        where: {
          id: req.params.id,
        },
      });
      if (deletePosts) {
        res.status(201).json({
          success: false,
          message: "Post berhasil dihapus",
          data: {
            detailPost: deletePosts,
            ...(deleteComments ?? { comments: deleteComments }),
            ...(deleteCoordinates ?? { coordinates: deleteCoordinates }),
            ...(deleteImages ?? { comments: deleteComments }),
          },
        });
      }
    } catch (err) {
      res.status(500).json({
        success: true,
        message: err,
      });
    }
  }
});

router.get(
  "/userpostdetail/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const findUserPostDetail = await prisma.post.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (findUserPostDetail) {
        const findCategory = await prisma.postCategory.findUnique({
          where: {
            id: findUserPostDetail.categoryId,
          },
        });
        const findStatus = await prisma.postStatus.findUnique({
          where: {
            id: findUserPostDetail.statusId,
          },
        });

        if (findStatus && findCategory) {
          res.status(200).json({
            success: true,
            message: "Data Post berhasil didapatkan",
            data: {
              id: findUserPostDetail.id,
              itemName: findUserPostDetail.itemName,
              itemLostDate: findUserPostDetail.itemLostDate,
              itemDescription: findUserPostDetail.itemDetail,
              itemCategory: findCategory.categoryName,
              itemStatus: findStatus.statusName,
            },
          });
        }
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: e,
      });
    }
  },
);

export { router as postRouter };
