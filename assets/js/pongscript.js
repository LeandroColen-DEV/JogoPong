
    const canvasEl = document.querySelector("canvas"), 
        canvasCtx = canvasEl.getContext("2d")
        gapX = 10
    
    const mouse = {x: 0, y: 0}

    
    //Desenha o campo
    const field = {
        w: window.innerWidth,
        h: window.innerHeight,
        draw: function () {
            canvasCtx.fillStyle = "#286047"
            canvasCtx.fillRect(0, 0, this.w, this.h)
        }
    }

    //Desenha a linha central
    const line = {
        w: 15,
        h: field.h,
        draw: function () {
            canvasCtx.fillStyle = "#ffffff"
            canvasCtx.fillRect(field.w / 2 - this.w  / 2, 0, this.w, this.h)
        }
    }

    //Desenha e movimenta a raquete esquerda
    const leftPaddle = {
        x: gapX,
        y: 0,
        w: line.w,
        h: 200,
        _move: function(){
            this.y = mouse.y - this.h / 2
        },
        draw: function(){
            canvasCtx.fillStyle = "#ffffff"
            canvasCtx.fillRect(this.x, this.y, this.w, this.h)

            this._move()
        }
    }
    
    //Desenha e movimenta a raquete direita
    const rightPaddle = {
        x: field.w - line.w - gapX,
        y: 100,
        w: line.w,
        h: 200,
        _move: function(){
            this.y = ball.y
        },
        draw: function(){
            canvasCtx.fillStyle = "#ffffff"
            canvasCtx.fillRect(this.x, this.y, this.w, this.h)

            this._move()
        }
    }

    //Desenha o placar
    const score = {
        human: 0,
        computer: 0,
        increaseHuman: function(){
            this.human++
        },
        increaseComputer: function(){
            this.computer++
        },
        draw: function(){
            canvasCtx.font = "bold 50px Arial"
            canvasCtx.textAlign = "center"
            canvasCtx.textBaseline = "top"
            canvasCtx.fillStyle = "#000000"
            canvasCtx.fillText(this.human, field.w / 4, 40)
            canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 40)
        }
    }
    
    //Desenha e movimenta a bolinha
    const ball = {
        x: 0,
        y: 0,
        r: 10,
        speed: 3,
        directionX: 1,
        directionY: 1,

        _calcPosition: function(){
            //verifica se o jogador fez 1 ponto
            if (this.x > field.w - this.r - rightPaddle.w - gapX){
            //verifica se a raquete direita está na posição da bolinha
                if (this.y + this.r > rightPaddle.y &&
                    this.y - this.r < rightPaddle.y + rightPaddle.h)
                    {
                    //rebate a bola invertendo o sinal de X
                    this._reverseX()
                    } else {
                    //pontuar jogador 1
                    score.increaseHuman()
                    this._pointUp()
                    }
            }
            //verifica se o jogador 2 (computer) fez ponto
            if(this.x < this.r + leftPaddle.w + gapX){
            //verifica se a raquete esquerda está na posição Y da bolinha
                if(
                    this.y + this.r > leftPaddle.y &&
                    this.y - this.r < leftPaddle.y + leftPaddle.h
                ) {
                //rebate a bola invertendo o sinal de X
                    this._reverseX()   
                } else {
                    score.increaseComputer()
                    this._pointUp()
                }

            }
            //verifica colisão no eixo Y superior e inferior
            if(
            (this.y - this.r < 0 && this.directionY <0) ||
            (this.y > field.h - this.r && this.directionY > 0)
            ) {
                //rebate a bola invertendo o eixo y
                this._reverseY()
            }
        },
        _speedUp: function(){
            this.speed += 3
        },
        _pointUp: function(){
            this._speedUp()
            this.x = field.w / 2
            this.y = field.h / 2
        },
        _reverseX: function(){
            this.directionX *= -1
        },
        _reverseY: function(){
            this.directionY *= -1
        },
        _move: function(){
            this.x += this.directionX * this.speed
            this.y += this.directionY * this.speed
        },
        draw: function(){
            canvasCtx.fillStyle = "#ffffff"
            canvasCtx.beginPath()
            canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
            canvasCtx.fill()

            this._calcPosition()
            this._move()
        }

    }

    //Desenha o placar
    function setup(){
        canvasEl.width = canvasCtx.width = field.w
        canvasEl.height = canvasCtx.height = field.h
    }


    function draw(){
        field.draw()
        line.draw()

        leftPaddle.draw()
        rightPaddle.draw()

        score.draw()
        ball.draw()

    }

    //Framwork
    window.animateFrame = (function (){
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60)
            }
        )
    }) ()

    function main(){
        animateFrame(main)
        draw()
    }

    setup()
    main()

    canvasEl.addEventListener("mousemove", function(e){
        mouse.x = e.pageX
        mouse.y = e.pageY
    })
    
    