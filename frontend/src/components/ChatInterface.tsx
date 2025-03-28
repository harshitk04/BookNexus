"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchRecommendations } from "@/lib/api";

export default function ChatInterface() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    if (!query) return;
    const res = await fetchRecommendations(query);
    setResponse(res?.recommendations || "No recommendations found.");
  };

  return (
    <div className="flex flex-col items-center py-10 px-4">
      <h2 className="text-2xl font-semibold mb-4">Ask for a Book Recommendation</h2>
      <div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="What kind of book are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSubmit}>Ask</Button>
      </div>
      {response && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-md">
          <h3 className="font-bold">Recommendations:</h3>
          <p className="text-gray-700 mt-2">{response}</p>
        </div>
      )}
    </div>
  );
}
