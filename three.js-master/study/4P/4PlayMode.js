import * as THREE from '../../build/three.module.js';
import { OrbitControls } from '../../examples/jsm/controls/OrbitControls.js';

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

    window.addEventListener('keydown', this._onKeyDown.bind(this), false);
    window.addEventListener('keyup', this._onKeyUp.bind(this), false);

     // Add a div element for displaying the collision side
    this._collisionSideDiv = document.createElement('div');
    this._collisionSideDiv.style.position = 'absolute';
    this._collisionSideDiv.style.top = '50%';
    this._collisionSideDiv.style.left = '50%';
    this._collisionSideDiv.style.transform = 'translate(-50%, -50%)';
    this._collisionSideDiv.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(this._collisionSideDiv);

    this.sideAScore = 0;
    this.sideBScore = 0;
    this.sideCScore = 0;
    this.sideDScore = 0;
     
    this._keys = {
      s: false, w: false, 
      ArrowUp: false, ArrowDown: false,
      '9': false, '0': false, '1': false, '2': false
    };
    this._resize();
  }

  _onKeyDown(event) {
    if (event.key in this._keys) {
      this._keys[event.key] = true;
      event.preventDefault();
    }
  }

  _onKeyUp(event) {
    if (event.key in this._keys) {
      this._keys[event.key] = false;
      event.preventDefault();
    }
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
    const geometry1 = new THREE.BoxGeometry(0.04, 0.2, 0.01);
    const geometry2 = new THREE.BoxGeometry(0.2, 0.04, 0.01);

    const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    this._leftPaddle = new THREE.Mesh(geometry1, material);
    this._rightPaddle = new THREE.Mesh(geometry1, material);
    this._upPaddle = new THREE.Mesh(geometry2, material);
    this._downPaddle = new THREE.Mesh(geometry2, material);
    
    this._leftPaddle.position.x = -0.55;
    this._rightPaddle.position.x = 0.55;
    this._upPaddle.position.y = 0.55;
    this._downPaddle.position.y = -0.55;
    this._scene.add(this._leftPaddle, this._rightPaddle, this._upPaddle, this._downPaddle);
  }

  _setupBall() {

    this._ballRadius = 0.02;
    const geometry = new THREE.SphereGeometry(this._ballRadius, 32, 32);
    const material = new THREE.MeshPhongMaterial({color: 0xff0000});
    this._ball = new THREE.Mesh(geometry, material);
    this._scene.add(this._ball);
    this._scene.add(this._ballRadius);
    this._ballVelocity = new THREE.Vector3(0.01, 0.01, 0);
  }

  _setupBox() {

    const geometry = new THREE.BoxGeometry(1.2, 1, 0.3);
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

//    Check for collision with paddles
    const paddleSpeed = 0.01;
    const paddleWidth = this._leftPaddle.geometry.parameters.width;
    const paddleHeight = this._leftPaddle.geometry.parameters.height;
    
    if (Math.abs(this._ball.position.y - this._leftPaddle.position.y) < paddleHeight / 2 ) {
      if (Math.abs(this._ball.position.x - this._leftPaddle.position.x) < paddleWidth / 2 ) {
        this._ballVelocity.x = Math.abs(this._ballVelocity.x);
      }
    } else if (Math.abs(this._ball.position.y - this._rightPaddle.position.y) < paddleHeight / 2 ) {
      if (Math.abs(this._ball.position.x - this._rightPaddle.position.x) < paddleWidth / 2 ) {
        this._ballVelocity.x = -Math.abs(this._ballVelocity.x);
      }
    }

    const boxWidth = this._box.geometry.parameters.width / 2;
    const boxHeight = this._box.geometry.parameters.height / 2;

    if (Math.abs(this._ball.position.x) > boxWidth) {      
      if (this._ball.position.x > 0) {
        this.sideAScore++;
      }
      else {
        this.sideBScore++;
      }
      this._ballVelocity.x = -this._ballVelocity.x;
      this._collisionSideDiv.textContent = this._ball.position.x > 0 ? "오른쪽 면에 닿았습니다." + this.sideAScore.toString() : "왼쪽 면에 닿았습니다." + this.sideBScore.toString();
    }
    if (Math.abs(this._ball.position.y) > boxHeight) {
      if (this._ball.position.y > 0) {
        this.sideCScore++;
      }
      else {
        this.sideDScore++;
      }

      this._ballVelocity.y = -this._ballVelocity.y;
      this._collisionSideDiv.textContent = this._ball.position.y > 0 ? "위쪽 면에 닿았습니다." + this.sideCScore.toString() : "아래쪽 면에 닿았습니다." + this.sideDScore.toString();
    }
    
    if (this.sideAScore >= 5 || this.sideBScore >= 5) {
      // End the game and display the winner
      this._renderer.setAnimationLoop(null); // Stop the game loop
      const winner = this.sideAScore >= 5 ? 'A' : 'B';
      this._collisionSideDiv.textContent = winner + '가 이겼습니다.';
      this._collisionSideDiv.style.fontSize = '3em'; // Make the text bigger
      this._collisionSideDiv.style.color = 'red'; // Change the text color
      return; // Skip the rest of the update
    }
    
    if (this.sideCScore >= 5 || this.sideDScore >= 5) {
      // End the game and display the winner
      this._renderer.setAnimationLoop(null); // Stop the game loop
      const winner = this.sideCScore >= 5 ? 'C' : 'D';
      this._collisionSideDiv.textContent = winner + '가 이겼습니다.';
      this._collisionSideDiv.style.fontSize = '3em'; // Make the text bigger
      this._collisionSideDiv.style.color = 'red'; // Change the text color
      return; // Skip the rest of the update
    }

    if (this._keys.w && this._leftPaddle.position.y < boxHeight - paddleHeight) {
      this._leftPaddle.position.y += paddleSpeed;
    }
    if (this._keys.s && this._leftPaddle.position.y > -boxHeight + paddleHeight) {
      this._leftPaddle.position.y -= paddleSpeed;
    }
    if (this._keys.ArrowUp && this._rightPaddle.position.y < boxHeight - paddleHeight) {
      this._rightPaddle.position.y += paddleSpeed;
    }
    if (this._keys.ArrowDown && this._rightPaddle.position.y > -boxHeight + paddleHeight) {
      this._rightPaddle.position.y -= paddleSpeed;
    }
    if (this._keys['0'] && this._downPaddle.position.x < boxWidth - paddleWidth) {
      this._downPaddle.position.x += paddleSpeed;
    }    
    if (this._keys['9'] && this._downPaddle.position.x > -boxWidth) {
      this._downPaddle.position.x -= paddleSpeed;
    }
    if (this._keys['1'] && this._upPaddle.position.x < boxWidth - paddleWidth) {
      this._upPaddle.position.x += paddleSpeed;
    }    
    if (this._keys['2'] && this._upPaddle.position.x > -boxWidth) {
      this._upPaddle.position.x -= paddleSpeed;
    }
    
    this._renderer.render(this._scene, this._camera);
  }
}

window.onload = () => { new App(); }
