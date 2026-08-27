const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VERTICES
// --------------------------------------------------
//desenhado com geogebra
const vertices = new Float32Array([
    // cabeca
    -4,4,
    -4,10,
    4,10,

    4,10,
    -4,4,
    4,4,

    // sirene cabeca
    -1.2, 10,
    1.2, 10,
    -1.2, 12,

    -1.2, 12,
    1.2, 10,
    1.2, 12,

    // olho esquerdo
    -2.6,8,
    -1.4,8,
    -2.6,7,

    -2.6,7,
    -1.4,8,
    -1.4,7,

    // olho direito
    2.6,8,
    1.4,8,
    2.6,7,

    2.6,7,
    1.4,8,
    1.4,7,

    //boquinha
    -2.8,6,
    -2.8,5,
    2.8,5,

    2.8,5,
    2.8,6,
    -2.8,6,


    //"orelha" esquerda
    -4,8,
    -6,8,
    -6,6,

    -4,8,
    -6,6,
    -4,6,

    //"orelha" direita
    4,8,
    6,8,
    6,6,

    4,8,
    6,6,
    4,6,

    //pescoço
    -1,4,
    1,4,
    -1,2.5,

    -1,2.5,
    1,2.5,
    1,4,

    //torso
    -4,2.5,
    4,2.5,
    -4,-8,

    -4,-8,
    4,2.5,
    4,-8,

    //ombro esquerdo
    -4,2,
    -8,2,
    -8,0,

    -4,2,
    -4,0,
    -8,0,

    //ombro direito
    4,2,
    8,2,
    8,0,

    4,2,
    4,0,
    8,0,

    // braco esquerdo
    -5.6,0,
    -7,0,
    -7,-8,

    -7,-8,
    -5.6,-8,
    -5.6,0,

    // braco direito
    5.6,0,
    7,0,
    7,-8,

    7,-8,
    5.6,-8,
    5.6,0,

    // mao esquerda
    -8.5,-8,
    -8.5,-9.5,
    -7,-8,

    -8.5,-9.5,
    -7,-9.5,
    -7,-8,

    -7,-8,
    -7,-8.7,
    -5.6,-8,

    -5.6,-8,
    -7,-8.7,
    -5.6,-8.7,

    -5.6,-8,
    -4.8,-8,
    -4.8,-9.6,

    -5.6,-8,
    -5.6,-9.6,
    -4.8,-9.6,

    // mao direita
    8.5,-8,
    8.5,-9.5,
    7,-8,

    8.5,-9.5,
    7,-9.5,
    7,-8,

    7,-8,
    7,-8.7,
    5.6,-8,

    5.6,-8,
    7,-8.7,
    5.6,-8.7,

    5.6,-8,
    4.8,-8,
    4.8,-9.6,

    5.6,-8,
    5.6,-9.6,
    4.8,-9.6,

    // perna esquerda
    -3.2,-8,
    -1.4,-8,
    -3.2,-18,

    -3.2,-18,
    -1.4,-18,
    -1.4,-8,

    // perna direita
    3.2,-8,
    1.4,-8,
    3.2,-18,

    3.2,-18,
    1.4,-18,
    1.4,-8,

    // pe esquerdp
    -1, -18,
    -1,-20,
    -6,-20,

    -1, -18,
    -6,-20,
    -6,-18,

    // pe direito
    1, -18,
    1,-20,
    6,-20,

    1, -18,
    6,-20,
    6,-18,

]);


// --------------------------------------------------
// 1. CORES
// --------------------------------------------------

const colors = new Float32Array([
    //cabeca
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82, 
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82, 
    //sirene
    1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
    1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
    //olhos
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,

    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    //boca
    1.0,1.0,1.0, 1.0,1.0,1.0, 1.0,1.0,1.0,
    1.0,1.0,1.0, 1.0,1.0,1.0, 1.0,1.0,1.0,
    //orelhas
    1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
    1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,

    1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
    1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
    //pescoco
    0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0,
    0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0,
    //torso
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    //ombros
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    //bracos
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    //maos
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    //pernas
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    //pes
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,

    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,
    0.82,0.82,0.82, 0.82,0.82,0.82, 0.82,0.82,0.82,


])


// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
);

const colorsBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    colors,
    gl.STATIC_DRAW
);


// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;

void main() {
    gl_Position = vec4(
    aPosition.x / 15.0,
    aPosition.y / 25.0,
    0.0,
    1.0
);
    vColor = aColor;
}

`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
}

`;


// --------------------------------------------------
// 5. COMPILAR SHADERS
// --------------------------------------------------

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        const error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

const colorLocation =
    gl.getAttribLocation(
        program,
        "aColor"
    );


// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
// --------------------------------------------------

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.enableVertexAttribArray(colorLocation);

gl.vertexAttribPointer(
    colorLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
);


// --------------------------------------------------
// 9. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

gl.useProgram(program);

const numComponents = 2;

gl.drawArrays(
    gl.TRIANGLES,
    0,
    1000
);