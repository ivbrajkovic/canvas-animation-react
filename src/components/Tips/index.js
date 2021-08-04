import { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import fadeTransition from "./fade.module.css";
import styles from "./styles.module.css";

const DURATION = 5 * 1000;
const REPEAT = 2;

const TIPS = [
  "Press change sample button to see more samples.",
  "Toggle FPS switch to see rendering speed indicator.",
  "Toggle line switch to disable point connection line drawing.",
  "Move line sliders to change the point connection distance threshold.",
  "Move radius sliders to change the mouse radius threshold.",
  "Move speed slider to change cubes rotation speed.",
];

const Tips = () => {
  const countRef = useRef(0);
  const [showTips, toggleTips] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeoutFnc = () => {
      if (++countRef.current < TIPS.length * REPEAT) {
        setIndex((index) => ++index % TIPS.length);
        setTimeout(timeoutFnc, DURATION);
      } else toggleTips(false);
    };
    setTimeout(timeoutFnc, DURATION);
  }, []);

  return (
    <TransitionGroup appear component={null}>
      {showTips && (
        <CSSTransition
          key={index}
          timeout={{
            appear: 1000,
            enter: 1000,
            exit: 600,
          }}
          classNames={fadeTransition}
        >
          <div className={styles.tips}>Tips: {TIPS[index]}</div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

export default Tips;
