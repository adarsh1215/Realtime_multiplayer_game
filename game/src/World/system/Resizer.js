class Resizer {
  constructor(camera, renderer) {
    this.app = null;
    this.camera = camera;
    this.renderer = renderer;
  }

  init(app) {
    this.app = app;
  }

  tick(delta) {
    this.camera.aspect = this.app.clientWidth / this.app.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
}
  
export { Resizer };