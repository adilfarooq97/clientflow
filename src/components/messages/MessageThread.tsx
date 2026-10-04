"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Message } from "@/types";
import MessageBubble from "@/components/messages/MessageBubble";
import MessageComposer from "@/components/messages/MessageComposer";

type MessageThreadProps = {
  projectId: string;
  currentUserId: string;
  initialMessages: Message[];
  canSend?: boolean;
};

export default function MessageThread({
  projectId,
  currentUserId,
  initialMessages,
  canSend= true,
}: MessageThreadProps) {
  const [messages, setMessages] =
    useState<Message[]>(initialMessages);
    const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`project-messages-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;

          setMessages((currentMessages) => {
            const alreadyExists = currentMessages.some(
              (message) => message.id === newMessage.id
            );

            if (alreadyExists) {
              return currentMessages;
            }

            return [...currentMessages, newMessage];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          setMessages((currentMessages) =>
            currentMessages.filter(
              (message) => message.id !== payload.old.id
            )
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [projectId]);
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  return (
    <>
      <div className="min-h-96 space-y-4 p-6">
        {messages.length === 0 ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <p className="font-medium text-gray-900">
                No messages yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Start the conversation with your client.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-6">
       {canSend && ( <MessageComposer projectId={projectId} /> )}
      </div>
    </>
  );
}