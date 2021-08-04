import styles from "./styles.module.css";

const DoubleSlider = ({
  label,
  step = 10,
  min = -100,
  max = 100,
  current = 50,
  onChange,
}) => {
  const handleChange = ({ target: { value } }) => {
    onChange && onChange(value);
  };
  return (
    <div className={styles.root}>
      <div className={styles.values}>
        <div>{label}</div>
        <div>{current}</div>
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
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default DoubleSlider;
