# Useful VirtuallyAnything Hooks Repo

I'm collating a library of useful functions and hooks.

---

## Table of Contents

**These ones are designed by me:**

- `useFontsLoaded`
- `useImageLoader`
- `usePageTransition`
- `useAnimationTrigger`
- `useOptimisedVideoSource`
- `useDoubleIntersectionObserver`
- `portal-porter.tsx`
- `useNativeVideoPlayer`
- `video Encoder` (bash script)

---

## useFontsLoaded

FOUT (Flash of Unrendered Text) is a pet peeve of mine; it ruins the first moment of the user journey. First impressions count! This hook ensures that **all fonts are loaded before doing anything**.

---

## useImageLoader

These hooks make sure images are loaded before they are displayed—no more 90's style shudder load.

- **useSingleImageLoader**: Works with a single URL string and provides an `isLoaded` boolean.
- **useMultipleImageLoader**: Batch-loads an array of URLs and provides an `isLoaded` boolean.
- **usePrioritizedMultiImageLoader**: Loads one array first (high-priority images like background or bio pic), then moves to the second array.

> Tip: These work well with a ternary operator and a fallback skeleton component, but often the images are preloaded before they are needed.

---

## usePageTransition

This hook handles smooth page/component transitions, including **exit animations** when components unmount. A replacement for React's `Nav` component, but better.

### Inputs

- `handlePageTransition`: transition duration and dissipation path
- Reference to the React Router instance

### Outputs

- Framer Motion animation controller for opacity
- `handlePageTransition` function

---

## useAnimationTrigger

A utility to trigger Framer Motion animations safely, preventing retriggers.

---

## useOptimisedVideoSource

Serves appropriate media based on device and bandwidth.

### Inputs

- URL of a high-quality video/image
- URL of a low-quality video/image

### Outputs

- Returns the optimal URL based on device and network

---

## useDoubleIntersectionObserver

Enhances scroll-triggered animations with two thresholds:

- **In-view trigger**
- **Center-of-view trigger** for secondary effects

---

## portal-porter

A dynamic portal solution. Unlike `usePortal`, this can teleport a component to **multiple DOM nodes dynamically**.

### Inputs

- `useRef` of the source component (e.g., video frame)
- `useRef` of the target component (e.g., lightbox modal)
- Children (React element to teleport)
- `trigger` boolean
- `debug` boolean (optional, shows toast)

### Outputs

- React element rendered in multiple DOM nodes

---

## useNativeVideoPlayer

A custom streaming video solution (no Vimdeo needed). Includes buffering visualization and common controls.

### Utility Functions

- `shuffleArray`
- `openNewWindow`
- `getErrorMessage`
- `validateString`

---

## Video Encoder (Bash Script)

A handy script to reduce video size (_courtesy of GPT_):

```bash
mkdir output
for %F in (*.mp4) do (
    ffmpeg -i "%F" -c:v libx264 -vf "scale=iw*0.5:ih*0.5" -profile:v high -level 4.0 -preset veryfast -crf 23 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "output\%~nF.mp4"
)
```
