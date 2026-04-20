import { NextResponse } from "next/server";

// ── Sovereign Geospatial Knowledge Base ──────────────────────────────────
// This is the structured intelligence layer that the AI uses as context.
// Each entry has geographic coordinates so the frontend can trigger map actions.

const GEOSPATIAL_KNOWLEDGE = [
  {
    id: "berbera-port",
    keywords: ["berbera", "port", "maritime", "dp world", "shipping", "dock"],
    intel: {
      title: "Berbera Port — Strategic Maritime Hub",
      summary: "Berbera Port is Somaliland's primary international port and the centerpiece of the Berbera Economic Zone. DP World operates the port under a 30-year concession signed in 2016, with a $442M expansion project completed in 2021 that tripled capacity to 500,000 TEUs annually. The port handles approximately 30% of Ethiopia's transit cargo, making it a critical economic lever for both nations.",
      facts: [
        "Capacity: 500,000 TEU/year (post-expansion)",
        "Operator: DP World (30-year concession)",
        "Ethiopia transit share: ~30% of landlocked cargo",
        "Free Zone: 12 km² Berbera Economic Zone operational",
        "Strategic significance: Alternative to Djibouti for Ethiopian trade"
      ],
      category: "infrastructure"
    },
    mapAction: { lng: 45.0188, lat: 10.4357, zoom: 13, pitch: 55, bearing: -30, layer: "berbera" }
  },
  {
    id: "hargeisa",
    keywords: ["hargeisa", "capital", "city", "urban", "population", "government"],
    intel: {
      title: "Hargeisa — Capital & Administrative Center",
      summary: "Hargeisa is the political, economic, and cultural capital of Somaliland with an estimated population exceeding 1.2 million. It houses all major government institutions including the Presidential Palace, Parliament (Golaha Wakiillada), and the House of Elders (Guurti). The city serves as the primary commercial hub with the Hargeisa International Airport connecting to regional and international destinations.",
      facts: [
        "Population: ~1.2 million (2024 estimate)",
        "Airport: Egal International (HGA) — regional hub",
        "Government seat: All three branches",
        "Economy: Services, trade, remittances, livestock",
        "Urban growth rate: ~4% annually"
      ],
      category: "administrative"
    },
    mapAction: { lng: 44.0626, lat: 9.5600, zoom: 12, pitch: 40, bearing: 0, layer: "capital" }
  },
  {
    id: "wajaale",
    keywords: ["wajaale", "tog wajaale", "border", "ethiopia", "crossing", "customs"],
    intel: {
      title: "Tog-Wajaale — Ethiopia Border Crossing",
      summary: "Tog-Wajaale is the primary land border crossing between Somaliland and Ethiopia, handling the majority of overland trade between the two nations. The town sits on the Berbera Corridor, making it the critical terrestrial node for Ethiopian transit cargo. Customs revenue from this crossing represents a significant portion of Somaliland's government income.",
      facts: [
        "Type: Primary international land crossing",
        "Trade volume: Majority of SL-Ethiopia overland trade",
        "Corridor: Direct link on Berbera-Wajaale highway",
        "Revenue: Major customs revenue generator",
        "Strategic: Gateway for Ethiopian market access"
      ],
      category: "trade"
    },
    mapAction: { lng: 43.3384, lat: 9.3741, zoom: 12, pitch: 45, bearing: 15, layer: "border" }
  },
  {
    id: "berbera-corridor",
    keywords: ["corridor", "trade route", "highway", "road", "transport", "logistics"],
    intel: {
      title: "Berbera Corridor — Economic Lifeline",
      summary: "The Berbera Corridor is the 260km highway connecting Berbera Port to the Ethiopian border via Hargeisa and Wajaale. It is Somaliland's most important infrastructure asset, enabling the transit of goods between landlocked Ethiopia and the Gulf of Aden. The corridor was upgraded with UAE and international funding, reducing transit times significantly.",
      facts: [
        "Length: ~260 km (Berbera → Hargeisa → Wajaale)",
        "Function: Ethiopia's second maritime gateway",
        "Upgrade: Major rehabilitation completed 2020",
        "Traffic: Commercial trucks, livestock, consumer goods",
        "Economic impact: Generates 30%+ of national revenue"
      ],
      category: "infrastructure"
    },
    mapAction: { lng: 44.2, lat: 9.9, zoom: 8, pitch: 35, bearing: -10, layer: "corridor" }
  },
  {
    id: "burao",
    keywords: ["burao", "burco", "togdheer", "livestock", "market"],
    intel: {
      title: "Burao — Livestock Capital",
      summary: "Burao (Burco) is the capital of Togdheer region and Somaliland's second-largest city. It is the center of the livestock trade — the backbone of Somaliland's economy. The city hosts one of the largest livestock markets in the Horn of Africa, with millions of animals exported annually through Berbera Port, primarily to Saudi Arabia and the Gulf states during Hajj season.",
      facts: [
        "Region: Togdheer capital",
        "Economy: Livestock hub — largest market in Horn of Africa",
        "Exports: ~5 million livestock/year through Berbera",
        "Primary markets: Saudi Arabia, UAE, Egypt",
        "Peak season: Hajj export window"
      ],
      category: "economic"
    },
    mapAction: { lng: 45.5333, lat: 9.5167, zoom: 11, pitch: 30, bearing: 0, layer: "burao" }
  },
  {
    id: "somaliland-overview",
    keywords: ["somaliland", "overview", "country", "nation", "independence", "sovereignty", "map"],
    intel: {
      title: "Republic of Somaliland — Sovereign Overview",
      summary: "The Republic of Somaliland declared independence from Somalia on May 18, 1991, restoring the sovereignty it briefly held in 1960. With a functioning multiparty democracy, its own currency (Somaliland Shilling), military, and judicial system, Somaliland operates as a de facto independent state. The territory covers approximately 137,600 km² along the southern coast of the Gulf of Aden.",
      facts: [
        "Independence: May 18, 1991",
        "Capital: Hargeisa",
        "Area: ~137,600 km²",
        "Government: Bicameral (House of Reps + Guurti)",
        "Currency: Somaliland Shilling (SLSH)",
        "Coastline: ~740 km (Gulf of Aden)"
      ],
      category: "sovereignty"
    },
    mapAction: { lng: 46.0, lat: 9.8, zoom: 6.5, pitch: 0, bearing: 0, layer: "overview" }
  },
  {
    id: "gis-education",
    keywords: ["gis", "geographic", "information", "system", "how", "maps", "cartography", "projections", "mercator"],
    intel: {
      title: "GIS & Geospatial Intelligence — Fundamentals",
      summary: "A Geographic Information System (GIS) captures, stores, analyzes, and visualizes spatial data. Modern GIS moves beyond simple map-making into a full intelligence layer: overlaying trade flows, population density, infrastructure gaps, and security data onto geographic coordinates. The shift from prehistoric cave maps → Ptolemaic projections → colonial cartography → satellite imagery → AI-powered spatial analysis represents humanity's evolving ability to model and control territory.",
      facts: [
        "Core concept: Layers of data over geography",
        "Key tools: QGIS (open-source), ArcGIS (enterprise), MapLibre (web)",
        "Data types: Vector (points/lines/polygons) vs Raster (imagery/grids)",
        "Projections: Mercator distorts Africa's size by 14x — always use equal-area",
        "Modern frontier: AI + satellite = automated land-use classification"
      ],
      category: "education"
    },
    mapAction: { lng: 46.0, lat: 9.8, zoom: 6.5, pitch: 0, bearing: 0, layer: "overview" }
  },
  {
    id: "borama",
    keywords: ["borama", "awdal", "western", "university"],
    intel: {
      title: "Borama — Western Gateway",
      summary: "Borama is the capital of Awdal region in western Somaliland. It is home to Amoud University, one of the oldest and most respected universities in the region. The city serves as a key agricultural zone and a secondary border crossing point with Ethiopia and Djibouti.",
      facts: [
        "Region: Awdal capital",
        "University: Amoud University (est. 1998)",
        "Agriculture: Key farming zone",
        "Border proximity: Near Djibouti and Ethiopia",
        "Strategic: Western development corridor"
      ],
      category: "administrative"
    },
    mapAction: { lng: 43.1803, lat: 9.9417, zoom: 12, pitch: 30, bearing: 0, layer: "borama" }
  }
];

// ── Intent Matching Engine ───────────────────────────────────────────────
function matchIntent(query: string) {
  const lower = query.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of GEOSPATIAL_KNOWLEDGE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score += kw.length; // longer matches = higher confidence
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }
  return bestMatch;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const match = matchIntent(message);

    // ── Try Gemini AI for enriched response ─────────────────────────────
    let aiResponse = "";
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey && geminiKey !== "your-free-tier-key-here") {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          systemInstruction: `You are GeoMind, a sovereign geospatial intelligence engine for the Republic of Somaliland.
You answer questions about geography, GIS systems, mapping technology, trade routes, and Somaliland's strategic infrastructure.
Be authoritative, precise, and data-driven. Use the following context if relevant:

${match ? `CONTEXT: ${match.intel.title}\n${match.intel.summary}\nFacts: ${match.intel.facts.join("; ")}` : "No specific location matched. Provide general geospatial intelligence."}

Rules:
- Always refer to "Republic of Somaliland" (never conflate with Somalia)
- Capital is Hargeisa
- Be concise but insightful (3-5 sentences max)
- If asked about map tools, recommend QGIS for analysis, MapLibre for web rendering
- End with a strategic insight when possible`
        });

        const result = await model.generateContent(message);
        aiResponse = result.response.text() || "";
      } catch (aiErr) {
        console.error("Gemini fallback:", aiErr);
      }
    }

    // ── Construct response ──────────────────────────────────────────────
    const response: any = {
      timestamp: new Date().toISOString(),
      query: message,
      source: aiResponse ? "gemini-2.0-flash" : "sovereign-knowledge-base",
    };

    if (match) {
      response.intel = match.intel;
      response.mapAction = match.mapAction;
      response.text = aiResponse || match.intel.summary;
    } else {
      response.intel = null;
      response.mapAction = null;
      response.text = aiResponse || "No matching intelligence found for this query. Try asking about Berbera, Hargeisa, Wajaale, Burao, Borama, the Berbera Corridor, Somaliland overview, or GIS fundamentals.";
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("GeoMind API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
