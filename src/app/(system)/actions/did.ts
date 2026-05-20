"use server";

// Image URLs for our two personas
const AVATAR_SOURCES = {
  "mahmoud": "https://m2creative.vercel.app/images/profiles/mahmoud_awaleh_portrait.jpg", // Ensure this URL is a publicly accessible, valid image of Mahmoud
  "m2-creative": "https://m2creative.vercel.app/images/branding/m2_gold_logo_black_bg.jpg" // Ensure this is a valid image URL for the logo
};

export async function generateAvatarVideo(scriptText: string, persona: "mahmoud" | "m2-creative") {
  const DID_API_KEY = process.env.DID_API_KEY;

  if (!DID_API_KEY) {
    throw new Error("DID_API_KEY is not configured in the environment variables.");
  }

  // Define voice IDs (we can customize these using D-ID's available voices)
  const voiceId = persona === "mahmoud" 
    ? "en-US-ChristopherNeural" // Professional male voice
    : "en-US-JennyNeural";      // Neutral/systemic female voice

  try {
    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_url: AVATAR_SOURCES[persona],
        script: {
          type: "text",
          input: scriptText,
          provider: {
            type: "microsoft",
            voice_id: voiceId,
          }
        },
        config: {
          fluent: true,
          pad_audio: 0.0,
          stitch: true,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`D-ID API Error (${response.status}): ${errorData.description || response.statusText}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error: unknown) {
    console.error("D-ID Generation Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: message };
  }
}

export async function checkAvatarStatus(id: string) {
  const DID_API_KEY = process.env.DID_API_KEY;

  if (!DID_API_KEY) {
    throw new Error("DID_API_KEY is not configured in the environment variables.");
  }

  try {
    const response = await fetch(`https://api.d-id.com/talks/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }

    const data = await response.json();
    return { 
      success: true, 
      status: data.status, 
      result_url: data.result_url || null,
      error: data.error // sometimes D-ID populates an inner error object if generation fails
    };
  } catch (error: unknown) {
    console.error("D-ID Polling Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: message };
  }
}
