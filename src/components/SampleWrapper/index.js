import { useEffect, useRef, forwardRef, memo } from "react";

import { samples } from "lib/index";
import { getComponentConfig } from "data/componentInfo";

import classes from "./style.module.css";

const Sample = forwardRef(({ index }, ref) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const config = getComponentConfig(index);
    const sample = new samples[index](canvas, config);

    sample.start();
    ref.current = sample;

    return sample.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return <canvas ref={canvasRef} className={classes.canvas} />;
});

export default memo(Sample);
