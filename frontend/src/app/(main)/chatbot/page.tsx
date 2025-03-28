"use client";

import ChatInterface from "@/components/ChatInterface";
import Navbar from "@/components/Navbar";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <ChatInterface />
    </div>
  );
}
