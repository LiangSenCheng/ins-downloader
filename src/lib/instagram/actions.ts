"use server";
import { Exception } from "@/exceptions";
import { VideoJson } from "@/types";
import { getPostId, fetchPostJson, formatDownloadJson } from "@/lib/instagram";
import { formatPageJson } from "@/lib/instagram/instagramScraper";

function handleError(error: any) {
  if (error instanceof Exception) {
    return { error: error.message };
  } else {
    console.error(error);
    return {
      error: "Internal Server Error",
    };
  }
}

export async function downloadInstagramVideo(postUrl: string) {
  let postId;

  try {
    postId = getPostId(postUrl);
  } catch (error: any) {
    return handleError(error);
  }

  try {
    const json = await fetchPostJson(postId);
    const formattedJson = formatPageJson(json) as VideoJson;
    const downloadJson = formatDownloadJson(postId, formattedJson);

    return downloadJson;
  } catch (error: any) {
    return handleError(error);
  }
}
