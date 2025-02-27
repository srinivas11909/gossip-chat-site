import { NextResponse } from "next/server";

const countryGeonameIds = {
  USA: 6252001,
  UK: 2635167,
  India: 1269750,
  Canada: 6251999,
  Australia: 2077456,
};

export async function GET(req) {
  const url = new URL(req.url);
  const country = url.searchParams.get("country");

  if (!country || !(country in countryGeonameIds)) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `http://api.geonames.org/childrenJSON?geonameId=${countryGeonameIds[country]}&username=YOUR_GEONAMES_USERNAME`
    );
    const data = await response.json();

    if (!data.geonames) {
      return NextResponse.json({ error: "No states found" }, { status: 404 });
    }

    const states = data.geonames.map((state) => state.name);
    return NextResponse.json({ states });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch states" }, { status: 500 });
  }
}
