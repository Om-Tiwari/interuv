// pages/api/figma.js

import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");
  const nodeId = searchParams.get("nodeId");
  const token = "figd_me4-KKK9dIvaBjCBgoQqwiSXD9qbUXvMdXRv3NMf"; // Replace with your Figma API token

  try {
    // Fetch the image URL from the Figma API
    const response = await fetch(
      `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}`,
      {
        headers: {
          "X-Figma-Token": token,
        },
      }
    );

    const data = await response.json();

    if (data.err) {
      return NextResponse.json(
        { error: "Failed to fetch image from Figma" },
        { status: 500 }
      );
    }

    // Send back the image URL
    if (nodeId && data.images) {
      return NextResponse.json({ imageUrl: data.images });
    } else {
      return NextResponse.json(
        { error: "Invalid nodeId or image not found" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch image from Figma" },
      { status: 500 }
    );
  }
};
