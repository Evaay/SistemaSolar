import { FlyControls } from "three/examples/jsm/controls/FlyControls";

export function initFLyControls(camera, renderer) {
  const flyControls = new FlyControls(camera, renderer.domElement);
  flyControls.dragToLook = true;
  flyControls.movementSpeed = 0.006;
  flyControls.rollSpeed = 0.0005;
  return flyControls;
}
