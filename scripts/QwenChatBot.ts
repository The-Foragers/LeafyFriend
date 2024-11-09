const url = 'https://api.hyperbolic.xyz/v1/chat/completions';

export async function askBotanist(messages: { role: string, content: string }[]): Promise<string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aGFuY29jNkBtc3VkZW52ZXIuZWR1IiwiaWF0IjoxNzMwMzI4NjE0fQ.4uodTe9oWYjakUHBe-FyzGNce5RNVasuWwisYgY_ZYM',
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        {
          role: 'system',
          content: 
          `You are an expert botanist tasked with answering plant related questions in an accurate, detailed fashion, and friendly manner. 
          Any questions not related to plants you will simply respond "I am unable to answer non plant related questions."
          Your answers should be detailed, informative, and be as accurate as possible but also as short and concise as possible.
          If you return a list, make sure it does not exceed 10 items and at a bare minimum includes 3.
          If you are asked to cite a source, you should remind the user you are unable to parse the internet pages or provide direct urls, but refer them to potentially useful and credible sources.
          `
        },
        ...messages
      ],
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9,
      stream: false
    }),
  });

  const json = await response.json();
  return json.choices[0].message.content;
}