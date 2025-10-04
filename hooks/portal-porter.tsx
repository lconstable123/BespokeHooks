import React, { RefObject, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

export default function PortalPorter({
  ref1,
  ref2,
  trigger,
  children,
  debug = false,
}: {
  ref1: RefObject<HTMLDivElement | null>;
  ref2: RefObject<HTMLDivElement | null>;
  trigger?: boolean;
  children?: React.ReactNode;
  debug?: boolean;
}) {
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(
    ref1?.current
  );
  useEffect(() => {
    setTargetRef(!trigger ? ref1?.current : ref2?.current);
    if (!ref1.current) {
      debug && toast.error("PortalPorter target is not available.");
      return;
    }
    debug && toast.success("PortalPorter mounted");
  }, [trigger]);

  if (targetRef) {
    return createPortal(<div className=" ">{children}</div>, targetRef);
  }
  return (
    <div>
      <p>missing ref</p>
    </div>
  );
}
