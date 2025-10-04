import { useEffect, useState } from "react";

export function UseFontsLoaded() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document?.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(false);
    }
  }, []);

  return fontsLoaded;
}
