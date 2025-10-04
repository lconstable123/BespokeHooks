"use client";

import { useEffect, useRef, useState } from "react";

import { SectionNameType } from "../utils/types";
import toast, { Toast } from "react-hot-toast";
import { useActiveSection } from "../context-providers/active-section-context";

export const useDoubleIntersectionObserver = (
  threshold1: number,
  threshold2: number,
  SectionName: SectionNameType,
  isMobileLandscape: boolean
) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const reactiveThreshold1 = isMobileLandscape ? threshold1 / 2 : threshold1;
  const reactiveThreshold2 = isMobileLandscape ? threshold2 / 2 : threshold2;

  const { activeSection, setActiveSection, timeOfLastClick } =
    useActiveSection();

  const [isInViewShort, setIsInViewShort] = useState(false);
  const [isInViewDeep, setIsInViewDeep] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Observer A – low threshold
    const observerA = new IntersectionObserver(
      ([entry]) => {
        setIsInViewShort(entry.isIntersecting);
        // toast.success(`Short view: ${entry.intersectionRatio}`);
      },
      {
        threshold: reactiveThreshold1,
        rootMargin: "0px",
      }
    );

    // Observer B – higher threshold (deeper visibility)
    const observerB = new IntersectionObserver(
      ([entry]) => {
        setIsInViewDeep(entry.isIntersecting);
      },
      {
        threshold: reactiveThreshold2,
        rootMargin: "0px",
      }
    );

    observerA.observe(element);
    observerB.observe(element);

    return () => {
      observerA.disconnect();
      observerB.disconnect();
    };
  }, [reactiveThreshold1, reactiveThreshold2]);

  useEffect(() => {
    if (isInViewDeep && Date.now() - timeOfLastClick > 1000) {
      setActiveSection((prev) => {
        if (prev === SectionName) {
          return prev; // No change if already active
        }
        return SectionName;
      });
    }
  }, [isInViewDeep, setActiveSection, timeOfLastClick]);

  return { ref, isInViewDeep, isInViewShort };
};
