import { AdditiveBlending, Texture, WebGLProgramParametersWithUniforms } from 'three';

const vs = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fs = `
uniform sampler2D alphaMap;
uniform float brightness;
varying vec2 vUv;

void main() {
  vec4 texel = texture2D(alphaMap, vUv);

  // Convert the texel color to grayscale using the luminosity method
  float grayscale = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
    
  // Adjust grayscale with brightness to get alpha
  float alpha = grayscale * brightness;

  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha); }
`;

export function CloudMat({ alphaMap }: { alphaMap: Texture }) {
  const onBeforeCompile = function(shader: WebGLProgramParametersWithUniforms) {
    // Add custom uniforms
    shader.uniforms.alphaMap = { value: alphaMap };
    shader.uniforms.brightness = { value: 2 };

    shader.vertexShader = `#define USE_UV\n` + shader.vertexShader;

    // Add uniform declarations to the fragment shader
    shader.fragmentShader = `
      #define USE_UV
      uniform sampler2D alphaMap;
      uniform float brightness;
    ` + shader.fragmentShader;

    console.log(shader.fragmentShader);

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `
      vec4 texel = texture2D(alphaMap, vUv);
      float grayscale = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      float alpha = grayscale * brightness;
      diffuseColor.a = alpha;
      //gl_FragColor = vec4( outgoingLight, diffuseColor.a * alpha );
      gl_FragColor = vec4(outgoingLight * vec3(1.0, 1.0, 1.0) * brightness, alpha);
      #include <dithering_fragment>
    `);
  };

  return (
    <meshStandardMaterial
      blending={AdditiveBlending}
      onBeforeCompile={(shader) => onBeforeCompile(shader)}
    />
  );
}

    // <shaderMaterial
    //   blending={AdditiveBlending}
    //   fragmentShader={fs}
    //   transparent={true}
    //   uniforms={uniforms}
    //   vertexShader={vs}
    // />
    //
