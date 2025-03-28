export async function fetchRecommendations(query: string) {
    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, top_k: 5 }),
      });
  
      if (!res.ok) throw new Error("Failed to fetch recommendations");
  
      return await res.json();
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return null;
    }
  }
  