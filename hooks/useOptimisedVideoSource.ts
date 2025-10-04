import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useOptimizedVideoSource(highSrc: string, lowSrc: string) {
  const [selectedSrc, setSelectedSrc] = useState(highSrc);
  const [res, setRes] = useState("high");
  useEffect(() => {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isSlowConnection =
      connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g" ||
      connection?.saveData;

    if (isMobile || isSlowConnection) {
      setRes("low");
      setSelectedSrc(lowSrc);
    }
    // toast.success(`Video source changed to ${highSrc} quality`);
  }, [highSrc, lowSrc]);

  return { selectedSrc, res };
}
