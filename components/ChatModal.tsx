"use client";

import React, { useEffect, useRef, useState } from "react";
import { api, ChatMessage, ConversationSummary } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPeerId?: string;
  defaultPeerName?: string;
  defaultResourceTitle?: string;
}

export default function ChatModal({
  isOpen,
  onClose,
  defaultPeerId,
  defaultPeerName,
  defaultResourceTitle,
}: ChatModalProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activePeerId, setActivePeerId] = useState<string>("");
  const [activePeerName, setActivePeerName] = useState<string>("");
  const [activeResourceTitle, setActiveResourceTitle] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize peer selection
  useEffect(() => {
    if (defaultPeerId) {
      setActivePeerId(defaultPeerId);
      setActivePeerName(defaultPeerName || "AgriRent Helpdesk");
      setActiveResourceTitle(defaultResourceTitle || "");
    } else if (user) {
      if (user.role === "ROLE_ADMIN") {
        if (conversations.length > 0 && !activePeerId) {
          setActivePeerId(conversations[0].peerId);
          setActivePeerName(conversations[0].peerName);
        }
      } else {
        // Farmers/clients contact the Support Helpdesk by default
        setActivePeerId("admin@agrishare.com");
        setActivePeerName("AgriRent Helpdesk");
        setActiveResourceTitle(defaultResourceTitle || "Equipment & Labour Inquiry");
      }
    }
  }, [defaultPeerId, defaultPeerName, defaultResourceTitle, user, conversations]);

  // Load conversations list
  useEffect(() => {
    if (isOpen && user) {
      api.chat.getConversations().then(setConversations).catch(console.error);
    }
  }, [isOpen, user]);

  // Load messages for active conversation
  useEffect(() => {
    if (isOpen && activePeerId && user) {
      api.chat
        .getConversation(activePeerId)
        .then((data) => {
          setMessages(data);
          scrollToBottom();
        })
        .catch(console.error);
    }
  }, [isOpen, activePeerId, user]);

  // Connect STOMP WebSocket
  useEffect(() => {
    if (!isOpen || !user) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl) as any,
      debug: () => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      // Subscribe to user's personal message topic
      client.subscribe(`/topic/messages/${user.id}`, (message) => {
        try {
          const received: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => {
            if (prev.some((m) => m.id === received.id)) return prev;
            return [...prev, received];
          });
          scrollToBottom();
        } catch (e) {
          console.error("Error parsing incoming message", e);
        }
      });
    };

    client.activate();
    stompClientRef.current = client;

    // Periodic poll fallback for seamless multi-browser synchronization
    const interval = setInterval(() => {
      if (activePeerId) {
        api.chat.getConversation(activePeerId).then((data) => {
          setMessages((prev) => (data.length > prev.length ? data : prev));
        }).catch(() => {});
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (client) client.deactivate();
    };
  }, [isOpen, user, activePeerId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePeerId || isSending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      const saved = await api.chat.sendMessage({
        recipientId: activePeerId,
        resourceTitle: activeResourceTitle,
        content,
      });

      setMessages((prev) => [...prev, saved]);
      scrollToBottom();
    } catch (err) {
      console.error("Send message error", err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-container-lowest w-full max-w-4xl h-[620px] rounded-3xl shadow-2xl border border-surface-container overflow-hidden flex flex-col md:flex-row">
        {/* Left Sidebar: Conversations */}
        <div className="w-full md:w-80 bg-surface-container-low border-r border-surface-container flex flex-col">
          <div className="p-4 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">forum</span>
              <span className="font-headline font-bold text-sm text-on-surface">AgriRent Messages</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" title="Live WebSocket Active"></span>
          </div>

          {/* Direct Contact Preset */}
          {user?.role !== "ROLE_ADMIN" ? (
            <div className="p-3 border-b border-surface-container bg-surface-container/50">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1.5">
                Direct Contact
              </span>
              <button
                onClick={() => {
                  setActivePeerId("admin@agrishare.com");
                  setActivePeerName("AgriRent Helpdesk");
                  setActiveResourceTitle("General Inquiry & Support");
                }}
                className={`p-2 rounded-xl text-left text-xs transition-colors flex items-center gap-2.5 w-full ${
                  activePeerId.includes("admin") ? "bg-primary-container text-white font-bold" : "bg-surface-container-lowest hover:bg-surface-container text-on-surface"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-[16px]">support_agent</span>
                </div>
                <div className="truncate">
                  <div className="font-semibold">AgriRent Helpdesk</div>
                  <div className="text-[10px] opacity-80 truncate">Co-op Desk & Booking Assistance</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="p-3 border-b border-surface-container bg-surface-container/50">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                Farmer Inquiries
              </span>
              <span className="text-[10px] text-on-surface-variant">Messages from registered farmers</span>
            </div>
          )}

          {/* Past Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {conversations.map((c) => {
              const isSelected = activePeerId === c.peerId;
              return (
                <button
                  key={c.peerId}
                  onClick={() => {
                    setActivePeerId(c.peerId);
                    setActivePeerName(c.peerName);
                    setActiveResourceTitle(c.resourceTitle || "");
                  }}
                  className={`p-2.5 rounded-xl text-left transition-colors flex items-start gap-2.5 ${
                    isSelected ? "bg-surface-container-high font-semibold" : "hover:bg-surface-container text-on-surface"
                  }`}
                >
                  <img
                    alt=""
                    src={c.peerAvatar || "/farmer-hero.png"}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold truncate text-on-surface">{c.peerName}</span>
                      {c.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">{c.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Active Message Stream */}
        <div className="flex-1 flex flex-col bg-surface-container-lowest">
          {/* Stream Header */}
          <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-sm">
                {activePeerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface leading-tight">
                  {activePeerName}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span>Online • {activeResourceTitle ? `Regarding: ${activeResourceTitle}` : "Live Agricultural Messenger"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-outline">
                <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2">
                  chat_bubble_outline
                </span>
                <p className="text-sm font-semibold text-on-surface">No messages yet</p>
                <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                  Send a message to discuss availability, field timings, or pricing directly.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.senderId === user?.id || m.senderName === user?.name;
                return (
                  <div
                    key={m.id || Math.random()}
                    className={`flex flex-col max-w-[78%] ${isMine ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMine
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-surface-container text-on-surface rounded-bl-none"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[10px] text-outline mt-1 px-1">
                      {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-surface-container bg-surface-container-low flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${activePeerName}...`}
              className="flex-1 bg-surface-container-lowest px-4 py-2.5 rounded-xl text-xs text-on-surface placeholder:text-outline border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="w-10 h-10 rounded-xl bg-primary text-white hover:bg-primary-container disabled:opacity-50 transition-colors flex items-center justify-center shadow shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
