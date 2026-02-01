let memory = [];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    memory.push(`User: ${message}`);
    if (memory.length > 6) memory.shift(); // keep short memory

    const prompt = `
You are a helpful AI assistant.
Answer clearly and simply.

Conversation so far:
${memory.join("\n")}

AI:
`;

    const response = await fetch("https://api.deepai.org/api/text-generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.DEEPAI_API_KEY
      },
      body: JSON.stringify({ text: prompt })
    });

    const data = await response.json();
    const reply = data.output || "Can you rephrase that in a simpler way?";

    memory.push(`AI: ${reply}`);

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      reply: "Something went wrong. Try again."
    });
  }
}
