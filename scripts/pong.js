// START - General Animation and Canvas definitions and refactoring of code

	// animation framerate
	var animate = window.requestAnimationFrame ||
	  window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame ||
	  function(callback) { window.setTimeout(callback, 1000/60) };

	// create the canvas
	var canvas = document.createElement('canvas');

	// function to get window width
	var width = function getActualWidth() {
	    var actualWidth = window.innerWidth ||
	                      document.documentElement.clientWidth ||
	                      document.body.clientWidth ||
	                      document.body.offsetWidth;

	    return actualWidth;
	};

	// function to get window height
	var height = function getActualHeight() {
	    var actualHeight = window.innerHeight ||
	                      document.documentElement.clientHeight ||
	                      document.body.clientHeight ||
	                      document.body.offsetHeight;

	    return actualHeight;
	};

	// define canvas width and height
	canvas.width = width();
	canvas.height = height();

	// canvas context for 2D
	var context = canvas.getContext('2d');

	// create the canvas when window loads and begin animating
	window.onload = function() {
		document.body.appendChild(canvas);
		animate(step);
	};

	// game function calls for continuous animation
	var step = function() {
		update();
		render();
		animate(step);
	};

// END - General Animation and Canvas definitions

// START - Game Asset Definitions and Rendering

	// define a game paddle
	function Paddle(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.x_speed = 0;
		this.y_speed = 0;
	};

	// add render method to paddle prototype
	Paddle.prototype.render = function() {
		context.fillStyle = "white";
		context.fillRect(this.x, this.y, this.width, this.height);
	};

	// define player and computer paddles
	function Player() {
		this.paddle = new Paddle(.98*width(), .4*height() , .01*width(), .2*height());
	};

	function Computer() {
		this.paddle = new Paddle(.01*width(), .4*height(), .01*width(), .2*height());
	};

	// add render methods to player and computer prototypes which render paddles
	Player.prototype.render = function() {
		this.paddle.render();
	};

	Computer.prototype.render = function() {
		this.paddle.render();
	};

	// define game ball
	function Ball(x, y) {
		this.radius = .01*canvas.width;
		this.x = x;
		this.y = y;
		this.x_speed = Math.random() >= .5 ? .5*this.radius : -.5*this.radius;
		this.y_speed = 0;
	};

	// add render method to ball prototype
	Ball.prototype.render = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0*Math.PI, 2*Math.PI, false);
		context.fillStyle = "white";
		context.fill();
	};

// END - Game Asset Definitions and Rendering

// START - Game Asset Update Mechanisms

	// game asset updates
	var update = function() {
		player.update();
		ball.update(player.paddle, computer.paddle);
	};

	// player position updating / movement
	Player.prototype.update = function() {
		for(var key in keysDown) {
			var value = Number(key);
			// up arrow
			if(value == 38) {
				// paddle moves by 10% of paddle height
				this.paddle.move(0, -(.02*canvas.height));
			// down arrow
			} else if(value == 40) {
				this.paddle.move(0, .02*canvas.height);
			} else {
				this.paddle.move(0, 0);
			}
		}
	};



	// paddle movement
	Paddle.prototype.move = function(x, y) {
	  	this.x += x;
		this.y += y;
		this.x_speed = x;
		this.y_speed = y;
		if(this.y < 0) {
			// paddle moves off screen to the top
			this.y = 0;
			this.y_speed = 0;
		} else if(this.y + this.height > canvas.height) {
			// paddle moves off screen to the bottom
			this.y = canvas.height - this.height;
			this.y_speed = 0;
		}
	};

	// ball position updating / movement
	Ball.prototype.update = function(paddle1, paddle2) {
		this.x += this.x_speed;
		this.y += this.y_speed;
		// ball definition
		var top_x = this.x - this.radius;
		var top_y = this.y - this.radius;
		var bottom_x = this.x + this.radius;
		var bottom_y = this.y + this.radius;

		if(this.y - this.radius < 0) { // hitting the top wall
		  this.y = this.radius;
		  this.y_speed = -this.y_speed;
		} else if(this.y + this.radius > height()) { // hitting the bottom wall
		  this.y = height() - this.radius;
		  this.y_speed = -this.y_speed;
		}

		if(this.x < 0 || this. x > width()) { // point was scored
		  this.x_speed = Math.random() >= .5 ? .5*this.radius : -.5*this.radius;
		  this.y_speed = 0;
		  this.x = canvas.width/2 - this.radius;
		  this.y = canvas.height/2 - this.radius;
		}
	};

// END - Game Asset Update Mechanisms

// START - Interaction and Initialization

	// define the interaction keys
	var keysDown = {};

	// when a key is pressed
	window.addEventListener('keydown', function(event) {
		keysDown[event.keyCode] = true;
	});

	// when a key is let go
	window.addEventListener('keyup', function(event) {
		delete keysDown[event.keyCode];
	});

  //remove scrolling when keys are pressed
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

	// game asset calls
	var player = new Player();
	var computer = new Computer();
	var ball = new Ball((canvas.width/2 - .01*canvas.width), (canvas.height/2 - .01*canvas.height));

	// render the board and the game assets
	var render = function() {
		context.fillStyle = "black";
		context.fillRect(0, 0, width(), height());
		player.render();
		computer.render();
		ball.render();
	};

// END - Interaction and Initialization
