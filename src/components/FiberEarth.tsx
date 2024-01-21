import { Suspense, useRef } from 'react';
import { AdditiveBlending, Mesh, TextureLoader } from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { FresnelMat } from './FresnelMat';
import { CloudMat } from './CloudMat';

const radius = 1;
const detail = 12;

function EarthGeometry() {
  return <icosahedronGeometry args={[radius, detail]} />;
}

function Earth() {
  const [map, bumpMap, specularMap, lightsMap, cloudMap, cloudMapAlpha] = useLoader(
    TextureLoader,
    [
      "src/textures/8k_earth_daymap.jpg",
      "src/textures/earthbump1k.jpg",
      "src/textures/earthspec1k.jpg",
      "src/textures/8k_earth_nightmap.jpg",
      "src/textures/white-sprite.png",
      "src/textures/8k_earth_clouds_alpha.jpg",
    ]
  );

  const earthMeshRef = useRef<Mesh>(null);
  const lightsMeshRef = useRef<Mesh>(null);
  const cloudsMeshRef = useRef<Mesh>(null);
  const cloudsMeshRef2 = useRef<Mesh>(null);
  const glowMeshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!earthMeshRef.current) return;
    earthMeshRef.current.rotation.y += 0.1 * delta;
    if (!lightsMeshRef.current) return;
    lightsMeshRef.current.rotation.y += 0.1 * delta;
    if (!cloudsMeshRef.current) return;
    cloudsMeshRef.current.rotation.y += 0.12 * delta;
    if (!cloudsMeshRef2.current) return;
    cloudsMeshRef2.current.rotation.y += 0.12 * delta;
    if (!glowMeshRef.current) return;
    glowMeshRef.current.rotation.y += 0.1 * delta; 
  });

  return (
    <group rotation={[0, 0, -23.4 * Math.PI / 180]}>
      <mesh ref={earthMeshRef}>
        <EarthGeometry />
        <meshPhongMaterial
          bumpMap={bumpMap}
          bumpScale={0.04}
          map={map}
          specularMap={specularMap}
        />
      </mesh>

      <mesh ref={lightsMeshRef}>
        <EarthGeometry />
        <meshBasicMaterial
          blending={AdditiveBlending}
          map={lightsMap}
        />
      </mesh>

      <mesh scale={1.003} ref={cloudsMeshRef} visible={false}>
        <EarthGeometry />
        <CloudMat alphaMap={cloudMapAlpha} />
      </mesh>

      <mesh scale={1.003} ref={cloudsMeshRef2}>
        <EarthGeometry />
        <meshStandardMaterial
          alphaMap={cloudMapAlpha}
          blending={AdditiveBlending}
          map={cloudMap}
          transparent={true}
        />
      </mesh>

      <mesh scale={1.01} ref={glowMeshRef}>
        <EarthGeometry />
        <FresnelMat />
      </mesh>


    </group>
  )
}

function Sun() {
  return (
    <directionalLight color="white" intensity={2} position={[1, 1, 1]} />
  )
}

export function FiberEarth() {
  return (
    <Suspense fallback={<h2>loading...</h2>}>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Earth />
        <Sun />
        <OrbitControls />
      </Canvas>
    </Suspense>
  )
}
