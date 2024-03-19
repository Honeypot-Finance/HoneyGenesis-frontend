import React, { useEffect, useRef } from "react";
import "./HorizontalScroll.css";

interface scrollItem {
  content: React.ReactNode | string;
}

interface HorizontalScrollProps {
  items: scrollItem[];
  speed?: number;
  stopOnHover: boolean;
}

const HorizontalScroll = ({
  items,
  speed = 5000,
  stopOnHover = true,
}: HorizontalScrollProps) => {
  const horizontalScroll = useRef<HTMLDivElement>(null);
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const scrollRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stopOnHover) return;

    const horizontalScrollCurrent = horizontalScroll.current;

    const handleMouseEnter = () => {
      if (stopOnHover) {
        scrollRef1.current.style.animationPlayState = "paused";
        scrollRef2.current.style.animationPlayState = "paused";
        scrollRef3.current.style.animationPlayState = "paused";
      }
    };

    const handleMouseLeave = () => {
      if (stopOnHover) {
        scrollRef1.current.style.animationPlayState = "running";
        scrollRef2.current.style.animationPlayState = "running";
        scrollRef3.current.style.animationPlayState = "running";
      }
    };

    if (stopOnHover) {
      horizontalScrollCurrent.addEventListener("mouseenter", handleMouseEnter);
      horizontalScrollCurrent.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (stopOnHover) {
        horizontalScrollCurrent.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );

        horizontalScrollCurrent.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }
    };
  }, [speed, stopOnHover]);

  return (
    <div className="horizontal-scroll" ref={horizontalScroll}>
      <div className="wrapper">
        <section
          ref={scrollRef1}
          className="content"
          style={{ "--speed": `${speed}ms` } as React.CSSProperties}
        >
          {items.map(({ content }) => content)}
        </section>
        <section
          ref={scrollRef2}
          className="content"
          style={{ "--speed": `${speed}ms` } as React.CSSProperties}
        >
          {items.map(({ content }) => content)}
        </section>
        <section
          ref={scrollRef3}
          className="content"
          style={{ "--speed": `${speed}ms` } as React.CSSProperties}
        >
          {items.map(({ content }) => content)}
        </section>
      </div>
    </div>
  );
};

export default HorizontalScroll;
