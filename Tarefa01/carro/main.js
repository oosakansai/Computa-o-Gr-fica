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
    //lata
    -5.2,-0.9,
    -5.1,0.5,
    4.5,-0.9,

    -5.1,0.5,
    4.5,-0.9,
    4.4,0.4,

    -5.1,0.5,
    -2.8,1,
    4.4,0.4,

    //detalhes da frente
    -5.1,0.5,
    -5,0.7,
    -2.8,1,

    -5,0.7,
    -4.1,0.9,
    -2.8,1,
    //------

    -2.8,1,
    3.4,1,
    4.4,0.4,

    //detalhes parte de tras
    4.4,0.4,
    3.4,1,
    3.8,1,

    4.4,0.4,
    3.8,1,
    4.1,0.8,
    //----

    -2.8,1,
    -1.4,2.4,
    0.6,1,

    -1.4,2.4,
    0.6,1,
    0.6,2.5,

    0.6,1,
    0.6,2.5,
    2.4,2.4,

    0.6,1,
    3.4,1,
    2.4,2.4,

    //janela frente
    -2.5,1,
    -1.4,2.2,
    0.4,2.3,

    -2.5,1,
    0.4,1,
    0.4,2.3,

    //janela atras
    0.8,2.3,
    0.8,1,
    2.2,2.2,

    0.8,1,
    3,1,
    2.2,2.2,

    2.6,1.9,
    3,1,
    2.2,2.2,

    //roda frente
    -3.7,-1,
    -4.8,-0.6,
    -4.2,0,

    -3.7,-1,
    -4.2,0,
    -3.3,0,

    -3.7,-1,
    -3.3,0,
    -2.7,-0.6,

    -3.7,-1,
    -2.7,-1.5,
    -2.7,-0.6,

    -3.7,-1,
    -2.7,-1.5,
    -3.3,-2.1,

    -3.7,-1,
    -4.2,-2.1,
    -3.3,-2.1,

    -3.7,-1,
    -4.2,-2.1,
    -4.8,-1.5,

    -3.7,-1,
    -4.8,-0.6,
    -4.8,-1.5,

    //roda atras
    2.7,-1.1,
    1.7,-0.6,
    2.3,0,

    2.7,-1.1,
    3.2,0,
    2.3,0,

    2.7,-1.1,
    3.2,0,
    3.8,-0.6,

    2.7,-1.1,
    3.8,-1.5,
    3.8,-0.6,

    2.7,-1.1,
    3.8,-1.5,
    3.2,-2.1,

    2.7,-1.1,
    2.3,-2.1,
    3.2,-2.1,

    2.7,-1.1,
    2.3,-2.1,
    1.7,-1.5,

    2.7,-1.1,
    1.7,-0.6,
    1.7,-1.5,

]);


// --------------------------------------------------
// 1. CORES
// --------------------------------------------------

const colors = new Float32Array([
    //lata
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.4745, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    
    //janelas
    0.5647, 0.7216, 0.9765, 0.5647, 0.7216, 0.9765, 1,1,1,
    0.5647, 0.7216, 0.9765, 1,1,1, 0.5647, 0.7216, 0.9765,  
    0.5647, 0.7216, 0.9765, 0.5647, 0.7216, 0.9765, 0.5647, 0.7216, 0.9765,  
    1,1,1, 0.5647, 0.7216, 0.9765, 0.5647, 0.7216, 0.9765,  
    0.5647, 0.7216, 0.9765, 0.5647, 0.7216, 0.9765, 0.5647, 0.7216, 0.9765,
    
    //pneus
    0.0,0.0,0.0, 0.2,0.2,0.2, 0.2,0.2,0.2,
    0.0,0.0,0.0, 0.2,0.2,0.2, 0.2,0.2,0.2,
    0.0,0.0,0.0, 0.2,0.2,0.2, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.2,0.2,0.2, 0.0,0.0,0.0,

    0.0,0.0,0.0, 0.2,0.2,0.2, 0.2,0.2,0.2,
    0.0,0.0,0.0, 0.2,0.2,0.2, 0.2,0.2,0.2,
    0.0,0.0,0.0, 0.2,0.2,0.2, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0,
    0.0,0.0,0.0, 0.2,0.2,0.2, 0.0,0.0,0.0,
    
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
    aPosition.x / 10.0,
    aPosition.y / 10.0,
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