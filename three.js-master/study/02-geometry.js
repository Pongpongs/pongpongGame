import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';



class App {
  constructor() {
    const container = document.querySelector('#webgl-container');

    this._scene = new THREE.Scene();
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setClearColor('#87CEEB');
    container.appendChild(this._renderer.domElement);

    this._setupCamera();
    this._setupLight();
    this._setupPaddle();
    this._setupBall();
    this._setupBox();
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);

    this._renderer.setAnimationLoop(this._update.bind(this));
    window.addEventListener('resize', this._resize.bind(this), false);
    this._resize();
  }

  _setupCamera() {
    this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this._camera.position.z = 1;
  }

  _setupLight() {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupPaddle() {
    const geometry = new THREE.BoxGeometry(0.05, 0.2, 0.01);
    const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    this._leftPaddle = new THREE.Mesh(geometry, material);
    this._rightPaddle = new THREE.Mesh(geometry, material);
    this._leftPaddle.position.x = -0.6;
    this._rightPaddle.position.x = 0.6;
    this._scene.add(this._leftPaddle, this._rightPaddle);
  }

  _setupBall() {
    const geometry = new THREE.SphereGeometry(0.02, 32, 32);
    const material = new THREE.MeshPhongMaterial({color: 0xff0000});
    this._ball = new THREE.Mesh(geometry, material);
    this._scene.add(this._ball);

    this._ballVelocity = new THREE.Vector3(0.01, 0.01, 0);
  }

  _setupBox() {
    // const geometry = new THREE.BoxGeometry(1.2, 1, 1);
    // const material = new THREE.MeshPhongMaterial({color: 0x000000, opacity: 0.5, transparent: true});
    // this._box = new THREE.Mesh(geometry, material);
    // this._scene.add(this._box);
    const geometry = new THREE.BoxGeometry(1.2, 1, 1);
    const loader = new THREE.TextureLoader();
    const texture = loader.load('GlassTextur.png'); // 유리 텍스처 이미지를 로드
    const material = new THREE.MeshBasicMaterial({map: texture, opacity: 0.5, transparent: true});
    this._box = new THREE.Mesh(geometry, material);
    this._scene.add(this._box);
  }
  _resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
  }

  _update() {
    this._ball.position.add(this._ballVelocity);

    // Check for collision with paddles
    const paddleWidth = this._leftPaddle.geometry.parameters.width;
    const paddleHeight = this._leftPaddle.geometry.parameters.height;
    if (this._ball.position.distanceTo(this._leftPaddle.position) < paddleWidth / 2 + paddleHeight / 2) {
      this._ballVelocity.x = Math.abs(this._ballVelocity.x);
    } else if (this._ball.position.distanceTo(this._rightPaddle.position) < paddleWidth / 2 + paddleHeight / 2) {
      this._ballVelocity.x = -Math.abs(this._ballVelocity.x);
    }

    const boxWidth = this._box.geometry.parameters.width / 2;
    const boxHeight = this._box.geometry.parameters.height / 2;
    if (Math.abs(this._ball.position.x) > boxWidth - 0.02) {
      this._ballVelocity.x = -this._ballVelocity.x;
    }
    if (Math.abs(this._ball.position.y) > boxHeight - 0.02) {
      this._ballVelocity.y = -this._ballVelocity.y;
    }
    this._renderer.render(this._scene, this._camera);
  }
}

window.onload = () => { new App(); }
