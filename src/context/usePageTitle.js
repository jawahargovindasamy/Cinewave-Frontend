import { useEffect } from "react";

const DEFAULT_TITLE = "Cinewave";

export default function usePageTitle(title) {
  useEffect(() => {
    if (!title) {
      document.title = DEFAULT_TITLE;
      return;
    }

    document.title = `${title} | ${DEFAULT_TITLE}`;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
