import { forwardRef } from "react";
import styles from "./styles.module.css";

const FadeIn = forwardRef(({ children, delay, duration, ...rest }, ref) => {
  const style = rest.style || {};
  delay && (style.animationDelay = `${delay}ms`);
  duration && (style.animationDuration = `${duration}ms`);

  const classes = rest.className?.split(" ") || [];
  classes.push(styles["fade-in"]);

  return (
    <div ref={ref} style={style} className={classes.join(" ")}>
      {children}
    </div>
  );
});

export default FadeIn;
