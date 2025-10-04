# Useful VirtuallyAnything Hooks Repo

I'm collating a library of useful functions and hooks.

---

## Table of Contents

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

Continuing on the last subject, i've created some utility hooks that make sure images are loaded encountering them, nobody likes that 90's style shudder load. The hooks work great in tandem with a terniary operator and a fallback skeleton component, or loading widget. But the grwat thing is it never even needs to get to that, becuase the images can be flagged to be loaded well before we encounter them. I found this a weaknes with React's `<Image />` component, with it's lazy and urgent props. This is a direct replacment- just using an `<img />` component wrapped in a ternary operator.

- **useSingleImageLoader**: Works with a single URL string and provides an `isLoaded` boolean.

- **useMultipleImageLoader**: Batch-loads an array of URLs and provides an `isLoaded` boolean.

- **usePrioritizedMultiImageLoader**: Loads one array first (high-priority images like background or bio pic), then moves to the second array.

> These work well with a ternary operator and a fallback skeleton component, but TBH the idea is to allow images to preloaded well before they are needed.

---

## usePageTransition

It's easy enough to trigger an animation in when a component is mounted, it's there, it's available. But what is harder is having and animation out when a component dismounts, espcially when a page is changed. The compoent is literlaly gone. This hook recifies that and creates a smooth transition between pages and compoents. > A replacement for React's `Nav` component, but better.

### Inputs

- `handlePageTransition`: transition duration and dissipation path
- Reference to the React Router instance

### Outputs

- Framer Motion animation controller for opacity
- `handlePageTransition` function

---

## useAnimationTrigger

A utility to trigger Framer Motion animations safely, preventing retriggers, no double anaimtions.

---

## useOptimisedVideoSource

This is a key component in my bespoke video player. It checks device and bandwidth and serves approporiate media. Simple and effective.

### Inputs

- URL of a high-quality video/image
- URL of a low-quality video/image

### Outputs

- Returns the optimal URL based on device and network

---

## useDoubleIntersectionObserver

I liked the effect of triggering a componetwhen it scrolls into view, from a motion design perspective and from a peformance perspective. I just made it double, adding a second threshold so that the aniamtion has a in-view trigger, and then a in-center trigger for a secondary effect.

- **In-view trigger**
- **Center-of-view trigger** for secondary effects

---

## portal-porter

I ran into limiations of the `**<usePortal>**` component when I wanted have a video lightbox that expands an existing video reference and places it somewhere else. The portal takes the return jsx and portals it to _one place_, the flagged portal id. I need the portal postion to _change dynamically_ This was the birth of the **portal porter**.

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
