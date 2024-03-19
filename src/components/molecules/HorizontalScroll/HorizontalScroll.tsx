import React from "react";
import "./HorizontalScroll.css";

interface scrollItem {
  content: React.ReactNode | string;
}

const HorizontalScroll = ({
  items,
  speed = 5000,
}: {
  items: scrollItem[];
  speed?: number;
}) => {
  return (
    <div className="horizontal-scroll">
      <div className="wrapper">
        <section style={{ "--speed": `${speed}ms` } as React.CSSProperties}>
          {items.map(({ content }) => content)}
        </section>
        <section style={{ "--speed": `${speed}ms` } as React.CSSProperties}>
          {items.map(({ content }) => content)}
        </section>
        <section style={{ "--speed": `${speed}ms` } as React.CSSProperties}>
          {items.map(({ content }) => content)}
        </section>
      </div>
    </div>
  );
};

export default HorizontalScroll;
