export async function POST(request) {
  try {
    const { image, mediaType, condition } = await request.json();

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Server is missing ANTHROPIC_API_KEY. Set it in Vercel project settings." },
        { status: 500 }
      );
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system:
          'You are a nutrition assistant named BIOZO AI. Your job is to analyze a food photo and give nutrition insights for a specific health condition. Use a warm, advisory tone that offers context and choices — NOT rigid commands or judgment. Base recommendations on widely recognized nutrition guidelines (e.g. WHO, American Diabetes Association for diabetes). Do not diagnose or claim to replace a doctor or dietitian. Reply ONLY with valid JSON, no markdown, no text outside the JSON, with this exact schema: {"food": string, "estimated_calories": string, "key_nutrients": {"carbs": string, "protein": string, "fat": string, "fiber": string}, "insight": string, "balancing_tips": [string, string, string]}',
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: image } },
              { type: "text", text: `Health condition to consider: ${condition || "General health"}. Analyze this food photo.` },
            ],
          },
        ],
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return Response.json(
        { error: data?.error?.message || "Anthropic API request failed" },
        { status: anthropicRes.status }
      );
    }

    const text = (data.content || [])
      .map((b) => b.text || "")
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (err) {
    return Response.json({ error: "Analysis failed on the server." }, { status: 500 });
  }
    }
