import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/actions/links";

/**
 * GET /l/[code]
 * Redirects to the original URL for a given short code
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Validate the short code
    if (!code || typeof code !== "string") {
      return new NextResponse("Invalid short code", { status: 400 });
    }

    // Fetch the link from the database
    const result = await getLinkByShortCode(code);

    // Handle link not found
    if (!result.success || !result.data) {
      return new NextResponse("Link not found", { status: 404 });
    }

    // Redirect to the original URL
    return NextResponse.redirect(result.data.originalUrl, {
      status: 301, // Permanent redirect
    });
  } catch (error) {
    console.error("Redirect error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
