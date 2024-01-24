import { Suspense, useRef } from 'react';
import { AdditiveBlending, Color, DirectionalLight, Mesh, PerspectiveCamera, ShaderMaterial, TextureLoader, Vector3 } from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { FresnelMat } from './FresnelMat';
import { CloudMat } from './CloudMat';
import { LightsMat } from './LightsMat';

const radius = 1;
const detail = 12;
const background = new Color("black");
const directionalLightPos = new Vector3(1, 0, 0);
const rotationSpeed = 0.05;

function EarthGeometry() {
  return <icosahedronGeometry args={[radius, detail]} />;
}

function Earth({ camera, light }: { camera: PerspectiveCamera; light: DirectionalLight | null }) {
  const [
    map,
    bumpMap,
    specularMap,
    lightsMap,
    cloudMap,
    cloudMapAlpha
  ] = useLoader(
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
  const lightsMeshRef2 = useRef<Mesh>(null);
  const lightsMatRef = useRef<ShaderMaterial>(null);
  const cloudsMeshRef = useRef<Mesh>(null);
  const cloudsMeshRef2 = useRef<Mesh>(null);
  const glowMeshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!earthMeshRef.current) return;
    earthMeshRef.current.rotation.y += rotationSpeed * delta;
    if (!lightsMeshRef.current) return;
    lightsMeshRef.current.rotation.y += rotationSpeed * delta;
    if (!lightsMeshRef2.current) return;
    lightsMeshRef2.current.rotation.y += rotationSpeed * delta;
    if (!cloudsMeshRef.current) return;
    cloudsMeshRef.current.rotation.y += (rotationSpeed + 0.001) * delta;
    if (!cloudsMeshRef2.current) return;
    cloudsMeshRef2.current.rotation.y += (rotationSpeed + 0.001) * delta;
    if (!glowMeshRef.current) return;
    glowMeshRef.current.rotation.y += rotationSpeed * delta;
    if (!lightsMatRef.current || !light) return;
    lightsMatRef.current.uniforms.lightDirection.value =
      light.position.normalize();
    lightsMatRef.current.uniforms.cameraPos.value =
      camera.position.normalize();
  });

    // Adjust for axial tilt
    // <group rotation={[0, 0, -23.4 * Math.PI / 180]}>
  return (
    <group>
      <mesh ref={earthMeshRef} visible={true}>
        <EarthGeometry />
        <meshPhongMaterial
          bumpMap={bumpMap}
          bumpScale={0.04}
          map={map}
          specularMap={specularMap}
        />
      </mesh>

      <mesh ref={lightsMeshRef} visible={false}>
        <EarthGeometry />
        <meshBasicMaterial
          blending={AdditiveBlending}
          map={lightsMap}
        />
      </mesh>

      <mesh ref={lightsMeshRef2} visible={true}>
        <EarthGeometry />
        <LightsMat 
          earthTexture={map}
          cityLightsTexture={lightsMap}
          ref={lightsMatRef}
        />
      </mesh>

      <mesh scale={1.003} ref={cloudsMeshRef} visible={false}>
        <EarthGeometry />
        <CloudMat alphaMap={cloudMapAlpha} />
      </mesh>

      <mesh scale={1.003} ref={cloudsMeshRef2} visible={true}>
        <EarthGeometry />
        <meshStandardMaterial
          alphaMap={cloudMapAlpha}
          blending={AdditiveBlending}
          map={cloudMap}
          transparent={true}
        />
      </mesh>

      <mesh scale={1.01} ref={glowMeshRef} visible={false}>
        <EarthGeometry />
        <FresnelMat />
      </mesh>


    </group>
  )
}

const camera = new PerspectiveCamera(75, 0, 0.1, 1000);
camera.position.z = 2;
camera.lookAt(0, 0, 0);

export function FiberEarth() {
  const lightRef = useRef<DirectionalLight>(null);

  return (
    <Suspense fallback={<h2>loading...</h2>}>
      <Canvas
        camera={camera}
        scene={{ background }}
      >
        <Earth camera={camera} light={lightRef.current}/>
        <directionalLight
          color="white"
          intensity={2}
          position={directionalLightPos}
          ref={lightRef}
        />
        <OrbitControls />
        <axesHelper args={[3]} />
      </Canvas>
    </Suspense>
  )
}
