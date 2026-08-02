import { useEffect, useRef, useState } from "react";

/**
 * FitA4 — keeps a fixed-width (A4) sheet true to its print dimensions while
 * making it usable on small screens.
 *
 * On wide screens the sheet renders at its natural 1:1 width, centered.
 * On narrow screens it is scaled down (CSS transform) so no horizontal
 * scrolling is needed. The transform lives on an inner wrapper and the outer
 * reserves the matching layout height, so the page flows correctly at any
 * size. The scale is purely visual: consumers that capture the inner sheet
 * (e.g. html2canvas) should strip the transform from the clone (see
 * Portfolio.jsx) to export at full A4 resolution.
 */
const FitA4 = ({ width = 794, id, children, className = "" }) => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const update = () => {
      const outerW = outerRef.current ? outerRef.current.clientWidth : width;
      const s = Math.min(1, outerW / width);
      setScale(s);
      // offsetHeight ignores transforms, so this is the natural (unscaled) height.
      if (innerRef.current) setHeight(innerRef.current.offsetHeight * s);
    };
    update();
    window.addEventListener("resize", update);
    // Re-measure once after fonts/images settle.
    const t = window.setTimeout(update, 350);
    return () => {
      window.removeEventListener("resize", update);
      window.clearTimeout(t);
    };
  }, [width]);

  return (
    <div
      ref={outerRef}
      data-fit-outer
      className={className}
      style={{ width: "100%", height: height != null ? `${height}px` : undefined }}
    >
      <div
        id={id}
        ref={innerRef}
        data-fit-inner
        style={{
          width: `${width}px`,
          margin: "0 auto",
          transform: scale < 1 ? `scale(${scale})` : "none",
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FitA4;
