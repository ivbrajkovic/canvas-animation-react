const components = [
  {
    name: "2D Particles text",
    controls: {
      showLines: true,
      showSlider: true,
    },
    config: {
      text: "Epti",
      color: { connection: "rgb(23,184,144)" },
      connections: {
        showConnections: true,
        sliderMin: 0,
        sliderMax: 100,
        distanceThresholdMin: 20,
        distanceThresholdMax: 40,
      },
      mouse: {
        sliderMin: 0,
        sliderMax: 800,
        radiusMin: 0,
        radiusMax: 300,
      },
    },
  },
  {
    name: "2D Particles",
    controls: {
      showSlider: true,
      showLines: true,
    },
    config: {
      color: { connection: "rgb(23,184,144)" },
      connections: {
        showConnections: true,
        sliderMin: 0,
        sliderMax: 200,
        distanceThresholdMin: 20,
        distanceThresholdMax: 120,
      },
      mouse: {
        sliderMin: 0,
        sliderMax: 800,
        radiusMin: 0,
        radiusMax: 250,
      },
    },
  },
  {
    name: "3D Cubes",
    controls: { showSpeed: true },
    config: {
      camera: { speed: 10 },
      color: {},
    },
  },
];

export const store = {
  showFPS: false,
  showLines: false,
  components: components,
};

export const getComponentName = (index) => store.components[index].name;
export const getComponentConfig = (index) => store.components[index].config;
export const getComponentControls = (index) => store.components[index].controls;
