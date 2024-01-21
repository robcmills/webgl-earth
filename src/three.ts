import * as THREE from 'three';

const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
if (!canvas) throw new Error('three-root not found');

const width = canvas.clientWidth;
const height = canvas.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.y = 1;
camera.position.z = 2;
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas,
  powerPreference: 'high-performance',
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setSize(width, height);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: "blue" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const directionalLight = new THREE.DirectionalLight("white", 2);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);


function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
