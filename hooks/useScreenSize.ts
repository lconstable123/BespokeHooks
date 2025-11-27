import { useEffect, useState } from "react";
import toast from "react-hot-toast";

let subscribers: ((width: number, height: number) => void)[] = [];

function notifySubscribers(width: number, height: number) {
  subscribers.forEach((fn) => fn(width, height));
}

if (typeof window !== "undefined") {
  window.addEventListener("resize", () => {
    notifySubscribers(window.innerWidth, window.innerHeight);
  });
}

export function useScreenSizeShared(
  small: number,
  medium: number,
  large: number
) {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : medium,
    height: typeof window !== "undefined" ? window.innerHeight : medium,
  });

  useEffect(() => {
    const subscriber = (width: number, height: number) => {
      setSize({ width, height });
    };
    subscribers.push(subscriber);

    // cleanup
    return () => {
      subscribers = subscribers.filter((s) => s !== subscriber);
    };
  }, []);

  const calculateWidth = (width: number) => {
    if (width < small) return "small";
    if (width < medium) return "medium";
    if (width < large) return "large";
    return "extra-large";
  };

  return calculateWidth(size.width);
}
