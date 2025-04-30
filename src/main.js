import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Geometry + ShaderMaterial
const geometry = new THREE.IcosahedronGeometry(2, 50);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColorChange: { value: 0 },
  },
});

const sphere = new THREE.Mesh(geometry, material);
sphere.position.y = -2.5;
scene.add(sphere);

// Scroll animation
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".landing",
    start: "top top",
    end: "bottom center",
    scrub: 2,

  },
});

tl.to(sphere.position, {
  y: 0,
  z: -2,
  ease: "power2.inOut",
}, "a").to(material.uniforms.uColorChange, {
  value: 1,
  ease: "power2.inOut",
}, "a").to(".landing h1",{
  opacity:0,
},"a").to(".landing p ",{
  opacity:1,
});

// Animate
const clock = new THREE.Clock();
function animate() {
  material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});