import "./App.css";

import { useCallback, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import SampleWrapper from "./components/SampleWrapper";
import SocialLinks from "./components/SocialLinks";
import Controls from "./components/Controls";
import FadeIn from "./components/FadeIn";
import Tips from "./components/Tips";

import { getComponentConfig } from "./data/componentInfo";

function App() {
  const fpsRef = useRef();
  const sampleRef = useRef();
  const showFps = useRef(false);
  const [index, setIndex] = useState(0);

  const updateFps = (fps) => {
    fpsRef.current.innerHTML = `FPS ${fps}`;
  };

  const toggleFps = useCallback(() => {
    showFps.current = sampleRef.current.toggleFPS(updateFps);
    fpsRef.current.style.display = showFps.current ? "block" : "none";
  }, []);

  const config = getComponentConfig(index);
  if (showFps.current && !config.fpsCallback) config.fpsCallback = updateFps;
  else if (!showFps.current && config.fpsCallback)
    config.fpsCallback = undefined;

  return (
    <>
      <FadeIn ref={fpsRef} className="fps" />

      <SocialLinks />
      <Controls
        index={index}
        toggleFps={toggleFps}
        sampleRef={sampleRef}
        onSampleChange={setIndex}
      />

      <TransitionGroup appear component={null}>
        <CSSTransition key={index} timeout={1000} classNames="item">
          <SampleWrapper ref={sampleRef} index={index} />
        </CSSTransition>
      </TransitionGroup>

      <Tips />
    </>
  );
}

export default App;
