"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Notification } from "@/lib/supabase/notifications";
import Alert from "@/components/ui/Alert";

async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch("/api/notifications");

  if (!response.ok) {
    throw new Error("Unable to load notifications.");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid notifications response.");
  }

  return data;
}

function formatNotificationTime(
  createdAt: string
) {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const difference = Math.max(
    0,
    now - createdTime
  );

  const minutes = Math.floor(
    difference / (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(createdAt).toLocaleDateString();
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchNotifications()
      .then((data) => {
        if (isMounted) {
          setNotifications(data);
          setLoadError("");
        }
      })
      .catch((error) => {
        console.error("Error loading notifications:", error);
        if (isMounted) {
          setLoadError("Unable to load notifications. Please try again.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const retryLoadingNotifications = () => {
    setIsLoading(true);
    setLoadError("");

    fetchNotifications()
      .then((data) => {
        setNotifications(data);
        setLoadError("");
      })
      .catch((error) => {
        console.error("Error loading notifications:", error);
        setLoadError("Unable to load notifications. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const markAsRead = async (
    notificationId: string
  ) => {
    setActionError("");

    try {
      const response = await fetch(
        `/api/notifications/${notificationId}`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        setActionError("Unable to update notification. Please try again.");
        return;
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error
      );
      setActionError("Unable to update notification. Please try again.");
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.is_read
    );

    if (unreadNotifications.length === 0) {
      return;
    }

    setActionError("");

    try {
      const responses = await Promise.all(
        unreadNotifications.map((notification) =>
          fetch(`/api/notifications/${notification.id}`, {
            method: "PATCH",
          })
        )
      );

      const updatedIds = new Set(
        unreadNotifications
          .filter((_, index) => responses[index].ok)
          .map((notification) => notification.id)
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: notification.is_read || updatedIds.has(notification.id),
        }))
      );

      if (updatedIds.size !== unreadNotifications.length) {
        setActionError(
          "Some notifications could not be updated. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Error marking all notifications as read:",
        error
      );
      setActionError("Unable to update notifications. Please try again.");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={`Notifications${unreadCount > 0
          ? `, ${unreadCount} unread`
          : ""
          }`}
        aria-expanded={isOpen}
        aria-controls="notification-panel"
        className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <span aria-hidden="true">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="notification-panel"
          className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Notifications
            </h2>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-gray-600 transition hover:text-gray-900"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {actionError && (
              <Alert tone="danger" className="m-3">
                {actionError}
              </Alert>
            )}

            {isLoading ? (
              <p className="p-4 text-sm text-gray-500">
                Loading notifications...
              </p>
            ) : loadError ? (
              <div className="p-4">
                <p className="text-sm text-danger" role="alert">
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={retryLoadingNotifications}
                  className="mt-2 text-sm font-medium text-foreground underline underline-offset-4"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                You have no notifications.
              </p>
            ) : (
              notifications.slice(0, 10).map(
                (notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-gray-100 px-4 py-3 last:border-b-0 ${notification.is_read
                      ? "bg-white"
                      : "bg-gray-50"
                      }`}
                  >
                    {notification.project_id ? (
                      <Link
                        href={`/projects/${notification.project_id}`}
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="block"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>

                        {notification.message && (
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {notification.message}
                          </p>
                        )}

                        <p className="mt-1 text-[11px] text-gray-400">
                          {formatNotificationTime(notification.created_at)}
                        </p>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="block w-full text-left"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>

                        {notification.message && (
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {notification.message}
                          </p>
                        )}
                        <p className="mt-1 text-[11px] text-gray-400">
                          {formatNotificationTime(notification.created_at)}
                        </p>
                      </button>
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}