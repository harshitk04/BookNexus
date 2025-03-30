"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Bot, Star, Home as HomeIcon, ChevronRight } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-indigo-600" />,
    title: "AI-Powered Recommendations",
    description: "Get personalized book suggestions based on your unique reading preferences",
    gradient: "from-indigo-100 to-purple-100"
  },
  {
    icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
    title: "Vast Collection",
    description: "Access thousands of books across all genres and categories",
    gradient: "from-blue-100 to-indigo-100"
  },
  {
    icon: <Bot className="w-8 h-8 text-indigo-600" />,
    title: "Smart Bookworm Chat",
    description: "Conversational interface that understands your reading needs",
    gradient: "from-purple-100 to-pink-100"
  },
  {
    icon: <Star className="w-8 h-8 text-indigo-600" />,
    title: "Curated Lists",
    description: "Handpicked recommendations from literary experts",
    gradient: "from-pink-100 to-rose-100"
  }
];

const testimonials = [
  {
    quote: "BookNexus helped me discover authors I never would have found on my own. My reading list has never been better!",
    author: "Sarah J.",
    role: "Avid Reader",
    stars: 5
  },
  {
    quote: "The AI recommendations are scarily accurate. It understands my taste better than I do!",
    author: "Michael T.",
    role: "Book Club Organizer",
    stars: 5
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Floating Home Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <Button 
          asChild 
          size="lg" 
          className="rounded-full shadow-xl bg-white hover:bg-gray-50 border border-gray-200 text-indigo-600"
        >
          <Link href="/" className="flex items-center gap-2 px-6 py-5">
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </Link>
        </Button>
      </motion.div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Discover Your Next <br />Favorite Book
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Let our AI bookworm guide you to stories you'll love. Perfect recommendations tailored just for you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                  <Link href="/chatbot" className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Get suggestions from BookNexusAI
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" asChild className="px-8 py-6 text-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50 shadow-sm">
                  <Link href="/books" className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Get to the Home Page
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Animated floating books */}
          <div className="mt-16 relative h-40">
            <motion.div 
              className="absolute left-1/4"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            >
              <BookOpen className="w-16 h-16 text-indigo-400/80" />
            </motion.div>
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2"
              animate={{
                y: [0, -25, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <BookOpen className="w-20 h-20 text-indigo-500" />
            </motion.div>
            <motion.div 
              className="absolute right-1/4"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            >
              <BookOpen className="w-14 h-14 text-purple-400/80" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose BookNexus</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our unique approach to book discovery makes finding your next read effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full p-8 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.gradient} z-0" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="p-4 bg-white rounded-full mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Readers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mb-2">
                        <span className="text-xl font-bold text-indigo-600">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <blockquote className="text-lg text-gray-700 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="mt-4">
                        <p className="text-base font-medium text-indigo-600">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Discover Your Next Read?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join thousands of readers finding their perfect books with BookNexus
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild 
                className="px-8 py-6 text-lg bg-white text-indigo-600 hover:bg-gray-100 shadow-lg"
              >
                <Link href="/books" className="flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Start Your Reading Journey Now
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}