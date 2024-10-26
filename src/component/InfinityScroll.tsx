"use client";

import { useEffect, useRef, useState } from "react";


interface InfinityScrollProps {
    children: React.ReactNode;
    fetchMore: () => void;
    loading: boolean;
    customClass?: string;
    reachMax: boolean;

}

export const InfinityScroll = ({
    children,
    fetchMore,
    loading,
    customClass,
    reachMax,
}:InfinityScrollProps) => {

    const boxRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
          setScrollY(window.scrollY);
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

    useEffect(() => {
        if(!boxRef.current || loading || reachMax) return;

        const { clientHeight } = boxRef.current;
        // const triggerPoint = scrollHeight - clientHeight * 0.8;
        // console.log('====================================');
        // console.log('scrollY',scrollY);
        // console.log('clientHeight',clientHeight);
        // console.log('====================================');
        if(scrollY + window.innerHeight >= clientHeight) {
            fetchMore();
        }

    }, [scrollY,boxRef.current, loading]);


    return (
        <div className="flex justify-center items-center flex-col">
            <div className={`${customClass? customClass : "w-full"}`} ref={boxRef}>
                {children}
            </div>
            {loading && <div className="spinner" />}
        </div>
    );

}