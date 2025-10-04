"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  currentCategory: string;
};

export default function usePrioritizedMultiImageLoader({
  Primaryurls,
  SecondaryUrls,
}: {
  Primaryurls: string[];
  SecondaryUrls: string[];
}) {
  const [primaryImagesLoaded, setPrimaryImagesLoaded] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  // Preload images and optionally wait until all are loaded
  const preloadImages = (imageUrls: string[]) => {
    let loadedCount = 0;
    const total = imageUrls.length;

    if (total === 0) {
      if (primaryImagesLoaded) {
        setAllImagesLoaded(true);
      } else {
        setPrimaryImagesLoaded(true);
      }
      return;
    }

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === total) {
          if (primaryImagesLoaded) {
            // toast.success("secondary images loaded");
            setAllImagesLoaded(true);
          } else {
            setPrimaryImagesLoaded(true);
            // toast.success("primary images loaded");
          }
        }
      };
      img.onerror = () => {
        loadedCount++; // Still count errors as "loaded" to avoid hanging
        if (loadedCount === total) {
          setAllImagesLoaded(true);
        }
      };
    });
  };

  useEffect(() => {
    preloadImages(Primaryurls);
  }, [Primaryurls]);

  useEffect(() => {
    if (primaryImagesLoaded) {
      preloadImages(SecondaryUrls);
    }
  }, [primaryImagesLoaded]);

  return allImagesLoaded;
}

//------------------------------------------------------Single Image Loader

export const useSingleImageLoader = (url: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
  }, [url]);
  return imageLoaded;
};

export function useMultipleImageLoader(urlArray: (string | null)[]) {
  const [firstTime, setFirstTime] = useState(true);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const preloadImages = useCallback((imageUrls: (string | null)[]) => {
    let loadedCount = 0;
    const total = imageUrls?.length || 0;
    let cancelled = false;

    if (total === 0) {
      setAllImagesLoaded(true);
      return;
    }

    setAllImagesLoaded(false);

    imageUrls?.forEach((url) => {
      const img = new Image();
      if (url) {
        img.src = url;
      }

      const onDone = () => {
        if (cancelled) return;
        loadedCount++;
        if (loadedCount === total) {
          setAllImagesLoaded(true);
        }
      };

      img.onload = onDone;
      img.onerror = onDone;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (firstTime) {
      preloadImages(urlArray);
      setFirstTime(false);
    }
  }, [urlArray, preloadImages]);

  return allImagesLoaded;
}
