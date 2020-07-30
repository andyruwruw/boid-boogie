export default function Boid(sketch, x, y, perception, maxForce, maxSpeed, alignment, cohesion, separation) {
  this.position = sketch.createVector(x, y);
  this.velocity = window.p5.Vector.random2D();
  this.velocity.setMag(sketch.random(2, 4));
  this.acceleration = sketch.createVector();
  this.maxForce = maxForce;
  this.maxSpeed = maxSpeed;
  this.perception = perception;
  this.alignmentMultiplyer = alignment;
  this.cohesionMultiplyer = cohesion;
  this.separationMultiplyer = separation;
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
      steering.sub(this.velocity.x, this.velocity.y, this.velocity.z);
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
      steering.sub(this.velocity.x, this.velocity.y, this.velocity.z);
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
      steering.sub(this.position.x, this.position.y, this.position.z);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity.x, this.velocity.y, this.velocity.z);
      steering.limit(this.maxForce);
    }
    return steering;
  },

  flock(sketch, boids) {
    let alignment = this.align(sketch, boids);
    let cohesion = this.cohesion(sketch, boids);
    let separation = this.separation(sketch, boids);

    alignment.mult(this.alignmentMultiplyer);
    cohesion.mult(this.cohesionMultiplyer);
    separation.mult(this.separationMultiplyer);

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
