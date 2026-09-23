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
        }
        else if(this.keys.has('ArrowRight') || this.keys.has('d')){
            this.x += this.speed;
        }

        this.theta += 0.8;
        this.helicopterBody.update(m4.translate(m4.identity(), this.x, this.y, 0.0));
        this.helicopterTopShaft.update(m4.translate(m4.identity(), this.x, this.y, 0.0));
        this.helicopterTail.update(m4.translate(m4.identity(), this.x, this.y, 0.0));
        this.helicopterPropellers.update(m4.translate(m4.yRotate(m4.translate(m4.identity(), 0.0, -0.325, 0.0), this.theta), 0.0+this.x, 0.325+this.y, 0.0));
        this.helicopterTailPropeller.update(m4.translate(m4.zRotate(m4.translate(m4.identity(), -0.7, 0.0, 0.0), this.theta), 0.7+this.x, 0.0+this.y, 0.0));


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