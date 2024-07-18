import {AmbientLight, Color, DirectionalLight} from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';

const dirLight = new DirectionalLight("whiete", 5);
const ambLight = new AmbientLight("white", .5);

export const useDirLight = () => dirLight;
export const useAmbLight = () => ambLight;
