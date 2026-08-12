import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json(
                { valid: false, error: "No phone number provided." },
                { status: 400 }
            );
        }
        const accessKey = process.env.NUMVERIFY_API_KEY;

        if (!accessKey) {
            return NextResponse.json(
                { valid: false, error: "Server misconfiguration: missing API key." },
                { status: 500 }
            );
        }

        const url = `https://apilayer.net/api/validate?access_key=${accessKey}&number=${encodeURIComponent(
            phone
        )}`;

        const response = await fetch(url);
        const data = await response.json();

        return NextResponse.json({
            valid: Boolean(data.valid),
            raw: data,
        });
    } catch (error) {
        return NextResponse.json(
            { valid: false, error: "Verification request failed." },
            { status: 500 }
        );
    }
}