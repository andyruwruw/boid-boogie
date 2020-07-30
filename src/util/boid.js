export default function Boid(sketch, x, y, perception) {
  this.position = sketch.createVector(x, y);
  this.velocity = window.p5.Vector.random2D();
  this.velocity.setMag(sketch.random(2, 4));
  this.acceleration = sketch.createVector();
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

  align(sketch, boids) {
    let perceptionRadius = this.perception;
    let steering = sketch.createVector();
    let total = 0;
    for (let other of boids) {
      let d = sketch.dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity.x, other.velocity.y, other.velocity.z);
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

  separation(sketch, boids) {
    let perceptionRadius = this.perception;
    let steering = sketch.createVector();
    let total = 0;
    for (let other of boids) {
      let d = sketch.dist(this.position.x, this.position.y, other.position.x, other.position.y);
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

  cohesion(sketch, boids) {
    let perceptionRadius = this.perception;
    let steering = sketch.createVector();
    let total = 0;
    for (let other of boids) {
      let d = sketch.dist(this.position.x, this.position.y, other.position.x, other.position.y);
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

  flock(sketch, boids) {
    let alignment = this.align(sketch, boids);
    let cohesion = this.cohesion(sketch, boids);
    let separation = this.separation(sketch, boids);

    console.log(alignment, cohesion, separation);

    alignment.mult(1.5);
    cohesion.mult(1);
    separation.mult(2);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  },

  update(sketch) {
    this.position.add(this.velocity.x, this.velocity.y, this.velocity.z);
    this.velocity.add(this.acceleration.x, this.acceleration.y, this.acceleration.z);
    this.velocity.limit(this.maxSpeed);
    this.acceleration = sketch.createVector(0, 0);
  },

  show(sketch) {
    sketch.strokeWeight(6);
    sketch.stroke(255);
    sketch.point(this.position.x, this.position.y);
  },

  get x() {
    return this.position.x;
  },

  get y() {
    return this.position.y;
  },
};
