import React from "react";
import { Card } from "@/components/ui/card";

export default function Component() {
  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="typing-animation flex space-x-1">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <style jsx>{`
        .typing-animation {
          display: flex;
          align-items: center;
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: hsl(var(--primary));
          border-radius: 50%;
          opacity: 0;
          animation: typingAnimation 1.4s infinite ease-in-out;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typingAnimation {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-5px);
          }
          100% {
            opacity: 0;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
