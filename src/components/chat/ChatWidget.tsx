"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // MOCK DATA FOR DEMO
  // In real app, these come from context/props
  const DEMO_BRAND_ID = "brand-demo-123";
  const DEMO_USER_ID = "user-demo-456";

  const toggleChat = async () => {
    if (!isOpen) {
      // Opening chat: ensure conversation exists
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": DEMO_USER_ID, // Mock Auth
          },
          body: JSON.stringify({ brandId: DEMO_BRAND_ID }),
        });
        const data = await res.json();
        if (data.id) {
          setConversationId(data.id);
        }
      } catch (e) {
        console.error("Failed to init chat", e);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && conversationId && (
        <ChatWindow
          conversationId={conversationId}
          currentUserId={DEMO_USER_ID} // Mock
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-gray-100 text-gray-600 rotate-90"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
