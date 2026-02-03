import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name + `${Date.now()}`;

    const UploadFileResponse = await imagekit.upload({
      file: buffer,
      fileName: filename,
      useUniqueFileName: true,
    });

    return NextResponse.json(
      {
        success: true,
        url: UploadFileResponse.url,
        fileId: UploadFileResponse.fileId,
        fileName: UploadFileResponse.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
