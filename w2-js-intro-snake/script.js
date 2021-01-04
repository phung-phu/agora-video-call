$(document).ready(function () {
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext("2d");

  var w = $("#canvas").width();
  var h = $("#canvas").height();

  var d; // direction where snake will be moving
  var score;
  var cw = 10; // snake/canvas width
  var food;

  var snake_arr;

  // add snake, food
  function init() {
    d = "right";
    score = 0;
    create_snake();
    create_food();

    // if game is running
    if (typeof game_loop != "undefined") {
      clearInterval(game_loop);
    }
    // setInterval() executes a function after a certain amount of time
    game_loop = setInterval(paint, 100);
  }

  init();

  function create_snake() {
    var length = 5;
    snake_arr = [];
    for (var i = length - 1; i >= 0; i--) {
      snake_arr.push({
        // location/coord of snake
        x: i,
        y: 0,
      });
    }
  }

  function create_food() {
    food = {
      // location/coord of food
      x: Math.round((Math.random() * (w - cw)) / cw),
      y: Math.round((Math.random() * (h - cw)) / cw),
    };
  }

  // if snake moves, how should array change
  function paint() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    var nx = snake_arr[0].x;
    var ny = snake_arr[0].y;

    if (d == "right") {
      nx++;
    } else if (d == "left") {
      nx--;
    } else if (d == "up") {
      ny--;
    } else if (d == "down") {
      ny++;
    }

    // snake is out of the canvas box, restart game
    if (
      check_collision(nx, ny, snake_arr) ||
      nx == -1 ||
      ny == -1 ||
      nx == w / cw ||
      ny == h / cw
    ) {
      init();
      return;
    }

    if (nx == food.x && ny == food.y) {
      var tail = {
        x: nx,
        y: ny,
      };
      score++;
      create_food();
    } else {
      var tail = snake_arr.pop(); // remove end
      tail.x = nx;
      tail.y = ny;
    }

    for (var i = 0; i < snake_arr.length; i++) {
      var c = snake_arr[i];
      paint_cells(c.x, c.y, "blue");
    }

    snake_arr.unshift(tail);

    paint_cells(food.x, food.y, "red");
    var score_text = "Score: " + score;
    ctx.fillText(score_text, 5, h - 5);
  }

  function paint_cells(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
  }

  function check_collision(x, y, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].x == x && arr[i].y == y) {
        return true;
      }
      return false;
    }
  }

  $(document).keydown(function (event) {
    var key = event.which;
    if (key == "37" && d != "right") {
      d = "left";
    } else if (key == "38" && d != "down") {
      d = "up";
    } else if (key == "39" && d != "left") {
      d = "right";
    } else if (key == "40" && d != "up") {
      d = "down";
    }
  });
});
