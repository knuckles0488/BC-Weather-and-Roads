import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell } from './Icons.tsx';

interface NotificationToastProps {
  message: string;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-[100] transition-all duration-300 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="bg-red-600 text-white rounded-2xl shadow-xl p-4 flex gap-4 items-start border border-red-500 shadow-red-200">
        <div className="bg-white/20 p-2 rounded-xl">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-sm flex items-center gap-1 uppercase tracking-tight">
              <Bell className="w-4 h-4" /> Road Alert
            </span>
            <button onClick={() => setVisible(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          <p className="text-sm font-medium leading-snug">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;