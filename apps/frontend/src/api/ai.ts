export async function aiQuerry(query: string): Promise<string> {
  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (response.ok) {
      const aiResponse = (await response.json() as { response: string }).response;
      return aiResponse;
    } else {
      console.error("Error sending message:", response.statusText);
      return "Error sending message. Please try again."
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Error sending message. Please try again."
  }
}