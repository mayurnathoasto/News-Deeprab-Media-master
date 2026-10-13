"use client";
import { useEffect, useState } from "react";
import { notificationRequestSelector, setPermissionRequest } from "../store/reducers/CheckPermissionsReducer";
import { translate } from "@/utils/translation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const NotificationPrompt = () => {

  const notificationPermission = useSelector(notificationRequestSelector);

  const [show, setShow] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      if (
        typeof Notification !== 'undefined' &&
        Notification.permission !== "granted" && notificationPermission !== "rejected") {
        setShow(true);
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const openPrompt = () => setShow(true)
    window.addEventListener('iq:open-notification-prompt', openPrompt)
    return () => window.removeEventListener('iq:open-notification-prompt', openPrompt)
  }, [])

  const handleAllow = async () => {
    try {
      if (typeof Notification === 'undefined') {
        toast.error('Notifications are not supported in this browser.')
        setShow(false)
        return
      }
      const permissionRes = await Notification.requestPermission();
      // console.log("permissionRes", permissionRes)
      setPermissionRequest({ requestRes: permissionRes })
      setShow(false);
    } catch (error) {
      console.error("Permission error:", error);
    }
  };

  const handleLater = () => {
    setPermissionRequest({ requestRes: "rejected" })
    setShow(false);
    toast(translate('notificationBlocked'), {
      icon: '!',
      position: 'top-left',
    });
  };

  if (!show) return null;

  return (
    <div className="iq-notification-overlay fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]" onMouseDown={() => setShow(false)}>

      <div className="iq-notification-dialog fixed top-6 left-6 shadow-xl rounded-xl p-4 w-[min(340px,calc(100vw-48px))] z-[101]" onMouseDown={(event) => event.stopPropagation()}>
        <h4 className="font-semibold mb-2">{translate('dontMissUpdate')}</h4>
        <p className="text-sm mb-3 font-medium">
          {translate('allNotification')}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAllow}
            className="primaryBg text-white px-3 py-2 rounded-md font-semibold"
          >
            {translate('enableNotifications')}
          </button>
          <button
            onClick={handleLater}
            className="iq-notification-later border px-3 py-2 rounded-md"
          >
            {translate('maybeLater')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
