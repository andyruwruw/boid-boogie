export default function Boid(sketch, x, y, perception) {
  this.sketch = sketch;
  this.position = this.sketch.createVector(x, y);
  this.velocity = window.p5.Vector.random2D();
  this.velocity.setMag(this.sketch.random(2, 4));
  this.acceleration = this.sketch.createVector();
  this.maxForce = .2;
  this.maxSpeed = 5;
  this.perception = perception;
}

Boid.prototype = {
  edges(width, height) {
    if (this.position.x > width) {
      this.position.x = 0;
    } 
    else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } 
    else if (this.position.y < 0) {
      this.position.y = height;
    }
  },

  align(boids) {
    let perceptionRadius = this.perception;
    let steering = this.sketch.createVector();
    let total = 0;
    for (let other of boids) {
      let d = this.sketch.dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  },

  separation(boids) {
    let perceptionRadius = this.perception;
    let steering = this.sketch.createVector();
    let total = 0;
    for (let other of boids) {
      let d = this.sketch.dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = window.p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  },

  cohesion(boids) {
    let perceptionRadius = this.perception;
    let steering = this.sketch.createVector();
    let total = 0;
    for (let other of boids) {
      let d = this.sketch.dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  },

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(1);
    cohesion.mult(1);
    separation.mult(1);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  },

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  },

  show() {
    console.log('draw', this.position.x, this.position.y);
    this.sketch.strokeWeight(6);
    this.sketch.stroke(255);
    this.sketch.point(this.position.x, this.position.y);
  },

  get x() {
    return this.position.x;
  },

  get y() {
    return this.position.y;
  },
};
