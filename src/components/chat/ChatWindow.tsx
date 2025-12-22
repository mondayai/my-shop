"use client";

import { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import { Send, Store } from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderType: "USER" | "BRAND";
  createdAt: string;
}

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string; // To identify 'me' vs 'other' visually
  onClose?: () => void;
}

export default function ChatWindow({
  conversationId,
  currentUserId,
  onClose,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Custom fetcher with auth
  const fetcher = (url: string) =>
    fetch(url, {
      headers: { "x-user-id": currentUserId },
    }).then((res) => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    });

  // Polling with SWR
  const { data: messages, mutate } = useSWR<Message[]>(
    conversationId ? `/api/conversations/${conversationId}/messages` : null,
    fetcher,
    {
      refreshInterval: 3000, // Poll every 3 seconds
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      // Simple auto-scroll for MVP.
      // Improvement: Check if user is near bottom before scrolling to avoid disrupting reading.
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage(""); // Clear input immediately

    // Optimistic Update
    const optimisticMessage: Message = {
      id: "temp-" + Date.now(),
      content,
      senderType: "USER", // Assuming we are the USER for now, or pass prop
      createdAt: new Date().toISOString(),
    };

    // Mutate SWR cache locally
    mutate(
      (currentMessages) => [...(currentMessages || []), optimisticMessage],
      false // Do not revalidate immediately, wait for post
    );

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId, // Security note: This should be handled by cookie/session in real app
          "x-sender-type": "USER",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send");

      // Trigger revalidation to get real ID and server timestamp
      mutate();
    } catch (error) {
      console.error("Send failed", error);
      // Rollback logic could go here, or show error state
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Brand Store</h3>
            <p className="text-xs text-GREEN-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            Close
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]"
        ref={scrollRef}
      >
        {!messages ? (
          <div className="flex justify-center py-10 text-gray-400">
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <p>No messages yet.</p>
            <p>Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderType === "USER"; // Simplification for MVP
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[10px] mt-1 opacity-70 ${
                      isMe ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-100"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
