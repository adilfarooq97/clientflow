import type { Message } from "@/types";
import DeleteMessageButton from "@/components/messages/DeleteMessageButton";

type MessageBubbleProps = {
  message: Message;
  isOwn: boolean;
};

export default function MessageBubble({
  message,
  isOwn,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"
        }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${isOwn
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
          }`}
      >
        <p className="text-sm leading-6">
          {message.content}
        </p>

        <p
          className={`mt-1 text-xs ${isOwn ? "text-gray-300" : "text-gray-500"
            }`}
        >
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "UTC",
          }).format(new Date(message.created_at))}
        </p>
        {isOwn && (
          <DeleteMessageButton messageId={message.id} />
        )}
      </div>
    </div>
  );
}