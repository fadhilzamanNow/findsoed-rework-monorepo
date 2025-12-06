import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
const router = express.Router();
router.use(cors());

router.get("/", (req: Request, res: Response) => {
  console.log("berhasil masuk");
  res.status(200).json({
    success: true,
    message: "Berhasil kesini",
    data: "Berhasil",
  });
});

router.get("/find/:placename", async (req: Request, res: Response) => {
  try {
    console.log("cari : ", req.params.placename);
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete?text==${req.params.placename}&apiKey=${process.env.GEOAPIFY_SECRET}&format=json&limit=10&lang=id`,
    );
    if (response) {
      console.log("isi response : ", response.data);
      const formattedResponse = response.data.results.map((v: any) => ({
        latitude: v.lat,
        longitude: v.lon,
        locationName: v.formatted,
      }));
      res.status(200).json({
        success: true,
        message: "Data berhasil didapatkan",
        data: formattedResponse,
      });
    }
  } catch (e) {
    res.status(404).json({
      success: false,
      message: "Terdapat kesalahan",
    });
  }
});

router.get(
  "/reverse/lat=:lat&lon=:lon",
  async (req: Request, res: Response) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${req.params.lat}&lon=${req.params.lon}&apiKey=${process.env.GEOAPIFY_SECRET}`,
      );
      if (response) {
        console.log(response.data.features[0].properties.formatted);
        res.status(200).json({
          success: true,
          message: "Data berhasil didapatkan",
          data: response.data.features[0].properties.formatted,
        });
      }
    } catch (e) {
      res.status(404).json({
        success: false,
        message: "Data gagal untuk didapatkan",
      });
    }
  },
);

export { router as locationRouter };
