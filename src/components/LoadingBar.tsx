import React from "react";

const LoadingBar = () => {
  return (
    <>
      <style>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      <div className="fixed top-0 left-0 w-full h-0.5 z-50 overflow-hidden bg-transparent">
        <div
          className="h-full w-full bg-primary"
          style={{
            animation: "loadingBar 1.2s ease-in-out infinite",
          }}
        />
      </div>
    </>
  );
};

export default LoadingBar;
