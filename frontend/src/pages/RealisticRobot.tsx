import React from "react";
import Lottie from "lottie-react";
import robotAnimation from "../robot.json";

export default function RealisticRobot() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Title Over Robot */}
    

      {/* Robot Animation */}
      <div className="w-64 h-64 mx-auto">
        <Lottie animationData={robotAnimation} loop={true} autoplay={true} />
      </div>

      {/* Floating Code Lines */}
     

      <style jsx>{`
        @keyframes codeFlow {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .glow {
          text-shadow: 0 0 10px #00ff88;
        }
      `}</style>
    </div>
  );
}