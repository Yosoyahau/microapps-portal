export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_KEY is not defined");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Gemini API timeout - No response after 60 seconds.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!resultText) {
    throw new Error("Invalid response from Gemini API");
  }

  // Clean up markdown block wrapping if present
  const cleanText = resultText
    .replace(/^```markdown\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return cleanText;
}
