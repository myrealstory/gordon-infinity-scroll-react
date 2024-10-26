"use client";

import { useState, useEffect, useRef } from "react";

type WindowSizeProps = {
  width: number;
  height: number;
  scrollY: number;
  isWindowReady: boolean;
  // isAppear: boolean;
};
// type FunctionArgs = any[];
// type DebouncedFunction = (...args: FunctionArgs) => void;

export const useWindowSize = () => {
  // const path = usePathname();

  const [windowSize, setWindowSize] = useState<WindowSizeProps>({
    width: 0,
    height: 0,
    scrollY: 0,
    isWindowReady: false,
    // isAppear: isForceHiddenPage ? false : true,
  });
  const lastScrollLocation = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    const handleScroll = () => {

      if (lastScrollLocation.current >= window.scrollY || window.scrollY <= 0) {  // scrolling up keep display
        setWindowSize((prevWindowSize) => ({
          ...prevWindowSize,
          scrollY: window.scrollY,
          // isAppear: isForceHiddenPage ? false : true,
        }));
      } else {
        setWindowSize((prevWindowSize) => ({  // scrolling down hidd
          ...prevWindowSize,
          scrollY: window.scrollY,
          isAppear: false,
        }));
      }
      lastScrollLocation.current = window.scrollY;

      clearTimeout(scrollTimeoutRef.current!);
      scrollTimeoutRef.current = setTimeout(() => {  // stop scrolling display
        setWindowSize((prevWindowSize) => ({
          ...prevWindowSize,
          // isAppear: isForceHiddenPage ? false : true,
        }));
      }, 200);
    };

    const handleSize = () => {
      if (window.visualViewport) {
        setWindowSize((prevWindowSize) => ({
          ...prevWindowSize,
          width: window?.visualViewport?.width ?? 0,
          height: window?.visualViewport?.height ?? 0,
          scrollY: window.scrollY,
          isWindowReady: true,
        }));
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleSize);
      window.addEventListener("scroll", handleScroll);
      handleSize();

      return () => {
        window.removeEventListener("resize", handleSize);
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeoutRef.current!);
      };
    }
  }, []);

  return windowSize;
};



/*
"use client";

import { ROUTES } from "@/constants";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useTransition, useMemo, useCallback } from "react";
import { debounce } from "lodash";

type WindowSizeProps = {
  width: number;
  height: number;
  scrollY: number;
  isWindowReady: boolean;
};

export const useWindowSize = () => {
  const [isPending, startTransition] = useTransition();
  const path = usePathname();
  const locationForMoreThanTwoFolder = path.split("/")[3];
  const slugs = getRouteNameFromPathname(path);
  let isForceHiddenPage = false;
  if (slugs.secondSlug === ROUTES.STORE_LOCATION ||
      slugs.secondSlug === ROUTES.CHECKOUT ||
      slugs.secondSlug === ROUTES.MAINTENANCE ||
      slugs.secondSlug === ROUTES.MAINTENANCE_DAILY ||
      locationForMoreThanTwoFolder === "payment-in-progress" ||
      (slugs.secondSlug === ROUTES.CAMPAIGN && locationForMoreThanTwoFolder === "submitted")) {  // condition copied from /src/components/BottomNavbar.tsx 
        isForceHiddenPage = true;
  }

  const defaultWindowSizeState: WindowSizeProps = useMemo(() => ({
    width: 0,
    height: 0,
    scrollY: 0,
    isWindowReady: false,
  }), []);

  const [windowSize, setWindowSize] = useState(defaultWindowSizeState);
  const [shouldBottomNavBarAppear, setShouldBottomNavBarAppear] = useState(isForceHiddenPage ? false : true);
  const lastScrollLocation = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevWindowSizeState = useRef(defaultWindowSizeState);
  
  useEffect(() => {
    if (!isPending) {
      prevWindowSizeState.current = windowSize;
    }
  }, [windowSize, isPending])

  const debounceSetWindowState = debounce((state: WindowSizeProps) => {
    setWindowSize(state);
  }, 300);
  
  const setStateCallback = useCallback(
    (state: WindowSizeProps) => {
      debounceSetWindowState(state);
    },
    [debounceSetWindowState]
  )

  useEffect(() => {
    const handleScroll = () => {
      if (lastScrollLocation.current >= window.scrollY || window.scrollY <= 0) {  // scrolling up keep display
        const shouldAppear = isForceHiddenPage ? false : true;
        if (shouldAppear !== shouldBottomNavBarAppear) {
          setShouldBottomNavBarAppear(shouldAppear);
        }
      } else {
        setShouldBottomNavBarAppear(false);
      }
      lastScrollLocation.current = window.scrollY;
  
      startTransition(() => {
        setStateCallback({ ...windowSize, scrollY: window.scrollY });
      })
  
      scrollTimeoutRef.current && clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {  // stop scrolling display
        setShouldBottomNavBarAppear(isForceHiddenPage ? false : true);
      }, 300);
    }
  
    const handleSize = () => {
      if (window.visualViewport) {
        startTransition(() => {
          setStateCallback({ 
            ...windowSize,
            width: window?.visualViewport?.width ?? 0,
            height: window?.visualViewport?.height ?? 0,
            scrollY: window.scrollY,
            isWindowReady: true,
          });
        })
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleSize, { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });

      const interval = setInterval(() => {
        if (!windowSize.isWindowReady) {
          startTransition(() => {
            setWindowSize({ 
              width: window?.visualViewport?.width ?? 0,
              height: window?.visualViewport?.height ?? 0,
              scrollY: window.scrollY,
              isWindowReady: true,
            });
          })
        }
      }, 100)

      return () => {
        window.removeEventListener("resize", handleSize);
        window.removeEventListener("scroll", handleScroll);
        scrollTimeoutRef.current && clearTimeout(scrollTimeoutRef.current);
        clearInterval(interval);
      };
    }
  }, [isForceHiddenPage, windowSize]);

  if (isPending) {
    return {
      ...prevWindowSizeState.current,
      isAppear: shouldBottomNavBarAppear,
    };
  }

  return { 
    ...windowSize, 
    isAppear: shouldBottomNavBarAppear
  };
};
*/