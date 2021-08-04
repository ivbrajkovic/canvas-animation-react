const componentsInfo = [
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
        sliderMin: 0,
        sliderMax: 100,
        minDistanceThreshold: 20,
        maxDistanceThreshold: 40,
      },
      mouse: {
        minRadius: 0,
        maxRadius: 300,
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
        sliderMin: 0,
        sliderMax: 400,
        minDistanceThreshold: 20,
        maxDistanceThreshold: 120,
      },
      mouse: {
        minRadius: 0,
        maxRadius: 250,
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

export const getComponentName = (index) => componentsInfo[index].name;
export const getComponentConfig = (index) => componentsInfo[index].config;
export const getComponentControls = (index) => componentsInfo[index].controls;
