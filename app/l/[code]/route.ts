import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/lib/react-query/actions/link.action";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code || typeof code !== "string") {
      return new NextResponse("Invalid short code", { status: 400 });
    }

    const result = await getLinkByShortCode(code);

    if (!result.success || !result.data) {
      return new NextResponse("Link not found", { status: 404 });
    }

    return NextResponse.redirect(result.data.originalUrl, {
      status: 301,
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
