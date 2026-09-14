function helloTriangle() {
    const canvas = document.getElementById("canvas");
    if(!canvas){
        console.log("Canvas não encontrado");
        return;
    }

    const gl = canvas.getContext("webgl2");
    if(!gl){
        console.log("WebGL2 não suportado");
        return;
    }

    // limpeza do canva
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // vertices do triangulo, array que representa os dados que serão enviados para o GPU
    const triangleVertices = [
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]
    // Javascript gosta de usar floats de 64 bits, mas o WebGL2 trabalha com floats de 32 bits, então precisamos converter
    const triangleVertices32 = new float32Arrsy(triangleVertices); 

    // o GPU nao consegue ler variaveis do JS, entao precisamos enviar os dados para ele. Para isso, criamos um buffer de memoria no GPU e enviamos os dados para ele
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices32, gl.STATIC_DRAW);


    // in: fala "esse é um atributo que pegamos de algum buffer de memoria"
    // 2 em vec 2 pq estamos trabalhando com 2 dimensoes (x, y)
    // gl_Position: todo vertex shader tem esse atributo, que é a posição do vertice na tela. Ele é um vec4, mas como estamos trabalhando com 2 dimensoes, podemos colocar 0.0 e 1.0 nos outros dois valores
    const vertexShaderSourceCode = `#version 300 es 
    precision mediump float;
    in vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }`;

    //mandar para o GPU -> criar o shader, setar o codigo e compilar
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);


    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        showError("Erro na compilação do vertex shader:", gl.getShaderInfoLog(vertexShader));
        return;
    }

    //fragment shader
    const fragmentShaderSourceCode = `#version 300 es 
    precision mediump float;
    out vec4 fragColor;
    void main() {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }`;

    //mandar para o GPU -> criar o shader, setar o codigo e compilar
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);


    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        showError("Erro na compilação do fragment shader:", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // criar um programa e juntar os shaders
    const triangleShaderProgram = gl.createprogram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);
    gl.linkProgram(triangleShaderProgram);

    if(!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)){
        showError("Erro na linkagem do programa:", gl.getProgramInfoLog(triangleShaderProgram));
        return;
    }

    const positionAttributeLocation = gl.getAttribLocation(triangleShaderProgram, "position");
    if(positionAttributeLocation === -1){
        showError("Erro ao pegar a localização do atributo position");
        return;
    }

    // output merger
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
try{
    helloTriangle();
} catch (error) {
    console.log("Erro:", error);
}