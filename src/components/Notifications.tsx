import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { getNotifications, saveNotifications, getComponents } from '../utils/storage';
import { Notification } from '../types';
import { subMonths } from 'date-fns';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    checkAndGenerateNotifications();
  }, []);

  const checkAndGenerateNotifications = () => {
    const components = getComponents();
    const existingNotifications = getNotifications();
    const newNotifications: Notification[] = [];
    const now = new Date();
    const threeMonthsAgo = subMonths(now, 3);

    // Check for low stock
    components.forEach(component => {
      if (component.quantity <= component.criticalLowThreshold) {
        const exists = existingNotifications.some(n => 
          n.type === 'low_stock' && n.componentId === component.id
        );
        
        if (!exists) {
          newNotifications.push({
            id: `low_stock_${component.id}_${Date.now()}`,
            type: 'low_stock',
            componentId: component.id,
            componentName: component.name,
            message: `${component.name} is running low (${component.quantity} units remaining, threshold: ${component.criticalLowThreshold})`,
            timestamp: now.toISOString(),
            read: false
          });
        }
      }
    });

    // Check for old stock
    components.forEach(component => {
      const lastActivity = component.lastOutwardDate 
        ? new Date(component.lastOutwardDate)
        : new Date(component.createdAt);

      if (lastActivity < threeMonthsAgo) {
        const exists = existingNotifications.some(n => 
          n.type === 'old_stock' && n.componentId === component.id
        );

        if (!exists) {
          newNotifications.push({
            id: `old_stock_${component.id}_${Date.now()}`,
            type: 'old_stock',
            componentId: component.id,
            componentName: component.name,
            message: `${component.name} has been in inventory for over 3 months without movement`,
            timestamp: now.toISOString(),
            read: false
          });
        }
      }
    });

    const allNotifications = [...existingNotifications, ...newNotifications];
    setNotifications(allNotifications);
    if (newNotifications.length > 0) {
      saveNotifications(allNotifications);
    }
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'old_stock':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'border-l-red-500 bg-red-50';
      case 'old_stock':
        return 'border-l-amber-500 bg-amber-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-600">
            Stay informed about your inventory status
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'low_stock').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-amber-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Old Stock Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'old_stock').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow rounded-lg">
        {sortedNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 border-l-4 transition-all hover:bg-gray-50 ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'bg-opacity-100' : 'bg-opacity-30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.componentName}
                        </h3>
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className={`mt-1 text-sm ${
                        !notification.read ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-gray-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;