const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

uniform mat3 u_viewTransform;
uniform mat3 u_modelTransform;

void main() {

    vec3 position =
        u_viewTransform *
        u_modelTransform *
        vec3(aPosition, 1.0);

    gl_Position =
        vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {

    outColor =
        vec4(uColor, 1.0);
}
`;

function createShader(gl, type, source) {

    const shader =
        gl.createShader(type);

    gl.shaderSource(
        shader,
        source
    );

    gl.compileShader(shader);

    if (
        !gl.getShaderParameter(
            shader,
            gl.COMPILE_STATUS
        )
    ) {

        const error =
            gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}

function createProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource
) {

    const vertexShader =
        createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexShaderSource
        );

    const fragmentShader =
        createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );

    const program =
        gl.createProgram();

    gl.attachShader(
        program,
        vertexShader
    );

    gl.attachShader(
        program,
        fragmentShader
    );

    gl.linkProgram(program);

    if (
        !gl.getProgramParameter(
            program,
            gl.LINK_STATUS
        )
    ) {

        throw new Error(
            gl.getProgramInfoLog(program)
        );
    }

    return program;
}


const program =
    createProgram(
        gl,
        vertexShaderSource,
        fragmentShaderSource
    );


// ==================================================
// CLASSE RENDERER
// ==================================================

class Renderer {

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.positionLocation =
            gl.getAttribLocation(
                program,
                "aPosition"
            );

        this.colorLocation =
            gl.getUniformLocation(
                program,
                "uColor"
            );

        this.viewTransformLocation =
            gl.getUniformLocation(
                program,
                "u_viewTransform"
            );

        this.modelTransformLocation =
            gl.getUniformLocation(
                program,
                "u_modelTransform"
            );

        this.viewTransform =
            m3.identity();

        this.verticesBuffer =
            gl.createBuffer();
    }

    defineViewTransform(viewTransform) {
        this.viewTransform =
            viewTransform;
    }

    draw(object) {
        const gl = this.gl;

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.verticesBuffer
        );

        gl.bufferData(
            gl.ARRAY_BUFFER,
            object.vertices,
            gl.STATIC_DRAW
        );

        gl.enableVertexAttribArray(
            this.positionLocation
        );

        gl.vertexAttribPointer(
            this.positionLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.uniform3fv(
            this.colorLocation,
            object.color
        );

        gl.uniformMatrix3fv(
            this.modelTransformLocation,
            false,
            object.modelTransform
        );

        gl.uniformMatrix3fv(
            this.viewTransformLocation,
            false,
            this.viewTransform
        );

        gl.drawArrays(
            gl.TRIANGLES,
            0,
            object.vertices.length / 2
        );
    }
}

// ==================================================
// AUXILIARY FUNCTIONS
// ==================================================

function rectangleVertices(x,y,width,height){
    return [
        x, y,
        x+width, y+height,
        x, y+height,

        x, y,
        x+width, y,
        x+width, y+height
    ];
}

function SirenesVertices() {
    const vertices = [];
    // fica no topo da cabeça
    vertices.push(...rectangleVertices(
        -0.075, -0.0625,
        0.15, 0.125
    ));

    return new Float32Array(vertices);
}


function CabecaPescocoVertices() {
    const vertices = [];

    vertices.push(...rectangleVertices(
        -0.25, -0.1875,
        0.5, 0.375
    ));

    vertices.push(...rectangleVertices(
        -0.0625, -0.26,
        0.125, 0.09375
    ));

    return new Float32Array(vertices);
}


function OlhoVertices() {
    const vertices = [];

    vertices.push(...rectangleVertices(
        -0.0375, -0.03125,
        0.075, 0.0625
    ));

    return new Float32Array(vertices);
}


function TorcoVertices() {
    const vertices = [];

    vertices.push(...rectangleVertices(
        -0.25, -0.2,
        0.5, 0.57
    ));

    return new Float32Array(vertices);
}


function BocaVertices() {
    const vertices = [];

    vertices.push(...rectangleVertices(
        -0.175, -0.03,
        0.35, 0.06
    ));

    return new Float32Array(vertices);
}


function BracoVertices() {
    // ombro, braço e a mão. O braço default é o esquerdo
    const vertices = [];

    vertices.push(...rectangleVertices(
        -0.125, 0.15,
        0.25, 0.125
    ));

    vertices.push(...rectangleVertices(
        -0.06, -0.25,
        0.1, 0.5
    ));

    vertices.push(...rectangleVertices(
        -0.13, -0.3,
        0.21, 0.1
    ));

    return new Float32Array(vertices);
}


function PernaVertices() {
    //perna, pé. A perna default é a esquerda!
    const vertices = [];

    vertices.push(...rectangleVertices(
        -0.02, 0,
        0.1125, 0.47
    ));

    vertices.push(...rectangleVertices(
        -0.15625, -0.125,
        0.25, 0.125
    ));

    return new Float32Array(vertices);
}



// ==================================================
// CLASSE SCENE OBJECT
// ==================================================

class SceneObject {

    constructor(vertices, color, xPosition = 0, yPosition = 0) {

        this.vertices = vertices;
        this.color = color;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.modelTransform = m3.identity();
    }

    updateModelTransform(roboModelTransform) {
        const localTransform =
            m3.translation(this.xPosition, this.yPosition);

        this.modelTransform =
            m3.multiply(
                roboModelTransform,
                localTransform
            );
    }
}



// ==================================================
// CLASSES "NORMAIS"
// ==================================================

class Sirenes extends SceneObject {
    constructor(color, xPosition, yPosition) {
        super(
            SirenesVertices(), color, xPosition, yPosition
        );
    }
}

class CabecaPescoco extends SceneObject {
    constructor(color, xPosition, yPosition) {
        super(
            CabecaPescocoVertices(), color, xPosition, yPosition
        );
    }
}

class Torco extends SceneObject {
    constructor(color, xPosition, yPosition) {
        super(
            TorcoVertices(), color, xPosition, yPosition
        );
    }
}

class Boca extends SceneObject {
    constructor(color, xPosition, yPosition) {
        super(
            BocaVertices(), color, xPosition, yPosition
        );
    }

}


// ==================================================
// CLASSES QUE PRECISAM DE ESPELHAMENTO E TRANSlAÇÃO
// ==================================================
class Olho extends SceneObject {
    constructor(color, xPosition, yPosition) {
        super(
            OlhoVertices(), color, xPosition, yPosition
        );
    }
}

class Membro extends SceneObject { // estou usando como classe intermediária para o braço e a perna, já que os dois são os únicos que rotacionam.
    constructor(vertices, color, xPosition, yPosition, xEspelhado, maxAngleDenominador, velocidade) {
        super(vertices, color, xPosition, yPosition);
        this.xEspelhado = xEspelhado;
        this.theta = 0.0;
        this.maxAngle = Math.PI / maxAngleDenominador;   
        this.direction = 1;           
        this.velocidade = velocidade;            
        this.active = false;          
    }

    startSwing() {
        this.active = true;
        this.direction = 1;
    }

    updateRotation() {
        if (!this.active) return;

        this.theta += this.direction * this.velocidade;

        // chegou no máximo → começa a voltar
        if (this.theta >= this.maxAngle) {
            this.theta = this.maxAngle;
            this.direction = -1;
        }

        // voltou para zero → termina o ciclo
        if (this.theta <= 0) {
            this.theta = 0;
            this.active = false;
        }
    }

    isFinished() {
        return !this.active;
    }

    updateModelTransform(roboModelTransform) {
        const espelhar = m3.scaling(this.xEspelhado, 1);
        const transladar = m3.translation(this.xPosition, this.yPosition);
        const rotacionar = m3.rotation(-this.theta);
        const localTransform = 
        m3.multiply(transladar, m3.multiply(espelhar, rotacionar)
        );

        this.modelTransform =
            m3.multiply(
                roboModelTransform,
                localTransform
            );
    }
}

class Braco extends Membro {
    constructor(color, xPosition, yPosition, xEspelhado) {
        super(BracoVertices(), color, xPosition, yPosition, xEspelhado, 6, 0.02);
    }
}

class Perna extends Membro {
    constructor(color, xPosition, yPosition, xEspelhado) {
        super(PernaVertices(), color, xPosition, yPosition, xEspelhado, 16, 0.04);
    }
}


class Robo {

    constructor(tx, ty, sireneColor, cabecaPescocoColor, torcoColor, bocaColor, olhoColor, bracoColor, pernaColor) {

        this.tx = tx;
        this.ty = ty;

        this.sirenes = new Sirenes(sireneColor, 0, 0.6875);
        this.cabecaPescoco = new CabecaPescoco(cabecaPescocoColor, 0, 0.45);
        this.torco = new Torco(torcoColor, 0, -0.171875);
        this.boca = new Boca(bocaColor, 0, 0.34375);

        this.olhoEsquerdo = new Olho(olhoColor, -0.125, 0.46875);
        this.olhoDireito = new Olho(olhoColor, 0.125, 0.46875);
        this.bracoEsquerdo = new Braco(bracoColor, -0.375, -0.1, 1);
        this.bracoDireito = new Braco(bracoColor, 0.375, -0.1, -1);
        this.pernaEsquerda = new Perna(pernaColor, -0.14375, -0.75, 1);
        this.pernaDireita = new Perna(pernaColor, 0.14375, -0.75, -1);

        this.pernaAtiva = null;
        this.bracoAtivo = null;
    }

    animar(membroAtivo, membroEsquerdo, membroDireito, roboModelTransform){
        if (this[membroAtivo] === null) {
        membroEsquerdo.startSwing();
        this[membroAtivo] = "esquerda";
        }

        membroEsquerdo.updateRotation();
        membroDireito.updateRotation();

        if (this[membroAtivo] === "esquerda" && membroEsquerdo.isFinished()) {
            membroDireito.startSwing();
            this[membroAtivo] = "direita";
        } 
        else if (this[membroAtivo] === "direita" && membroDireito.isFinished()) {
            membroEsquerdo.startSwing();
            this[membroAtivo] = "esquerda";
        }

        membroEsquerdo.updateModelTransform(roboModelTransform);
        membroDireito.updateModelTransform(roboModelTransform);
    }

    move() {

        const roboModelTransform = m3.translation(this.tx, this.ty);

        this.sirenes.updateModelTransform(roboModelTransform);
        this.cabecaPescoco.updateModelTransform(roboModelTransform);
        this.torco.updateModelTransform(roboModelTransform);
        this.boca.updateModelTransform(roboModelTransform);
        this.olhoEsquerdo.updateModelTransform(roboModelTransform);
        this.olhoDireito.updateModelTransform(roboModelTransform);
        this.bracoEsquerdo.updateModelTransform(roboModelTransform);
        this.bracoDireito.updateModelTransform(roboModelTransform);

        // Pernas
        this.animar("pernaAtiva", this.pernaEsquerda, this.pernaDireita, roboModelTransform);

        //Braços
        this.animar("bracoAtivo", this.bracoEsquerdo, this.bracoDireito, roboModelTransform);
        
    }

    draw(renderer) {

        renderer.draw(this.sirenes);
        renderer.draw(this.cabecaPescoco);
        renderer.draw(this.boca);
        renderer.draw(this.olhoEsquerdo);
        renderer.draw(this.olhoDireito);
        renderer.draw(this.bracoEsquerdo);
        renderer.draw(this.bracoDireito);
        renderer.draw(this.pernaEsquerda);
        renderer.draw(this.pernaDireita);
        renderer.draw(this.torco);
    }
}


// ==================================================
// CLASSE SCENE
// ==================================================

class Scene {

    constructor(gl, program) {

        this.renderer = new Renderer(gl,program);

        this.viewTransform = m3.setClippingWindow(-2.0,-1.0,2.0,1.0);

        this.renderer.defineViewTransform(this.viewTransform);

        this.robos = [
            //tx, ty, sireneColor, cabecaPescocoColor, torcoColor, bocaColor, olhoColor, bracoColor, pernaColor
            new Robo(0, 0, new Float32Array([1.0,0.0,0.0]) , new Float32Array([0.3,0.3,0.3]), new Float32Array([0.3,0.3,0.3]), 
            new Float32Array([1.0,1.0,1.0]), new Float32Array([1.0,1.0,0.0]), new Float32Array([1.0,0.0,0.0]), new Float32Array([1.0,0.0,0.0])),

            new Robo(1.3, 0, new Float32Array([0.0,1.0,0.0]) , new Float32Array([0.5,0.5,0.5]), new Float32Array([0.5,0.5,0.5]), 
            new Float32Array([1.0,1.0,1.0]), new Float32Array([1.0,1.0,0.0]), new Float32Array([0.0,1.0,0.0]), new Float32Array([0.0,1.0,0.0])),

            new Robo(-1.3, 0, new Float32Array([0.0,0.0,1.0]) , new Float32Array([0.6,0.6,0.6]), new Float32Array([0.6,0.6,0.6]), 
            new Float32Array([11.0,1.0,1.0]), new Float32Array([1.0,1.0,0.0]), new Float32Array([0.0,0.0,1.0]), new Float32Array([0.0,0.0,1.0])),

        ];
        
    }

    update() {

        for (const robo of this.robos) {
            robo.move();
        }
    }

    draw() {

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        for (const robo of this.robos) {
            robo.draw(this.renderer);
        }
    }

    execute() {

        this.update();

        this.draw();

        requestAnimationFrame(() => this.execute());
    }

    init() {

        requestAnimationFrame(() => this.execute());
    }
}


// ==================================================
// CONFIGURAÇÃO INICIAL DO WEBGL
// ==================================================

gl.clearColor(
    0.1,
    0.1,
    0.1,
    1.0
);

gl.viewport(
    0,
    0,
    canvas.width,
    canvas.height
);


// ==================================================
// CRIAR CENA
// ==================================================

const scene =
    new Scene(gl,program);


// ==================================================
// INICIAR ANIMAÇÃO
// ==================================================

scene.init();