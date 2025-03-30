"use client";

import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, BookOpen, Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating?: number;
}

export default function BooksPage() {
  const router = useRouter(); // Now using the correct router
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const loaderRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = useCallback(async () => {
    if (!hasMore) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/books_cleaned.csv");
      const csvData = await response.text();
      
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const allBooks: Book[] = result.data.map((row: any, index: number) => ({
            id: index + 1,
            title: row.title,
            author: row.author,
            cover: row.thumbnail,
            rating: Math.floor(Math.random() * 3) + 3,
          }));

          const itemsPerPage = 20;
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const newBooks = allBooks.slice(startIndex, endIndex);

          setBooks(prev => [...prev, ...newBooks]);
          setFilteredBooks(prev => [...prev, ...newBooks]);
          setHasMore(endIndex < allBooks.length);
          setIsLoading(false);
          setPage(prev => prev + 1);
        },
      });
    } catch (error) {
      console.error("Error fetching CSV:", error);
      setIsLoading(false);
    }
  }, [page, hasMore]);
  useEffect(() => {
    if (isLoading) return;
    
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadBooks();
      }
    }, options);

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, hasMore, loadBooks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Discover Your Next Read
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Explore our curated collection of books from talented authors worldwide.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => router.push('/chatbot')}
              className="w-full pl-12 pr-4 py-6 text-lg rounded-full shadow-sm hover:bg-indigo-50 border-indigo-200 text-gray-600 justify-start"
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-indigo-500" />
              </div>
              <span className="ml-2">Wanna search something? Ask our chatbot!</span>
            </Button>
          </div>
        </motion.div>

        {/* Rest of your component remains the same */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
                <button 
                className="text-lg w-full h-full"
                onClick={() => router.push(`/books/${book.id}`)}
                >
                    <Card className="h-full flex flex-col overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="relative">
                    <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                        (e.target as HTMLImageElement).src = "/book-placeholder.jpg";
                        }}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center text-sm font-medium">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        {book.rating?.toFixed(1)}
                    </div>
                    </div>
                    <CardHeader className="flex-grow">
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Details
                    </Button>
                    </CardFooter>
                </Card>
                </button>              
            </motion.div>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        )}

        <div ref={loaderRef} className="h-10"></div>
      </div>
    </div>
  );
}