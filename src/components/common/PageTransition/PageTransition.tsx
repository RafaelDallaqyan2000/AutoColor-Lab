import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<"fadeIn" | "fadeOut">(
    "fadeIn"
  );

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
    }
  }, [location.pathname, displayLocation.pathname]);

  const onTransitionEnd = () => {
    if (transitionStage === "fadeOut") {
      setDisplayLocation(location);
      setTransitionStage("fadeIn");
    }
  };

  return (
    <div
      key={displayLocation.pathname}
      className={`page-transition page-transition-${transitionStage}`}
      onAnimationEnd={onTransitionEnd}
    >
      {children}
    </div>
  );
};

export default PageTransition;

