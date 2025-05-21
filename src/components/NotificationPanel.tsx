import React from "react";
import { Bell } from "lucide-react";
import type { Notification } from "../types";

interface NotificationPanelProps {
  notifications: Notification[];
}

export function NotificationPanel({ notifications }: NotificationPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
        <div className="w-8 h-8 text-white rounded-lg bg-red-500/20 flex items-center justify-center shadow-lg">
          <Bell className="w-4 h-4 text-red-500" />
        </div>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg ${
              notification.read ? "bg-gray-50" : "bg-indigo-50"
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-gray-900">
                {notification.title}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(notification.date).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
