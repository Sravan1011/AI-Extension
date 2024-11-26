import React from "react";

const Notification = ({ message, type = "info", onClose }) => {
  const bgColor =
    type === "error"
      ? "bg-red-50 border-red-500"
      : type === "success"
      ? "bg-green-50 border-green-500"
      : "bg-blue-50 border-blue-500";

  const textColor =
    type === "error"
      ? "text-red-700"
      : type === "success"
      ? "text-green-700"
      : "text-blue-700";

  const icon =
    type === "error" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-1.414 1.414L12 12l-4.95 4.95-1.414-1.414L12 12l4.95-4.95 1.414-1.414z"
        />
      </svg>
    ) : type === "success" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h1m0-4h-.01"
        />
      </svg>
    );

  return (
    <div
      className={`fixed top-6 right-6 max-w-sm w-full p-4 rounded-lg shadow-lg border-l-4 ${bgColor} ${textColor} transform transition-all ease-in-out duration-300 animate-slide-in`}
    >
      <div className="flex items-start">
        <div className="mr-3 flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
