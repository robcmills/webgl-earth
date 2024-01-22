import { forwardRef } from 'react';
import {
  AdditiveBlending,
  DirectionalLight,
  Texture,
} from 'three';

const vs = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fs = `
uniform sampler2D earthTexture;
uniform sampler2D cityLightsTexture;
uniform vec3 lightDirection;
uniform vec3 cameraPos;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec3 viewDirection = normalize(cameraPos - vPosition);
  float lightIntensity = dot(normalize(vNormal), lightDirection);
  vec4 earthColor = texture2D(earthTexture, vUv);
  vec4 cityLightsColor = texture2D(cityLightsTexture, vUv);
  if (lightIntensity > 0.0) {
    gl_FragColor = earthColor; // Earth texture in daylight
  } else {
    // gl_FragColor = mix(earthColor, cityLightsColor, -lightIntensity);
    gl_FragColor = cityLightsColor;
  }
}`;

export const LightsMat = forwardRef(({
  earthTexture,
  cityLightsTexture,
}: {
  earthTexture: Texture;
  cityLightsTexture: Texture;
}, ref: any) => {
  console.log('LightsMat');

  const uniforms = {
    cameraPos: { type: "v3", value: [0,0,2] },
    earthTexture: { type: "t", value: earthTexture },
    cityLightsTexture: { type: "t", value: cityLightsTexture },
    lightDirection: { type: "v3", value: [1,1,1] }
  };

  return (
    <shaderMaterial
      blending={AdditiveBlending}
      fragmentShader={fs}
      ref={ref}
      transparent={true}
      uniforms={uniforms}
      vertexShader={vs}
    />
  );
});


