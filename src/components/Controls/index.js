import { Children, memo } from "react";
import { a, useTrail } from "@react-spring/web";

import { getComponentConfig, getComponentControls } from "data/componentInfo";

import DoubleSlider from "components/DoubleSlider";
import SingleSlider from "components/SingleSlider";
import SwitchButton from "components/SwitchButton";
import GroupButton from "components/GroupButton";
import FadeIn from "components/FadeIn";

import styles from "./styles.module.css";

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
  const { showLines, showSlider, showSpeed } = getComponentControls(index);

  const config = getComponentConfig(index);
  const {
    fpsCallback,
    camera: { speed: cameraSpeed } = {},
    connections: {
      sliderMin,
      sliderMax,
      minDistanceThreshold,
      maxDistanceThreshold,
    } = {},
    mouse: { minRadius, maxRadius } = {},
  } = config;

  const toggleConnections = () => {
    config.showLines = sampleRef.current.toggleConnections();
  };

  const changeDistanceThresholdChange = ({ min, max }) => {
    config.connections.minDistanceThreshold = min;
    config.connections.maxDistanceThreshold = max;
    sampleRef.current.changeDistanceThreshold(min, max);
  };

  const changeMouseRadius = ({ min, max }) => {
    config.mouse.minRadius = min;
    config.mouse.maxRadius = max;
    sampleRef.current.changeMouseRadius(min, max);
  };

  const changeCameraSpeed = (speed) => {
    config.camera.speed = speed;
    sampleRef.current.changeCameraSpeed(speed);
  };

  return (
    <FadeIn delay={200} className={styles["controls-container"]}>
      <Trail>
        <GroupButton
          data={["Text", "Points", "Cubes"]}
          onChange={onSampleChange}
        />
        <SwitchButton
          id="input-fps"
          label="Show FPS"
          checked={!!fpsCallback}
          onChange={toggleFps}
        />
        {showLines && (
          <SwitchButton
            id="input-connections"
            label="Show lines"
            checked={true}
            onChange={toggleConnections}
          />
        )}
        {showSpeed && (
          <SingleSlider
            label="Speed: "
            current={cameraSpeed}
            onChange={changeCameraSpeed}
          />
        )}
        {showSlider && (
          <DoubleSlider
            label="Lines: "
            min={sliderMin}
            max={sliderMax}
            currentMin={minDistanceThreshold}
            currentMax={maxDistanceThreshold}
            onChange={changeDistanceThresholdChange}
          />
        )}
        {showSlider && (
          <DoubleSlider
            label="Radius: "
            min={0}
            max={800}
            currentMin={minRadius}
            currentMax={maxRadius}
            onChange={changeMouseRadius}
          />
        )}
      </Trail>
    </FadeIn>
  );
};

export default memo(Controls);
