"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Bot, Star, Home as HomeIcon } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-indigo-600" />,
    title: "AI-Powered Recommendations",
    description: "Get personalized book suggestions based on your unique reading preferences"
  },
  {
    icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
    title: "Vast Collection",
    description: "Access thousands of books across all genres and categories"
  },
  {
    icon: <Bot className="w-8 h-8 text-indigo-600" />,
    title: "Smart Bookworm Chat",
    description: "Conversational interface that understands your reading needs"
  },
  {
    icon: <Star className="w-8 h-8 text-indigo-600" />,
    title: "Curated Lists",
    description: "Handpicked recommendations from literary experts"
  }
];

const testimonials = [
  {
    quote: "BookNexus helped me discover authors I never would have found on my own. My reading list has never been better!",
    author: "Sarah J.",
    role: "Avid Reader"
  },
  {
    quote: "The AI recommendations are scarily accurate. It understands my taste better than I do!",
    author: "Michael T.",
    role: "Book Club Organizer"
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
        whileHover={{ scale: 1.1 }}
      >
        <Button asChild size="lg" className="rounded-full shadow-lg">
          <Link href="/" className="flex items-center gap-2">
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
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Discover Your Next <span className="text-indigo-600">Favorite Book</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Let our AI bookworm guide you to stories you'll love. Perfect recommendations tailored just for you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="px-8 py-6 text-lg bg-indigo-600 hover:bg-indigo-700">
                <Link href="/chatbot">
                  <Bot className="mr-2 h-5 w-5" />
                  Start Chatting with BookNexus
                </Link>
              </Button>
              <Button variant="outline" asChild className="px-8 py-6 text-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                <Link href="#features">
                  <Sparkles className="mr-2 h-5 w-5" />
                  How It Works
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Animated book illustration */}
          <motion.div 
            className="mt-16"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BookOpen className="w-24 h-24 mx-auto text-indigo-400" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose BookNexus</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
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
              >
                <Card className="h-full p-8 hover:shadow-lg transition-shadow border-indigo-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-indigo-50 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
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
            <h2 className="text-3xl font-bold text-gray-900">What Readers Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
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
                <Card className="p-8 border-indigo-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 text-yellow-400">
                      <Star className="w-6 h-6 fill-yellow-100" />
                    </div>
                    <div className="ml-4">
                      <blockquote className="text-lg text-gray-700 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="mt-4">
                        <p className="text-base font-medium text-indigo-600">
                          {testimonial.author}
                        </p>
                        <p className="text-base text-gray-500">
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
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Next Read?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of readers finding their perfect books with BookNexus
            </p>
            <Button 
              variant="secondary" 
              asChild 
              className="px-8 py-6 text-lg bg-white text-indigo-600 hover:bg-gray-100"
            >
              <Link href="/chatbot" className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                Start Your Reading Journey Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}