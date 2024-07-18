import { WebGLRenderer } from "three";

const renderer = new WebGLRenderer({antialias : true});
renderer.physicallyCorrectLights = true;

export const useRenderer = () => renderer;