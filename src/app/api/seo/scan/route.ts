import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const targetUrl = url.startsWith("http") ? url : `https://${url}`;
    
    // Fetch the target page with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(targetUrl, { 
      signal: controller.signal,
      headers: { "User-Agent": "M2-Orbit-SEO-Audit/1.0" }
    });
    
    clearTimeout(timeoutId);
    
    const html = await response.text();
    const headers = response.headers;
    
    // Basic Analysis
    const results = {
      url: targetUrl,
      status: response.status,
      passed: [] as number[],
      details: {} as any
    };

    // 1. Technical SEO & Infrastructure
    if (response.status === 200) results.passed.push(14); // Correct status responses
    if (targetUrl.startsWith("https")) results.passed.push(18); // SSL valid/enabled
    
    // Check for robots.txt
    try {
      const robotsUrl = new URL("/robots.txt", targetUrl).toString();
      const robotsRes = await fetch(robotsUrl, { signal: AbortSignal.timeout(3000) });
      if (robotsRes.ok) {
        results.passed.push(1); // robots.txt exists
        const robotsText = await robotsRes.text();
        if (robotsText.toLowerCase().includes("user-agent")) results.passed.push(2); // valid syntax
      }
    } catch (e) {}

    // 2. AI Readiness & Semantic Structure (JSON-LD Detection)
    if (html.includes("application/ld+json")) {
      results.passed.push(7); // Organization Schema (detected ld+json)
      if (html.includes("GovernmentOrganization")) results.passed.push(8);
      if (html.includes("Person")) results.passed.push(9);
      if (html.includes("Dataset")) results.passed.push(10);
      results.passed.push(201); // AI-readable structure
      results.passed.push(204); // Knowledge Graph readiness
    }

    // 3. Government Transparency Indicators
    const transparencyKeywords = ["procurement", "tenders", "budget", "minister", "director general", "strategic plan", "annual report", "audit"];
    const foundKeywords = transparencyKeywords.filter(k => html.toLowerCase().includes(k));
    
    if (foundKeywords.includes("minister")) results.passed.push(101);
    if (foundKeywords.includes("director general")) results.passed.push(102);
    if (foundKeywords.includes("strategic plan")) results.passed.push(105);
    if (foundKeywords.includes("audit") || foundKeywords.includes("annual report")) results.passed.push(106);
    if (foundKeywords.includes("procurement") || foundKeywords.includes("tenders")) results.passed.push(107);
    if (foundKeywords.includes("budget")) results.passed.push(108);

    // 4. Security & Domain Legitimacy
    if (targetUrl.includes(".govsomaliland.org") || targetUrl.includes(".gov.sl")) {
      results.passed.push(104); // Founding Law / Institutional Legitimacy
    }
    
    // Security headers
    if (headers.get("Content-Security-Policy")) results.passed.push(17);
    if (headers.get("X-Frame-Options")) results.passed.push(16);
    if (headers.get("Strict-Transport-Security")) results.passed.push(15);
    
    // Check for WAF / Cloudflare
    if (headers.get("cf-ray") || headers.get("server")?.toLowerCase().includes("cloudflare")) {
      results.passed.push(20); // Edge caching / WAF
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("SEO Scan Error:", error);
    return NextResponse.json({ error: "Failed to scan site. Connection timed out or blocked." }, { status: 500 });
  }
}
