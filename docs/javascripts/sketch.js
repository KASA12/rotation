const chars = [];
let font = null;
const str = "ROTATION";

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  smooth();
  frameRate(60);

  for (let i = 0; i < str.length; i++) {
    chars.push(
      new Char(
        100 + (width - 100) / str.length * i,
        height / 2,
        i,
        str.charAt(i),//String.fromCharCode(Math.trunc(random(65, 91))),
        i, //num
        color(240, 5, 100) //color
      )
    );
  }

  camera(0, 0, (height / 2.0) / tan(PI * 30.0 / 180.0), 0, 0, 0, 0, 1, 0);
}

function draw() {
  background(240, 78, 24);
  push();
  translate(-width / 2, -height / 2, 0);

  chars.sort((a, b) => {
    if (a.depth() > b.depth()) return 1;
    else if (a.depth() < b.depth()) return -1;
    else return 0;
  })

  for (let i = 0; i < chars.length; i++) {
    chars[i].update();
  }

  pop();


  orbitControl();
}

class Char {
  constructor(x, y, z, str, num, color = color(255), pg_size = 150) {
    this.v = createVector(x, y, z);
    this.str = str;
    this.num = num;
    this.color = color;
    this.pg_size = pg_size;

    this.pg = createGraphics(pg_size, pg_size);
    this.pg.colorMode(HSB, 360, 100, 100, 100);
  }

  depth() {
    return this.z;
  }

  update() {
    this.pg.clear();
    this.pg.noStroke();
    this.pg.textSize(120);
    this.pg.textAlign(CENTER, CENTER);
    this.pg.textFont("Sawarabi Mincho");
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