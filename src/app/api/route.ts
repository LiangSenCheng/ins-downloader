import { NextResponse } from "next/server";
import { Exception } from "@/exceptions";
import { getPostId, fetchPostJson } from "@/lib/instagram";
import { enableServerAPI } from "@/configs/instagram";

function handleError(error: any) {
  if (error instanceof Exception) {
    return NextResponse.json({ error: error.message }, { status: error.code });
  } else {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  if (!enableServerAPI) {
    return NextResponse.json({ error: "Not Implemented" }, { status: 501 });
  }

  const { searchParams } = new URL(request.url);
  let postId: string | null = searchParams.get("id");
  const url: string | null = searchParams.get("url");

  if (!postId) {
    try {
      postId = getPostId(url);
    } catch (error: any) {
      return handleError(error);
    }
  }

  try {
    const postJson = await fetchPostJson(postId);

    return NextResponse.json(postJson);
  } catch (error: any) {
    return handleError(error);
  }
}
