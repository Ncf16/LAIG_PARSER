
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;
uniform float max;

void main() {
	vec3 offset=vec3(0.0,0.0,0.0);
	vec3 invert=vec3(1.0,1.0,1.0);
	vTextureCoord = aTextureCoord;

	offset=aVertexNormal*texture2D(uSampler2,vTextureCoord).rgb;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset*max, 1.0);
}

