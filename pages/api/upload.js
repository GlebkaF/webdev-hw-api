import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";

const s3Client = new S3Client({
  region: process.env.YANDEX_REGION,
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY_ID,
    secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.YANDEX_ENDPOINT,
});

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // Ограничение размера файла до 5 МБ
  },
  // разрешаем грузить только картинки
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // Загрузка файла в Yandex S3
  const file = req.file;
  const key = encodeURIComponent(
    Date.now().toString() + "-" + file.originalname // Добавьте имя файла здесь
  );

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.YANDEX_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });

  try {
    await s3Client.send(putObjectCommand);

    const publicUrl = `${process.env.YANDEX_PUBLIC_URL}/${encodeURIComponent(
      key
    )}`;

    return res.status(200).json({ success: true, fileUrl: publicUrl });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return res.status(500).json({ error: "Error uploading to S3" });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handleRequest(req, res) {
  const multerMiddleware = upload.single("file");
  multerMiddleware(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return handler(req, res);
  });
}
