export async function fetchRecommendations(query: string) {
  try {
    const res = await fetch("http://localhost:8000/recommend-books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        query: query,
        top_k: 5 
      }),
    });

    if (!res.ok) throw new Error("Failed to fetch recommendations");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error; // Propagate the error to be handled by the component
  }
}
  