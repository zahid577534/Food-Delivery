import React, { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: "bg-green-600",
      icon: <FaCheckCircle />,
    },
    error: {
      bg: "bg-red-600",
      icon: <FaTimesCircle />,
    },
    info: {
      bg: "bg-blue-600",
      icon: <FaInfoCircle />,
    },
  };

  const current = styles[type] || styles.success;

  return (
    <div className="fixed top-24 right-5 z-[9999] animate-[slideIn_0.3s_ease-out]">
      <div
        className={`${current.bg} text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 min-w-[280px] max-w-[380px]`}
      >
        <span className="text-xl">
          {current.icon}
        </span>

        <span className="font-medium flex-1">
          {message}
        </span>

        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;