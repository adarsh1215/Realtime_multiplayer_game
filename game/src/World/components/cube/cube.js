import { BoxGeometry, Mesh, MeshStandardMaterial } from "three"
import { useScene } from "../useScene";

export const create3Cube = () => {
    const geo = new BoxGeometry(.1, .1, .1);
    const mat = new MeshStandardMaterial({color : "blue"});

    const cube = new Mesh(geo, mat);
    useScene().add(cube);
    return cube;
}