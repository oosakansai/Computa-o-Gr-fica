const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


const canvasCoordinates =
    document.getElementById(
        "canvasCoordinates"
    );

const webglCoordinates =
    document.getElementById(
        "webglCoordinates"
    );

const colorBox =
    document.getElementById(
        "colorBox"
    );

const colorName =
    document.getElementById(
        "colorName"
    );


// --------------------------------------------------
// 1a. VERTICES
// --------------------------------------------------

let vertices = [0.0, 0.0];


// --------------------------------------------------
// 1b. CORES
// --------------------------------------------------

let colors = new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0]);

// --------------------------------------------------
// 1c. TAMANHO DOS PONTOS
// --------------------------------------------------

let pointSizes = new Float32Array([10.0, 10.0]);
let pointSizes_aux = 10.0;

// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW
);

// para o segundo ponto
const verticesBuffer2 = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer2);

gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW
);

const colorsBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    colors,
    gl.STATIC_DRAW
);

const pointSizesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    pointSizes,
    gl.STATIC_DRAW
);

// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;
in float aPointSize;

out vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    gl_PointSize = aPointSize;
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

const pointSizeLocation =
    gl.getAttribLocation(
        program,
        "aPointSize"
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

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.enableVertexAttribArray(pointSizeLocation);

gl.vertexAttribPointer(
    pointSizeLocation,
    1,
    gl.FLOAT,
    false,
    0,
    0
);

// --------------------------------------------------
// pré-9: Algoritmo de Bresenham
// --------------------------------------------------
function writePixel(x, y) {

    const webglX = (x / canvas.width) * 2 - 1;
    const webglY = -((y / canvas.height) * 2 - 1);

    vertices.push(webglX, webglY);
}

function bresenham(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    const sx = dx >= 0 ? 1 : -1;
    const sy = dy >= 0 ? 1 : -1;

    dx = Math.abs(dx);
    dy = Math.abs(dy);

    let x = x1;
    let y = y1;

    writePixel(x, y);

    if (dx >= dy) {
        // linha mais horizontal que vertical
        let p = 2 * dy - dx;
        const incInf = 2 * dy;
        const incSup = 2 * (dy - dx);

        for (let i = 0; i < dx; i++) {
            if (p < 0) {
                p += incInf;
            } else {
                p += incSup;
                y += sy;
            }
            x += sx;
            writePixel(x, y);
        }
    } else {
        // linha mais vertical que horizontal (troca papéis de x e y)
        let p = 2 * dx - dy;
        const incInf = 2 * dx;
        const incSup = 2 * (dx - dy);

        for (let i = 0; i < dy; i++) {
            if (p < 0) {
                p += incInf;
            } else {
                p += incSup;
                x += sx;
            }
            y += sy;
            writePixel(x, y);
        }
    }
}

// --------------------------------------------------
// 9. INTERAÇÃO COM O MOUSE
// --------------------------------------------------

canvas.addEventListener("mousedown",mouseClick,false);
    let x1, y1, x2, y2;
    let nCliques = 0;
    
function mouseClick(event){

    // Posição do clique em pixels
    const x = event.offsetX;
    const y = event.offsetY;

    canvasCoordinates.textContent =
        `Canvas: (${x}, ${y})`;

    // Converter X para o intervalo [-1, 1]
    const webglX =
        (x / canvas.width) * 2 - 1;

    // Converter Y para o intervalo [-1, 1]
    // O sinal é invertido porque o eixo Y do canvas
    // cresce para baixo e o do WebGL cresce para cima
    const webglY =
        -((y / canvas.height) * 2 - 1);

    webglCoordinates.textContent =
        `WebGL: (${webglX.toFixed(3)}, ${webglY.toFixed(3)})`;


    // Atualizar o vetor de vértices
    if (nCliques === 0) {

        x1 = x;
        y1 = y;

        vertices = [];

        vertices.push(webglX, webglY);

        nCliques = 1;

    } else {

        x2 = x;
        y2 = y;

        bresenham(x1, y1, x2, y2);

        nCliques = 0;
    }

    gl.bindBuffer(
        gl.ARRAY_BUFFER, 
        verticesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(vertices), 
        gl.STATIC_DRAW
    );

    drawScene();
}

// --------------------------------------------------
// 10. INTERAÇÃO COM O TECLADO
// --------------------------------------------------

document.addEventListener(
  "keydown",
  keyboardClick,
  false
);

function keyboardClick(event) {

  switch(event.key) {
      case "ArrowUp":
        pointSizes_aux += 5.0;
        pointSizes = new Float32Array([pointSizes_aux])
        break;
      case "ArrowDown":
        pointSizes_aux -= 5.0;
        if (pointSizes_aux < 1.0) {
          pointSizes_aux = 1.0;
        }
        pointSizes = new Float32Array([pointSizes_aux])
        break;
      case "0":
          colors = new Float32Array([
              1.0, 1.0, 1.0
          ]);
          colorBox.style.backgroundColor = "white";
          break;

      case "1":
          colors = new Float32Array([
              1.0, 0.0, 0.0
          ]);
          colorBox.style.backgroundColor = "red";
          break;

      case "2":
          colors = new Float32Array([
              0.0, 1.0, 0.0
          ]);
          colorBox.style.backgroundColor = "green";
          break;

      case "3":
          colors = new Float32Array([
              0.0, 0.0, 1.0
          ]);
          colorBox.style.backgroundColor = "blue";
          break;

      case "4":
          colors = new Float32Array([
              1.0, 1.0, 0.0
          ]);
          colorBox.style.backgroundColor = "yellow";
          break;

      case "5":
          colors = new Float32Array([
              1.0, 0.0, 1.0
          ]);
          colorBox.style.backgroundColor = "magenta";
          break;

      case "6":
          colors = new Float32Array([
              0.0, 1.0, 1.0
          ]);
          colorBox.style.backgroundColor = "cyan";
          break;

      case "7":
          colors = new Float32Array([
              1.0, 0.5, 0.0
          ]);
          colorBox.style.backgroundColor = "orange";
          break;

      case "8":
          colors = new Float32Array([
              0.5, 0.0, 1.0
          ]);
          colorBox.style.backgroundColor = "purple";
          break;

      case "9":
          colors = new Float32Array([
              1.0, 0.4, 0.7
          ]);
          colorBox.style.backgroundColor = "pink";
          break;

      default:
          return;
  }

  // Atualizar o buffer de cores
  gl.bindBuffer(
      gl.ARRAY_BUFFER,
      colorsBuffer
  );

  gl.bufferData(
      gl.ARRAY_BUFFER,
      colors,
      gl.STATIC_DRAW
  );

  // Redesenhar
  drawScene();
}

// --------------------------------------------------
// 11. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 12. DESENHAR
// --------------------------------------------------

const numComponents = 2;

gl.useProgram(program);

function drawScene() {
    const numVerts = vertices.length / numComponents;

    // Repetir a cor atual para cada vértice
    const colorArray = new Float32Array(numVerts * 3);
    for (let i = 0; i < numVerts; i++) {
        colorArray[i * 3]     = colors[0];
        colorArray[i * 3 + 1] = colors[1];
        colorArray[i * 3 + 2] = colors[2];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STATIC_DRAW);

    // Repetir o tamanho atual para cada vértice
    const sizeArray = new Float32Array(numVerts);
    sizeArray.fill(pointSizes_aux);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizeArray, gl.STATIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.drawArrays(gl.POINTS, 0, numVerts);
}

drawScene();