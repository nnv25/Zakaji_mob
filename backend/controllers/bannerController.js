import Banner from "../models/bannerModel.js";

// ✅ Добавить или обновить три баннера
export const uploadBanners = async (req, res) => {
  try {
    // файлы из multer
    const files = req.files;
    const updates = {};

    if (files.banner1) updates.banner1 = files.banner1[0].filename;
    if (files.banner2) updates.banner2 = files.banner2[0].filename;
    if (files.banner3) updates.banner3 = files.banner3[0].filename;

    let bannerDoc = await Banner.findOne();
    if (!bannerDoc) {
      bannerDoc = await Banner.create(updates);
    } else {
      Object.assign(bannerDoc, updates);
      await bannerDoc.save();
    }

    res.status(200).json({
      message: "Баннеры успешно обновлены",
      banner: bannerDoc,
    });
  } catch (error) {
    console.error("Ошибка при обновлении баннеров:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Получить баннеры
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.findOne();
    if (!banners)
      return res.status(200).json({
        banner1: null,
        banner2: null,
        banner3: null,
      });

    const base = `https://${req.headers.host}/uploadsBanner`;
    res.status(200).json({
      banner1: banners.banner1 ? `${base}/${banners.banner1}` : null,
      banner2: banners.banner2 ? `${base}/${banners.banner2}` : null,
      banner3: banners.banner3 ? `${base}/${banners.banner3}` : null,
    });
  } catch (error) {
    console.error("Ошибка получения баннеров:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};