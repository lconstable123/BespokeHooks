import { RefObject, useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useOptimizedVideoSource } from "./browser-hooks";

import { inView } from "framer-motion";
import { useSkillSetContext } from "../context-providers/skillset-context";
import { useScreenContext } from "../context-providers/screen-context";

export const useNativeVideoPlayer = (
  //-------------------------------------------------------------external states

  isInView: boolean,
  isInEyeline: boolean,
  externalVideoRef: RefObject<HTMLVideoElement | null>,
  setMonitorCurrentTime?: React.Dispatch<React.SetStateAction<number>>,
  monitorCurrentTime: number = 0,
  isModalOpen: boolean = false,
  link: string = "",
  low: string = ""
) => {
  //-------------------------------------------------------------internal states
  const { selectedVideoData } = useSkillSetContext();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isLocallyMuted, setIsLocallyMuted] = useState(false);
  const [isGloballyMuted, setIsGloballyMuted] = useState(false);
  const [IsPaused, setPaused] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [interactedEnough, setInteractedEnough] = useState(false);
  const [isEngaged, setIsEngaged] = useState(false);
  const { selectedSkillSet } = useSkillSetContext();
  // ----------------------------------------------------------- custom hooks
  const { isMobile } = useScreenContext();
  const { selectedSrc, res } = useOptimizedVideoSource(link, low || link);

  //-------------------------------------------------------------functions

  const videoRef = externalVideoRef;

  const playVideo = async (video: HTMLVideoElement) => {
    if (video.readyState >= 2) {
      await video.play().catch((e) => {
        // toast.error("Video playback failed. Please try again.");
      });
    } else {
      const onCanPlay = () => {
        video.removeEventListener("canplay", onCanPlay);
        video.play();
        // .catch(() => toast.error("Playback failed after reparenting."));
      };
      video.addEventListener("canplay", onCanPlay);
    }
  };

  const togglePlay = (playOverride = false) => {
    if (!videoRef.current) {
      toast.error("Video reference is not available.");
      return;
    }
    setMonitorCurrentTime?.(currentTime);
    const video = videoRef.current;
    if (!video) {
      toast.error("Video reference is not available.");
      return;
    }

    const shouldPlay =
      playOverride || (video.paused && isInView && isInEyeline);
    if (shouldPlay) {
      setPaused(false);
      playVideo(video);
      setIsEngaged(true);
    } else {
      setPaused(true);
      video.pause();
    }

    setMonitorCurrentTime?.(currentTime);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLocallyMuted(!isLocallyMuted);
    setIsGloballyMuted(!isGloballyMuted);
  };

  const handleSeekMouseDown = () => setSeeking(true);

  const handleSeekMouseUp = () => {
    if (videoRef.current) {
      setMonitorCurrentTime?.(currentTime);
      videoRef.current.currentTime = currentTime;
    }
    setSeeking(false);
  };

  //--------------------------------- useEffects

  //seeking and time update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (!seeking) setCurrentTime(video.currentTime);
    };

    const updateDuration = () => setDuration(video.duration || 0);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [seeking]);

  // in view (x) and eyeline (y) handling
  // load on idle
  // first load volume logic
  useEffect(() => {
    let watchingTimer: ReturnType<typeof setTimeout>;
    // timer to only load after scroll has settled

    if (videoRef.current) {
      // if out of sight, pause and mute
      if (!isInView || !isInEyeline) {
        setPaused(true);
        videoRef.current.pause();
        setIsLocallyMuted(true);
        setInteractedEnough(false);
        //unload video if not in view
        if (!isInView) {
          videoRef.current.removeAttribute("src");
          videoRef.current.load();
        }
      } else {
        //set timer if in view
        watchingTimer = setTimeout(() => {
          setInteractedEnough(true);
        }, 400);
      }

      if (isInView && isInEyeline && interactedEnough) {
        if (isFirstLoad) {
          // if first load, play video full blast
          setIsLocallyMuted(false);
          setIsFirstLoad(false);
        } else {
          //remember selected muting state regardless of local muting
          setIsLocallyMuted(isGloballyMuted);
        }
        if (!isModalOpen) {
          videoRef.current.src = selectedSrc;
          videoRef.current.load();
        }
      }
    }
    return () => clearTimeout(watchingTimer);
  }, [isInView, isInEyeline, interactedEnough]);

  useEffect(() => {
    // toast.success(`Selected skill set changed to ${selectedSkillSet}`);
    if (videoRef.current) {
      // setIsLocallyMuted(false);
      // setIsFirstLoad(false);
      // videoRef.current.src = selectedSrc;
    }
  }, [selectedSkillSet]);

  // mute handling
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isLocallyMuted;
    }
  }, [isLocallyMuted]);

  // add video buffer on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      // toast.success(`Video ${video.src} loaded.`);
      if (!isModalOpen) {
        video.src = "";
      }
    }
    video.currentTime = monitorCurrentTime;

    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        const end = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        setBuffered(end / duration);
      }
    };
    video.addEventListener("progress", updateBuffered);
    return () => {
      video.removeEventListener("progress", updateBuffered);
    };
  }, []);

  // handle lightbox open with delay
  useEffect(() => {
    if (videoRef.current && isModalOpen) {
      const timeout = setTimeout(() => {
        // videoRef.current?.load();
        videoRef.current!.currentTime = monitorCurrentTime;
        togglePlay(true);
        videoRef.current?.play();
      }, 20); // small delay to allow DOM to settle
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen]);

  return {
    videoRef,
    toggleMute,
    isLocallyMuted,
    togglePlay,
    duration,
    currentTime,
    setCurrentTime,
    seeking,
    handleSeekMouseDown,
    handleSeekMouseUp,
    IsPaused,
    buffered,
    interactedEnough,
    isMobile,
    selectedSrc,
    res,
    isEngaged,
  };
};
