// ==================================================
// CLASS - SCENE
// ==================================================

class Scene {

    constructor(gl, program, keys) {

        this.renderer =
            new Renderer(gl, program);

        this.keys = keys;
        this.x = 0;
        this.y = 0;

        //espelhamento
        this.direction = 1;

        // Figura que será exibida
        this.helicopterBody = new HelicopterBody();

        this.helicopterTopShaft = new HelicopterTopShaft();

        this.helicopterTail = new HelicopterTail();

        this.helicopterPropellers = new HelicopterPropellers();

        this.helicopterTailPropeller = new HelicopterTailPropeller();

        this.theta = 0.0;
        this.speed = 0.03;
    }

    update() {

        if(this.keys.has('ArrowUp') || this.keys.has('w')){
            this.y += this.speed;
        }
        else if(this.keys.has('ArrowDown') || this.keys.has('s')){
            this.y -= this.speed;
        }
        else if(this.keys.has('ArrowLeft') || this.keys.has('a')){
            this.x -= this.speed;
            this.direction = 1;
        }
        else if(this.keys.has('ArrowRight') || this.keys.has('d')){
            this.x += this.speed;
            this.direction = -1;
        }

        this.theta += 0.01;
        this.helicopterBody.update(m4.translate(m4.identity(), this.x, this.y, 0.0));
        this.helicopterTopShaft.update(m4.translate(m4.identity(), this.x, this.y, 0.0));

        // operacao de dentro para fora
        this.helicopterPropellers.update(
            m4.translate(
                m4.yRotate(
                    m4.translate(m4.identity(), 0.0, -0.325, 0.0), 
                this.direction*this.theta), 
            0.0+this.x, 0.325+this.y, 0.0));
        
        this.helicopterTail.update(
            m4.translate(
                m4.scale(m4.identity(), this.direction,1,1), 
            this.x, this.y, 0.0));
        
        this.helicopterTailPropeller.update(
            m4.translate(
                m4.scale(
                    m4.zRotate(
                        m4.translate(m4.identity(), -0.7, 0.0, 0.0), 
                    this.direction*this.theta),
                1, 1, this.direction),
            this.direction*0.7+this.x, 0.0+this.y, 0.0));
        
        // esquerda e direita: o corpo e shaft permanecem inalterados.
        // precisa espelhar hélice pequena e o tail
        // a hélice pequena é o unico componente nao centralizado em z.
    }

    draw() {

        gl.clear(
            gl.COLOR_BUFFER_BIT |
            gl.DEPTH_BUFFER_BIT
        );

        gl.useProgram(program);

        this.helicopterBody.draw(
            this.renderer
        );

        this.helicopterTopShaft.draw(
            this.renderer
        );

        this.helicopterTail.draw(
            this.renderer
        );

        this.helicopterPropellers.draw(
            this.renderer
        );

        this.helicopterTailPropeller.draw(
            this.renderer
        );
    }

    execute() {

        this.update();
        this.draw();

        requestAnimationFrame(
            () => this.execute()
        );
    }

    init() {

        requestAnimationFrame(
            () => this.execute()
        );
    }
}