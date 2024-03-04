import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader.js';


class App {
  constructor() {
    const container = document.querySelector('#webgl-container');

    this._scene = new THREE.Scene();
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setClearColor('#FFFFFF');
    container.appendChild(this._renderer.domElement);

    this._setupWorld();
    this._setupBackground();

    this._setupCamera();
    this._setupLight();
    this._setupPaddle();
    this._setupBall();
    this._setupBox();
    this._setupWater();
    this._setupScoreBoard();

    this._controls = new OrbitControls(this._activeCamera, this._renderer.domElement);

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
     this._keys = {
      w: false, s: false, ㄴ:false, ㅈ:false,
      ArrowUp: false, ArrowDown: false
    };

    this._resize();
  }

  _onKeyDown(event) {
    if (event.key in this._keys) {
      this._keys[event.key] = true;
    }

    if (event.key === '0') {
      this._activeCamera = this._camera; // 카메라1을 활성 카메라로 설정
      this._controls.object = this._activeCamera; // OrbitControls에 활성 카메라 업데이트
      this._controls.enabled = true;
      this._camera.position.set(0, 0, 1.4); // 카메라 위치 초기화
      //this._camera.rotation.set(0, 0, 0); // 카메라 회전 초기화
      this._camera.lookAt(this._scene.position); // 카메라가 씬의 중심을 바라보도록 설정
      this._controls.target.set(this._scene.position.x, this._scene.position.y, this._scene.position.z); // OrbitControls의 target 업데이트

    } else if (event.key === '1') {
        this._activeCamera = this._camera2; // 카메라2를 활성 카메라로 설정
        this._controls.object = this._activeCamera; // OrbitControls에 활성 카메라 업데이트
        this._controls.enabled = true;
        this._camera2.position.set(1.4, 0, 1); // 카메라 위치 변경
        this._camera2.rotation.set(0, Math.PI/4, Math.PI/2); // 카메라 회전 변경
        this._controls.target.set(this._scene.position.x, this._scene.position.y, this._scene.position.z); // OrbitControls의 target 업데이트
        //this._controls.update();
      } else if (event.key === '2') {
      this._activeCamera = this._camera3; // 카메라2를 활성 카메라로 설정
      this._controls.object = this._activeCamera; // OrbitControls에 활성 카메라 업데이트
      this._controls.enabled = false;
      this._camera3.position.set(-1.4, 0, 1); // 카메라 위치 변경
      this._camera3.rotation.set(0, -Math.PI/4, -Math.PI/2); // 카메라 회전 변경
      this._controls.target.set(this._scene.position.x, this._scene.position.y, this._scene.position.z); // OrbitControls의 target 업데이트
        
    }
  }

  _onKeyUp(event) {
    if (event.key in this._keys) {
      this._keys[event.key] = false;
    }
  }


  _setupWorld() {
    // 바닥을 위한 평면 생성
    const floorGeometry = new THREE.PlaneGeometry(100, 100); // 크기 조정 가능
    const floorMaterial = new THREE.MeshStandardMaterial({color: 0xCCCCCC}); // 재질 설정
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    //floor.rotation.x = Math.PI / 2; // X축을 중심으로 90도 회전하여 바닥으로 만듦
    floor.position.z = -5; // 바닥의 높이 설정
    this._scene.add(floor); // 씬에 바닥 추가

    this._scene.background = new THREE.Color(0xabcdef); 
  }


  _setupBackground() {

    const loader = new GLTFLoader();
    // GLTF 파일 경로. 실제 파일 경로로 대체해야 합니다.
    const modelPath = 'sink/scene.gltf';
    // GLTF 파일 로드
    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        // 모델의 크기, 위치, 회전 등을 조정할 수 있습니다.
        model.scale.set(1.4, 1, 1.4); // 크기 조정 예시
        model.position.set(2.4, -0.6, -1.5); // 위치 조정 예시
        model.rotation.set(Math.PI/2, Math.PI/2, 0); // 회전 조정 예시
        // 로드된 모델을 씬에 추가
        this._scene.add(model);

    }, undefined, (error) => {
        console.error('An error happened while loading the model:', error);
    });

  }

  _setupCamera() {
    this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this._camera.position.z = 2;

    this._camera2 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this._camera2.position.z = 2;

    this._camera3 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this._camera3.position.z = 2;
   
    //this._camera2.rotation.set(0, -Math.PI/4, Math.PI/4);
    this._activeCamera = this._camera;
  }

  _setupLight() {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupPaddle() {

    const loader = new GLTFLoader();
    const modelPath = 'gloves/scene.gltf';
  
    loader.load(modelPath, (gltf) => {
      this._leftPaddle = gltf.scene;
      this._rightPaddle = gltf.scene.clone();
      this._leftPaddle.position.x = -0.9;
      this._rightPaddle.position.x = 0.9;

      this._leftPaddle.scale.set(0.01, 0.01, 0.01);
      this._rightPaddle.scale.set(0.01, 0.01, 0.01);
      
      this._rightPaddle.rotation.y = -Math.PI/2; // 180도 회전
      this._leftPaddle.rotation.y = Math.PI/2; // 180도 회전

      this._scene.add(this._leftPaddle, this._rightPaddle);

      this._leftPaddleBox = new THREE.Box3().setFromObject(this._leftPaddle);
      this._rightPaddleBox = new THREE.Box3().setFromObject(this._rightPaddle);
    }, undefined, (error) => {
      console.error('An error happened while loading the model:', error);
    });
  }

  _setupBall() {

    const loader = new GLTFLoader();
    const modelPath = 'dish/scene.gltf';

    loader.load(modelPath, (gltf) => {
      this._ball = gltf.scene;
      // this._ballRadius = 0.02;
      this._ball.position.set(0, 0, 0);
      this._ball.scale.set(0.2, 0.2, 0.2);
      this._scene.add(this._ball);
      
      const box = new THREE.Box3().setFromObject(this._ball);

        // bounding box의 중심을 계산
      const center = new THREE.Vector3();
      box.getCenter(center);

      this._ball.traverse((child) => {
          if (child.isMesh) {
              // 중심을 기준으로 자식의 위치를 조정하여 모델을 재배치
              child.geometry.translate(-center.x, -center.y, -center.z);
          }
      });
      this._ballBox = new THREE.Box3().setFromObject(this._ball);
      this._ballVelocity = new THREE.Vector3(0.007, 0.007, 0);
    }, undefined, (error) => {
      console.error('An error happened while loading the model:', error);
    });
  }

  _startBallRotation() {
    const rotationSpeed = 0.055;
    const animate = () => {
        requestAnimationFrame(animate); // 다음 프레임을 위해 animate 함수를 재귀적으로 호출
        if (this._ball) {
            this._ball.rotation.x += rotationSpeed;
            this._ball.rotation.y += rotationSpeed;
        }
    };

    animate(); // 애니메이션 시작
}

  _setupBox() {

    const geometry = new THREE.BoxGeometry(1.7, 1.7, 0.1);
    const loader = new THREE.TextureLoader();
    const texture = loader.load('GlassTextur.png'); // 유리 텍스처 이미지를 로드
    const material = new THREE.MeshBasicMaterial({map: texture, opacity: 0.5, transparent: true});
    this._box = new THREE.Mesh(geometry, material);
    this._scene.add(this._box);
  }

  _setupWater() {
    const loader = new GLTFLoader();

    // .gltf 모델 파일 경로
    const modelPath = 'water_waves/scene.gltf';

    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        // 모델의 크기, 위치, 회전을 조정할 수 있습니다.
        model.scale.set(0.3, 1.0, 0.2); // 모델 크기 조정 예시
        model.rotation.set(Math.PI/2, 0, Math.PI); // 모델 회전 조정 예시
        model.position.set(0, -0.1, -0.4); // 모델 위치 조정 예시
        // 로드된 모델을 씬에 추가
        this._scene.add(model);
    }, undefined, (error) => {
        console.error('An error happened while loading the model:', error);
    });
  }

  _setupScoreBoard() {

    const canvas = document.createElement('canvas');
    this._boardContext = canvas.getContext('2d');

    canvas.width = 512;
    canvas.height = 512;
    
    this._boardContext.fillStyle = 'white';
  
    this._boardContext.font = '96px sans-serif';
    this._boardContext.textAlign = 'center';
    this._boardContext.textBaseline = 'middle';
    this._boardContext.fillText('0 : 0', canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.PlaneGeometry(0.3, 0.2);
    let material = new THREE.MeshBasicMaterial({map: texture});
    this._scoreBoard = new THREE.Mesh(geometry, material);
    this._scoreBoard.position.y = 0.9;
    this._scene.add(this._scoreBoard);
  }

  _resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this._activeCamera.aspect = width / height;
    this._activeCamera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
  }

  _sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }

  _update() {
    if (this._ball && this._leftPaddle && this._rightPaddle) {
        this._ball.position.add(this._ballVelocity);
        this._ball.position.z = -0.5 * ((this._ball.position.x) * (this._ball.position.x)) + 0.85*0.85 * 0.5;

        const rotationSpeed = 0.04; // 이 값은 공의 회전 속도를 결정합니다.

        this._ball.rotation.x += rotationSpeed;
        this._ball.rotation.y += rotationSpeed;

        // Update bounding boxes
        this._ballBox.setFromObject(this._ball);
        this._leftPaddleBox.setFromObject(this._leftPaddle);
        this._rightPaddleBox.setFromObject(this._rightPaddle);

        // Collision detection with the paddles
        if (this._ballBox.intersectsBox(this._leftPaddleBox)) {
            this._ballVelocity.x = Math.abs(this._ballVelocity.x) * 1.0;
        } else if (this._ballBox.intersectsBox(this._rightPaddleBox)) {
            this._ballVelocity.x = -Math.abs(this._ballVelocity.x) * 1.0;
    
        }

        // Update the game state based on ball position
        const boxWidth = this._box.geometry.parameters.width / 2;
        const boxHeight = this._box.geometry.parameters.height / 2;

        // Check for scoring
        if (Math.abs(this._ball.position.x) > boxWidth) {
          // Reset ball position and update score
          if (this._ball.position.x > 0) {
              this.sideBScore++;
          } else {
              this.sideAScore++;
          }
          this._ball.position.set(0, 0, 0);
          this._ballVelocity.x = -this._ballVelocity.x;
          // Redraw score and possibly end game
          this._redrawBoard();
          this._renderer.render(this._scene, this._activeCamera);

          if (this.sideAScore >= 10 || this.sideBScore >= 10) {
              // Handle game end
              this._endGame();
              return; // Skip the rest of the update
          }
        }

        // Bounce off the top and bottom walls
        if (Math.abs(this._ball.position.y) > boxHeight) {
            this._ballVelocity.y = -this._ballVelocity.y* 1.0;
        }

        // Paddle movement based on user input
        const paddleSpeed = 0.015;
        if ((this._keys.w || this._keys.ㅈ) && this._leftPaddle.position.y < boxHeight) {
            this._leftPaddle.position.y += paddleSpeed;
        }
        if ((this._keys.s || this._keys.ㄴ) && this._leftPaddle.position.y > -boxHeight) {
            this._leftPaddle.position.y -= paddleSpeed;
        }
        if (this._keys.ArrowUp && this._rightPaddle.position.y < boxHeight) {
            this._rightPaddle.position.y += paddleSpeed;
        }
        if (this._keys.ArrowDown && this._rightPaddle.position.y > -boxHeight) {
            this._rightPaddle.position.y -= paddleSpeed;
        }

        this._renderer.render(this._scene, this._activeCamera);
    }
  }

  _endGame() {
      const winner = this.sideAScore >= 10 ? 'A' : 'B';
      this._collisionSideDiv.textContent = winner + '가 이겼습니다.';
      this._collisionSideDiv.style.fontSize = '3em'; // Make the text bigger
      this._collisionSideDiv.style.color = 'red'; // Change the text color

      const button1 = document.getElementById("button1");
      button1.classList.remove("hidden");

      const button2 = document.getElementById("button2");
      button2.classList.remove("hidden");
      this._renderer.setAnimationLoop(null); // Stop the game loop
  }

  _redrawBoard() {
    this._boardContext.clearRect(0, 0, this._boardContext.canvas.width, this._boardContext.canvas.height);
    let newText = this.sideAScore.toString() + ' : ' + this.sideBScore.toString();
    this._boardContext.fillText( newText,  this._boardContext.canvas.width / 2, this._boardContext.canvas.height / 2 );
    this._scoreBoard.material.map.needsUpdate = true;
    
    this._ball.position.x = 0;
    this._ball.position.y = 0;
    //공위치 초기화
    this._leftPaddle.position.y = 0;
    this._rightPaddle.position.y = 0;

    this._ballVelocity.x = 0.007;
    this._ballVelocity.y = 0.007;
    this._ballVelocity.z = 0;
    
    //패들위치 초기화
    this._sleep(1000);
  }
}

window.onload = () => { new App(); }