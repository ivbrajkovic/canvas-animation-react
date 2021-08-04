import { useRef } from "react";

import styles from "./styles.module.css";

const DoubleSlider = ({
  label,
  min,
  max,
  currentMin = 20,
  currentMax = 120,
  onChange,
}) => {
  const stateRef = useRef({
    min: currentMin,
    max: currentMax,
  });
  const handleChange = ({ target: { name, value } }) => {
    stateRef.current[name] = +value;
    onChange && onChange(stateRef.current);
  };
  return (
    <div className={styles.root}>
      <div className={styles.values}>
        <div>{label}</div>
        <div>
          <span>{currentMin}</span>
          {" - "}
          <span>{currentMax}</span>
        </div>
      </div>
      <div className={styles["slider-container"]}>
        <div className={styles["slider-track"]} />
        <input
          name="min"
          type="range"
          step="10"
          min={min}
          max={max}
          value={currentMin}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="max"
          type="range"
          step="10"
          min={min}
          max={max}
          value={currentMax}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default DoubleSlider;
