"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Notification } from "@/lib/supabase/notifications";

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

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch(
          "/api/notifications"
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (error) {
        console.error(
          "Error loading notifications:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const markAsRead = async (
    notificationId: string
  ) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
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
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.is_read
    );

    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          fetch(`/api/notifications/${notification.id}`, {
            method: "PATCH",
          })
        )
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Error marking all notifications as read:",
        error
      );
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
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
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
            {isLoading ? (
              <p className="p-4 text-sm text-gray-500">
                Loading notifications...
              </p>
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