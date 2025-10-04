"use client";
import { useAnimation } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useTransition } from "react";

export default function usePageTransition(
  // provide a next/navigation router instance
  router: AppRouterInstance
) {
  //temporary store of destination url

  //transition state  of navigation
  const [pageChangeTransition, startPageChangeTransition] = useTransition();

  // output handle for animation;
  const pageAnimControls = useAnimation();

  //main input handle, set destination page and duration.
  const handlePageTransition = async (destination: string, duration = 0.1) => {
    // toast.success("moving to new page...");

    await pageAnimControls.start({
      opacity: 0,
      transition: { duration: duration },
    });
    startPageChangeTransition(() => {
      //   toast.success("moving to " + destination);
      router.push(destination || "/");
    });
  };

  // soft animation back in when page has changed
  const handleAnimateOut = async () => {
    await pageAnimControls.start({
      opacity: 1,
      transition: { duration: 0.1 },
    });
    pageAnimControls.set({
      opacity: 1,
    });
  };

  // listen for page change transition complete to trigger animate back in
  useEffect(() => {
    if (!pageChangeTransition) {
      //   toast.success("moved!");
      handleAnimateOut();
    }
  }, [pageChangeTransition]);

  return { pageAnimControls, handlePageTransition };
}
