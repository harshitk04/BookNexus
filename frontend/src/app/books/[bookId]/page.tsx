"use client";

import { notFound } from 'next/navigation';
import { BookOpen, Star, Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { getBookById } from '@/lib/book';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating?: number;
  genres?: string[];
}

interface SimilarBook {
  title: string;
  author: string;
  cover: string;
  thumbnail: string;
  description: string;
  rating?: number;
}

export default function BookDetailsPage({ params }: { params: { bookId: string } }) {
    const router = useRouter(); // Now using the correct router
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enhancedDesc, setEnhancedDesc] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [similarBooks, setSimilarBooks] = useState<SimilarBook[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  const handleEnhanceDescription = async () => {
    if (!book) return;
    
    setIsEnhancing(true);
    setShowEnhanced(true);
    try {
      const response = await fetch('http://localhost:8000/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: book.description
        }),
      });
      
      const data = await response.json();
      setEnhancedDesc(data.enhanced);
    } catch (error) {
      console.error('Error enhancing description:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const fetchSimilarBooks = async (bookDescription: string) => {
    setIsLoadingSimilar(true);
    try {
      const response = await fetch(`http://localhost:8000/recommendation_on_bookid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: bookDescription,
          top_k: 4 
        }),
      });
      
      const data = await response.json();
      setSimilarBooks(data.recommendations);
    } catch (error) {
      console.error('Error fetching similar books:', error);
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getBookById(params.bookId);
        if (!bookData) {
          return notFound();
        }
        setBook(bookData);
        fetchSimilarBooks(bookData.description);
      } catch (error) {
        console.error('Error loading book:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [params.bookId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to books
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-lg">
          {/* Book Cover */}
          <div className="flex justify-center">
            <div className="w-64 h-96 relative rounded-xl shadow-2xl overflow-hidden border-4 border-white hover:border-indigo-100 transition-all duration-300">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/book-placeholder.jpg";
                }}
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600">{book.author}</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < (book.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-500">
                {book.rating?.toFixed(1)} rating
              </span>
            </div>

            {/* Genres */}
            {book.genres && (
              <div className="flex flex-wrap gap-2 pt-2">
                {book.genres.map(genre => (
                  <span 
                    key={genre} 
                    className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Description</h2>
                {enhancedDesc && showEnhanced && (
                  <span className="flex items-center text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full">
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Enhanced
                  </span>
                )}
              </div>

              {showEnhanced && enhancedDesc ? (
                <div className="relative">
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-sm">
                    <p className="text-gray-700 leading-relaxed italic">
                      {enhancedDesc}
                    </p>
                    <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-2 shadow-md">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEnhanced(false)}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Show original description
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {book.description}
                  </p>
                  <button
                    onClick={handleEnhanceDescription}
                    disabled={isEnhancing}
                    className="relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      {isEnhancing ? 'Crafting your enhanced description...' : 'Enhance with BookNexusAI'}
                    </span>
                    <span className="absolute -inset-1 bg-indigo-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Similar Books
            </span>
          </h2>
          
          {isLoadingSimilar ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : similarBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarBooks.map((book, index) => (
                <div key={index} className="group">
                  <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/book-placeholder.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div>
                        <p className="text-white font-medium">{book.title}</p>
                        <p className="text-gray-300 text-sm">{book.author}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    {book.rating && (
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < (book.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">
                          {book.rating?.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
          ) : (
            <p className="text-gray-500">No similar books found</p>
          )}
        </div>
      </div>
    </div>
  );
}