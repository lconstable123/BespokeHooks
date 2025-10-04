////////////////////////////

type UseAnimationTriggerOptions = {
  delay?: number;
  fromOpacity?: number;
  fromScale?: number;
  toOpacity?: number;
  toScale?: number;
  handleClose?: () => void;
  debug?: boolean;
  duration?: number;
};

//////////////////////////////

export const useAnimationTrigger = ({
  // -- accepts animation in and out values
  // -- accepts a handleClose to fire on close event for side effects
  // -- animates in on component mount
  // -- animates out on returned AnimateOut handle
  delay = 0,
  fromOpacity = 0,
  fromScale = 0.5,
  toOpacity = 1,
  toScale = 1,
  debug = false,
  duration = 0.4,
  handleClose,
}: UseAnimationTriggerOptions) => {
  const controls = useAnimation();
  //in react strict mode, you need to use ref becuase it mount twice, workaround.
  const animateStateRef = useRef(false);

  const [animateState, setAnimateState] = useState(false);

  const AnimateIn = async () => {
    if (animateStateRef.current) return; // Prevent re-triggering if already animated
    await controls.start({
      opacity: toOpacity,
      scale: toScale,
      transition: {
        type: "tween",
        duration: duration,
        delay,
      },
    });
    animateStateRef.current = true;
    debug && toast.success("Animation triggered successfully");
  };
  const AnimateOut = async () => {
    if (!animateStateRef.current) {
      debug && toast.error("Already closed");
      return;
    }
    await controls.start({
      opacity: fromOpacity,
      scale: fromScale,
      transition: {
        type: "tween",

        duration: duration,
        delay,
      },
    });
    setAnimateState(false);
    animateStateRef.current = false;
    debug && toast.success("Animation reset to initial state");
    handleClose?.();
  };

  useEffect(() => {
    if (animateState) return;
    debug && toast.success("Animation hook initialized");

    AnimateIn();
  }, []);

  return [controls, AnimateOut] as const;
};
