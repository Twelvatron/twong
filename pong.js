window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var W = 800;
var H = 400;
var paddles = [];
var ball = {
    x: 50,
    y: 50,
    r: 5,
    c: "white",
    vx: 8,
    vy: 2,
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
    }
};

canvas.width = W;
canvas.height = H;
canvas.addEventListener("keydown", doKeyDown, true);

function doKeyDown(e) {
    switch (e.which) {
        case 38:
            movePaddle('right', 'up');
            break;
        case 40:
            movePaddle('right', 'down');
            break;
        case 65:
            movePaddle('left', 'up');
            break;
        case 90:
            movePaddle('left', 'down');
            break;
    }
}

function paintCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
}

function Paddle(pos) {
    this.h = 150;
    this.w = 5;
    this.name = pos;
    this.x = (pos == "left") ? 0 : W - this.w;
    this.y = H / 2 - this.h / 2;
}

paddles.push(new Paddle("left"));
paddles.push(new Paddle("right"));

function movePaddle(paddleName, direction) {
    for (var i = 0; i < paddles.length; i++) {
        if (paddles[i].name == paddleName) {
            if (direction == "up" && paddles[i].y > 0) {
                paddles[i].y -= 10;
            }
            if (direction == "down" && paddles[i].y < 250) {
                paddles[i].y += 10;
            }
        }
    }
}

function draw() {
    paintCanvas();
    for (var i = 0; i < paddles.length; i++) {
        p = paddles[i];

        ctx.fillStyle = "white";
        ctx.fillRect(p.x, p.y, p.w, p.h);
    }

    ball.draw();
    update();
}

function animloop() {
    init = requestAnimFrame(animloop);
    canvas.focus();
    draw();
}

function gameOver() {
    cancelRequestAnimFrame(init);
    if(confirm('GAME OVER DICKHEAD!!! Again?')){
    	animloop();
    } else {
    	alert('CHICKEN!');	
    }
}

function collideAction(ball, p) {
	ball.vx = -ball.vx;
	
	if(paddleHit == 1) {
		ball.x = p.x - p.w;
	}
	
	else if(paddleHit == 2) {
		ball.x = p.w + ball.r;
	}
}

function collides(b, p) {
	if(b.y + ball.r >= p.y && b.y - ball.r <=p.y + p.h) {
		if(b.x >= (p.x - p.w) && p.x > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.x <= p.w && p.x == 0) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}

function update() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    var p1 = paddles[0];
    var p2 = paddles[1];

    if (collides(ball, p1)) {
        collideAction(ball, p1);
    } else if (collides(ball, p2)) {
        collideAction(ball, p2);
    } else {
        if (ball.x + ball.r > W) {
            ball.x = W - ball.r;
            gameOver();
        } else if (ball.x < 0) {
            ball.x = ball.r;
            gameOver();
        }

        if (ball.y + ball.r > H) {
            ball.vy = -(ball.vy+1);
            ball.y = H - ball.r;
        } else if (ball.y - ball.r < 0) {
            ball.vy = -(ball.vy+1);
            ball.y = ball.r;
        }
    }
}

animloop();
