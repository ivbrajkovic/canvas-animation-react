import { useEffect, useRef } from "react";

import styles from "./styles.module.css";

const DoubleSlider = ({
  label,
  min,
  max,
  currentMin = 20,
  currentMax = 120,
  onChange,
}) => {
  const ref = useRef({ min: null, max: null });
  useEffect(() => {
    ref.current.min.innerHTML = currentMin;
    ref.current.max.innerHTML = currentMax;
  }, [currentMin, currentMax]);
  const handleChange = ({ target: { name, value } }) => {
    ref.current[name].innerHTML = value;
    onChange &&
      onChange({
        min: +ref.current.min.innerHTML,
        max: +ref.current.max.innerHTML,
      });
  };
  return (
    <div>
      <div className={styles.values}>
        {label ? label : null}
        <div>
          <span ref={(el) => (ref.current.min = el)} />
          {" - "}
          <span ref={(el) => (ref.current.max = el)} />
        </div>
      </div>
      <div className={styles["slider-container"]}>
        <div className={styles["slider-track"]} />
        <input
          className={styles.slider}
          name="min"
          type="range"
          step="10"
          min={min}
          max={max}
          value={currentMin}
          onChange={handleChange}
        />
        <input
          name="max"
          type="range"
          step="10"
          min={min}
          max={max}
          value={currentMax}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default DoubleSlider;
