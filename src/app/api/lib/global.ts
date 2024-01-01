import { promises as fs } from "fs";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, writeFileAsync } from "fs/promises";
import { ObjectId } from "mongodb";
import path from "path";
import tmp from "tmp";

cloudinary.config({
  cloud_name: "dc2z2c3u8",
  api_key: "828193955168214",
  api_secret: "Ia_BQ8lpzOXbzzT71rLeJPB8z1U",
});

export const uploadImage = async (imageFile) => {
  try {
    let imageUrl = null;

    const fileBuffer = await imageFile.arrayBuffer();

    var mime = imageFile.type;
    var encoding = "base64";
    var base64Data = Buffer.from(fileBuffer).toString("base64");
    var fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

    // const bytes = await imageFile.arrayBuffer();
    // const buffer = Buffer.from(bytes);
    // const { name: tmpFileName, fd: tmpFileDescriptor } = tmp.fileSync();

    // try {
    //   // await writeFile(uploadDir, buffer);
    //   console.log("jhgfdcvhjk", tmpFileName, buffer);
    //   let result = await writeFile(tmpFileName, buffer);
    //   console.log("i8765redfghjki87", result);
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      const uploadResult = await cloudinary.uploader.upload(fileUri, {
        //public_id: `uploaded-images/image_tmpFileName`, // Adjust the public_id as needed
      });
      console.log("kjhgfdfghjk", uploadResult);
      imageUrl = uploadResult?.secure_url;
      try {
        //  await fs.unlink(uploadDir);
        tmp.setGracefulCleanup();
        return imageUrl;
      } catch (error) {
        console.log("Error deleting file:", error);
      }
    } catch (error) {
      console.log(
        "error while uploading image",
        error,
        imageFile,
        tmpFileName,
        `uploaded-images/image_${Date.now()}`
      );
    }
  } catch (error) {
    console.log("error in buffer", error, imageFile);
  }
};

export const deleteImage = async (imageUrl) => {
  const url = new URL(imageUrl);
  const pathnameParts = url.pathname.split("/");
  const imageName = pathnameParts[pathnameParts.length - 1];
  let publicName = `${imageName}`;
  publicName = `uploaded-images/${publicName?.substring(
    0,
    publicName?.lastIndexOf(".")
  )}`;

  cloudinary.uploader.destroy(
    publicName,
    //{ invalidate: true, resource_type: "image" },
    (err, callResult) => console.log("Response", err, callResult)
  );
};
