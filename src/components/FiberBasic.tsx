import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

function Box() {
  const boxMeshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!boxMeshRef.current) return;
    boxMeshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={boxMeshRef}>
      <boxGeometry />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

export function FiberBasic() {
  return (
    <Canvas camera={{ position: [0, 1, 2] }}>
      <Box />
      <directionalLight color="white" intensity={2} position={[1, 1, 1]} />
    </Canvas>
  );
}
