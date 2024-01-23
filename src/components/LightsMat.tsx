import { forwardRef } from 'react';
import {
  AdditiveBlending,
  Texture,
} from 'three';

const vs = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal); // Transform the normal to view space
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0); // Transform the vertex position to view space
  vViewPosition = viewPosition.xyz;
  gl_Position = projectionMatrix * viewPosition;
}`;

const fs = `
uniform sampler2D earthTexture;
uniform sampler2D cityLightsTexture;
uniform vec3 lightDirection;
uniform vec3 cameraPos;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
  vec3 viewLightDirection = normalize((viewMatrix * vec4(lightDirection, 0.0)).xyz); // Transform light direction to view space
  float lightIntensity = dot(normalize(vNormal), -viewLightDirection);
  vec4 earthColor = texture2D(earthTexture, vUv);
  vec4 cityLightsColor = texture2D(cityLightsTexture, vUv);
  if (lightIntensity > 0.0) {
    gl_FragColor = cityLightsColor;
  } else {
      // gl_FragColor = mix(earthColor, cityLightsColor, -lightIntensity); // Blend with city lights
    gl_FragColor = vec4(0.); // Earth texture in daylight
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
    lightDirection: { type: "v3", value: [1,0,0] }
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


