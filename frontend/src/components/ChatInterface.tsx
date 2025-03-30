"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchRecommendations } from "@/lib/api";
import { BookOpen, Search, Sparkles, Loader2, ChevronRight, Stars, Bookmark, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookRecommendation {
  title: string;
  description: string;
  thumbnail?: string;
}

export default function BookRecommendationApp() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<{
    text: string;
    books: BookRecommendation[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"recommendations" | "saved">("recommendations");
  const [savedBooks, setSavedBooks] = useState<BookRecommendation[]>([]);
  const [toastMessage, setToastMessage] = useState(""); 
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please describe what you're looking for");
      return;
    }
  
    setError("");
    setIsLoading(true);
    setRecommendations(null);
  
    try {
      const res = await fetchRecommendations(query);
      setRecommendations({
        text: res.recommendations,
        books: res.books
      });
      setToastMessage("✅ Recommendations loaded!");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to get recommendations. Please try again.");
      setToastMessage("❌ Error fetching recommendations");
    } finally {
      setIsLoading(false);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const saveRecommendation = (book: BookRecommendation) => {
    if (savedBooks.some(b => b.title === book.title)) {
      setSavedBooks(savedBooks.filter(b => b.title !== book.title));
      setToastMessage("Removed from saved books");
    } else {
      setSavedBooks([...savedBooks, book]);
      setToastMessage("Book saved to your collection");
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Parse the recommendations text into structured data
  const parseRecommendations = (text: string) => {
    const recommendations = [];
    const pattern = /TITLE:\s*(.+?)\s*DESCRIPTION:\s*(.+?)(?=\nTITLE:|$)/gs;
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      recommendations.push({
        title: match[1].trim(),
        description: match[2].trim(),
      });
    }
    
    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white shadow-lg mb-4">
            <BookOpen className="h-10 w-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            BookNexus AI
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-lg mx-auto">
            Discover your next favorite read with AI-powered recommendations.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === "recommendations"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5" />
                Recommendations
              </div>
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === "saved"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Bookmark className="h-5 w-5" />
                Saved ({savedBooks.length})
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "recommendations" ? (
              <>
                {/* Search Form */}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                      What kind of book are you looking for?
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      </div>
                      <Input
                        id="query"
                        type="text"
                        className="block w-full pl-10 pr-12 py-3 text-base border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                        placeholder="e.g., 'A mystery novel set in Paris'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Button
                          type="submit"
                          size="sm"
                          className="rounded-lg"
                          disabled={isLoading || !query.trim()}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {error}
                      </p>
                    )}
                  </div>
                </form>

                {/* Recommendations */}
                <AnimatePresence>
                  {recommendations && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8"
                    >
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Stars className="h-5 w-5 text-yellow-500" />
                        Your Recommendations
                      </h2>
                      
                      <div className="space-y-6">
                        {parseRecommendations(recommendations.text).map((rec, idx) => {
                          // Find matching book data with thumbnail
                          const bookData = recommendations.books.find(
                            (b) => b.title === rec.title
                          );
                          
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex gap-5">
                                {/* Thumbnail */}
                                <div className="flex-shrink-0">
                                  <img
                                    src={bookData?.thumbnail || "/book-placeholder.jpg"}
                                    alt={rec.title}
                                    className="w-24 h-36 object-cover rounded-lg shadow-sm"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "/book-placeholder.jpg";
                                    }}
                                  />
                                </div>
                                
                                {/* Text content */}
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {rec.title}
                                  </h3>
                                  <p className="text-gray-700 whitespace-pre-line mb-3">
                                    {rec.description}
                                  </p>
                                  <button
                                    onClick={() => saveRecommendation({
                                      title: rec.title,
                                      description: rec.description,
                                      thumbnail: bookData?.thumbnail
                                    })}
                                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                  >
                                    <Heart
                                      className={`h-5 w-5 ${
                                        savedBooks.some(b => b.title === rec.title) 
                                          ? "fill-red-500 text-red-500" 
                                          : ""
                                      }`}
                                    />
                                    <span className="text-sm">
                                      {savedBooks.some(b => b.title === rec.title) 
                                        ? "Saved" 
                                        : "Save to collection"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-indigo-500" />
                  Saved Books
                </h2>
                {savedBooks.length > 0 ? (
                  <div className="space-y-4">
                    {savedBooks.map((book, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-5">
                          {book.thumbnail && (
                            <div className="flex-shrink-0">
                              <img
                                src={book.thumbnail}
                                alt={book.title}
                                className="w-24 h-36 object-cover rounded-lg shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/book-placeholder.jpg";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {book.title}
                            </h3>
                            <p className="text-gray-700 mb-3">
                              {book.description}
                            </p>
                            <button
                              onClick={() => saveRecommendation(book)}
                              className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                            >
                              <Heart className="h-5 w-5 fill-red-500" />
                              <span className="text-sm">Remove</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    <p>No saved books yet.</p>
                    <p className="text-sm mt-1">
                      Search for recommendations and save your favorites!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>© {new Date().getFullYear()} BookNexus AI · Your reading journey starts here.</p>
        </motion.div>
      </div>
    </div>
  );
}