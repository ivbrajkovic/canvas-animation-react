import { useState } from "react";
import styles from "./styles.module.css";

const GroupButton = ({ data = [], onChange }) => {
  const [index, setIndex] = useState(0);
  const handleClick = (index) => {
    setIndex(index);
    onChange && onChange(index);
  };
  return (
    <div className={styles["button-container"]}>
      {data.map((item, i) => (
        <div
          key={item}
          className={`${styles.button}${
            index === i ? ` ${styles["button-active"]}` : ""
          }`}
          onClick={() => handleClick(i)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default GroupButton;
