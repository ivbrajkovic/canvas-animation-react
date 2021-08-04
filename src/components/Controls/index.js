import { Children, memo, useState } from "react";
import { a, useTrail } from "@react-spring/web";

import { SingleSlider, DoubleSlider } from "components/Slider";
import SwitchButton from "components/SwitchButton";
import GroupButton from "components/GroupButton";
import FadeIn from "components/FadeIn";

import { store } from "data/componentInfo";

import styles from "./styles.module.css";

const GROUP_BUTTONS = ["Text", "Points", "Cubes"];

const Trail = ({ children }) => {
  const items = Children.toArray(children);
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    to: { opacity: 1, x: 0 },
    from: { opacity: 0, x: 20 },
    delay: 200,
  });
  return trail.map((style, index) => (
    <a.div key={index} style={style}>
      {items[index]}
    </a.div>
  ));
};

const Controls = ({ index, sampleRef, toggleFps, onSampleChange }) => {
  const [state, setState] = useState(store);

  const { showLines, showSlider, showSpeed } = state.components[index].controls;
  const { config } = state.components[index];
  const { connections = {}, mouse = {}, camera = {} } = config;

  const toggleConnections = (value) => {
    config.connections.showConnections = value;
    sampleRef.current.showConnections(value);
    setState({ ...store });
  };

  const changeDistanceThresholdChange = ({ min, max }) => {
    config.connections.distanceThresholdMin = min;
    config.connections.distanceThresholdMax = max;
    sampleRef.current.changeDistanceThreshold(min, max);
    setState({ ...store });
  };

  const changeMouseRadius = ({ min, max }) => {
    config.mouse.radiusMin = min;
    config.mouse.radiusMax = max;
    sampleRef.current.changeMouseRadius(min, max);
    setState({ ...store });
  };

  const changeCameraSpeed = (speed) => {
    config.camera.speed = speed;
    sampleRef.current.changeCameraSpeed(speed);
    setState({ ...store });
  };

  return (
    <FadeIn delay={200} className={styles["controls-container"]}>
      <Trail>
        <GroupButton data={GROUP_BUTTONS} onChange={onSampleChange} />
        <SwitchButton id="input-fps" label="Show FPS" onChange={toggleFps} />
        {showLines && (
          <SwitchButton
            id="input-connections"
            label="Show lines"
            checked={connections.showConnections}
            onChange={toggleConnections}
          />
        )}
        {showSpeed && (
          <SingleSlider
            label="Speed"
            current={camera.speed}
            onChange={changeCameraSpeed}
          />
        )}
        {showSlider && (
          <DoubleSlider
            label="Lines"
            min={connections.sliderMin}
            max={connections.sliderMax}
            currentMin={connections.distanceThresholdMin}
            currentMax={connections.distanceThresholdMax}
            onChange={changeDistanceThresholdChange}
          />
        )}
        {showSlider && (
          <DoubleSlider
            label="Radius"
            min={mouse.sliderMin}
            max={mouse.sliderMax}
            currentMin={mouse.radiusMin}
            currentMax={mouse.radiusMax}
            onChange={changeMouseRadius}
          />
        )}
      </Trail>
    </FadeIn>
  );
};

export default memo(Controls);
