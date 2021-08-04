import { useEffect, useRef } from "react";

import styles from "./styles.module.css";

const DoubleSlider = ({
  label,
  step = 10,
  min = -100,
  max = 100,
  current = 50,
  onChange,
}) => {
  const ref = useRef();
  useEffect(() => {
    ref.current.innerHTML = current;
  }, [current]);
  const handleChange = ({ target: { value } }) => {
    ref.current.innerHTML = value;
    onChange && onChange(value);
  };
  return (
    <div>
      <div className={styles.values}>
        {label ? label : null}
        <div>
          <span ref={ref} />
        </div>
      </div>
      <div className={styles["slider-container"]}>
        <div className={styles["slider-track"]} />
        <input
          name="max"
          type="range"
          step={step}
          min={min}
          max={max}
          value={current}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default DoubleSlider;
