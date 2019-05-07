const chars = [];
let font = null;

const str = "ROTATION";

let x_interval, y_interval;

const frame_interval = 20;
let state;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  smooth();
  frameRate(30);

  x_interval = (width - 100) / str.length;
  y_interval = height / 8;

  for (let i = -3; i < str.length + 5; i++) {
    for (let j = -3; j < 12; j++) {
      let c;
      if (0 <= i && i < str.length && j === 3) {
        c = color(240, 10, 100);
      } else {
        c = color(240, 10, 50);
      }
      chars.push(
        new Char(
          100 + x_interval * i, //x
          50 + y_interval * j, //y
          i, //z 
          str.charAt(Math.abs(i) % str.length),//str //String.fromCharCode(Math.trunc(random(65, 91))),
          i, //x_num
          j, //y_num
          c //color
        )
      );
    }
  }
  camera(0, 0, (height / 1.5) / tan(PI * 30.0 / 180.0), 0, 0, 0, 0, 1, 0);
}

function draw() {
  background(240, 78, 24);
  state = Math.trunc(frameCount / frame_interval);

  push();
  translate(-width / 2, -height / 2, 0);
  chars.forEach(c => {
    c.update();
  });
  pop();

  if (frameCount < 10 * frame_interval) {
    camera(
      easing(0, -300, 0, 130, "inout"),
      easing(0, -150, 0, 130, "inout"),
      (height / 1.5) / tan(PI * 30.0 / 180.0) - easing(0, 300, 0, 150, "inout"),
      0, 0, 0, 0, 1, 0);
  } else {
    console.log("hoge");
    camera(
      easing(-300, 0, 10 * frame_interval, 20, "inout"),
      easing(-150, 0, 10 * frame_interval, 20, "inout"),
      (height / 1.5) / tan(PI * 30.0 / 180.0) - easing(300, 0, 10 * frame_interval, 20, "inout"),
      0, 0, 0, 0, 1, 0);
  }

  orbitControl();
}

class Char {
  constructor(x, y, z, str, x_num, y_num, color = color(255), pg_size = 60) {
    this.v = createVector(x, y, z);
    this.v_origin = createVector(x, y, z);
    this.str = str;
    this.x_num = x_num;
    this.y_num = y_num;
    this.color = color;
    this.pg_size = pg_size;

    this.pg = createGraphics(pg_size, pg_size);
    this.pg.colorMode(HSB, 360, 100, 100, 100);
  }

  depth() {
    return this.z;
  }

  update() {
    switch (state) {
      case 0: // ↓
        if (this.x_num % 2 === 0) {
          this.v.y = easing(this.v_origin.y, this.v_origin.y + y_interval, frame_interval * state, 15, "inout");
        }
        break;
      case 1:　// ↓
        if (Math.abs(this.x_num) % 2 === 1) {
          this.v.y = easing(this.v_origin.y, this.v_origin.y + y_interval, frame_interval * state, 15, "inout");
        }
        break;
      case 2: // →
        if (this.y_num % 2 === 0) {
          this.v.x = easing(this.v_origin.x, this.v_origin.x + x_interval, frame_interval * state, 15, "inout");
        }
        break;
      case 3: // →
        if (Math.abs(this.y_num) % 2 === 1) {
          this.v.x = easing(this.v_origin.x, this.v_origin.x + x_interval, frame_interval * state, 15, "inout");
        }
        break;
      case 4: // ↑
        if (this.x_num % 2 === 0) {
          this.v.y = easing(this.v_origin.y + y_interval, this.v_origin.y, frame_interval * state, 15, "inout");
        }
        break;
      case 5: // ↑
        if (Math.abs(this.x_num) % 2 === 1) {
          this.v.y = easing(this.v_origin.y + y_interval, this.v_origin.y, frame_interval * state, 15, "inout");
        }
        break;
      case 6: // ←
        if (this.y_num % 2 === 0) {
          this.v.x = easing(this.v_origin.x + x_interval, this.v_origin.x, frame_interval * state, 15, "inout");
        }
        break;
      case 7: // ←
        if (Math.abs(this.y_num) % 2 === 1) {
          this.v.x = easing(this.v_origin.x + x_interval, this.v_origin.x, frame_interval * state, 15, "inout");
        }
        break;
      case 8:
        if (0 <= this.x_num && this.x_num < str.length && this.y_num === 3) {
          this.v.z = easing(this.v_origin.z, +150, frame_interval * state, 15, "inout");
        } else {
          this.v.z = easing(this.v_origin.z, -100, frame_interval * state, 15, "inout");
          this.v.y = easing(this.v_origin.y, -1 * y_interval, frame_interval * state, 15, "inout");
        }
        break;
      case 9:
        break;
      case 10:
        if (0 <= this.x_num && this.x_num < str.length && this.y_num === 3) {
          this.v.z = easing(this.v_origin.z + 150, this.v_origin.z, frame_interval * state, 15, "inout");
        } else {
          this.v.z = easing(-100, this.v_origin.z, frame_interval * state, 15, "inout");
          this.v.y = easing(-1 * y_interval, this.v_origin.y, frame_interval * state, 15, "inout");
        }
        break;
      default:
        this.v = this.v_origin.copy();
        frameCount = 0;
        break;
    }

    this.pg.clear();
    this.pg.noStroke();
    this.pg.textSize(64);
    this.pg.textAlign(CENTER, CENTER);
    this.pg.textFont("serif");
    this.pg.fill(0);
    this.pg.text(this.str, this.pg_size / 2 - 5, this.pg_size / 2 + 5);
    this.pg.fill(this.color);
    this.pg.text(this.str, this.pg_size / 2, this.pg_size / 2);

    noFill();
    texture(this.pg);
    noStroke();
    push();
    translate(this.v.x, this.v.y, this.v.z);
    plane(this.pg_size);
    pop();
  }
}

function easing(start, end, startFrame, speedRatio = 20, type = "out", nowFrameCount = frameCount) {
  if (type === "in") {
    return start + (end - start) * ease_in((nowFrameCount - startFrame) / speedRatio);
  } else if (type === "out") {
    return start + (end - start) * ease_out((nowFrameCount - startFrame) / speedRatio);
  } else if (type === "inout") {
    return start + (end - start) * ease_inout((nowFrameCount - startFrame) / speedRatio);
  }

  function ease_in(x) {
    if (x < 0) {
      return 0;
    }
    if (1 < x) {
      return 1;
    }
    return Math.pow(x, 2);
  }

  function ease_out(x) {
    if (x < 0) {
      return 0;
    }
    if (1 < x) {
      return 1;
    }
    return x * (2 - x);
  }

  function ease_inout(x) {
    if (x < 0) {
      return 0;
    }
    if (1 < x) {
      return 1;
    }
    return Math.pow(x, 2) * (3 - 2 * x);
  }
}