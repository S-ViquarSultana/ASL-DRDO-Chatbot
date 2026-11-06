import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
    const { prompt } = req.body;
  
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
      }),
    });
  
    const data = await response.json();
    res.status(200).json({ message: 'Response from groq chat API' })
   }
   else {
  res.status(405).json({ error: 'Method not allowed' })
 }
}
