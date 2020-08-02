export default function Boid(sketch, x, y, perception, maxForce, maxSpeed, alignment, cohesion, separation, index) {
  this.index = index;
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
  this.customSeparation = 0;
  this.customAlignment = 0;
  this.customCohesion = 0;
}

Boid.prototype = {
  updateValues(perception, maxForce, maxSpeed, alignment, cohesion, separation) {
    this.maxForce = maxForce;
    this.maxSpeed = maxSpeed;
    this.perception = perception;
    this.alignmentMultiplyer = alignment;
    this.cohesionMultiplyer = cohesion;
    this.separationMultiplyer = separation;
  },

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
      if ('type' in other && other.type === 'mouse') {
        continue;
      }
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
        if ('type' in other && other.type === 'mouse') {
          diff.mult(100);
        }
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
      if ('type' in other && other.type === 'mouse') {
        continue;
      }
      if (other != this) {
        let d = sketch.dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (d < perceptionRadius) {
          steering.add(other.position);
          total++;
        }
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

    alignment.mult(this.alignmentMultiplyer + this.customAlignment);
    cohesion.mult(this.cohesionMultiplyer + this.customCohesion);
    separation.mult(this.separationMultiplyer + this.customSeparation);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  },

  section(sketch, section, width, height, beatStart, beatDuration, progress) {
    switch(section.index % 3) {
      case 50: 
        this.resetCustomModifiers();
        return;
      case 100:
        this.backAndForth(sketch, width, height);
        this.resetCustomModifiers();
        return
      case 2: 
        this.explodyBalls(sketch, beatStart, beatDuration, progress);
        return
      default:
        this.resetCustomModifiers();
        return
    }
  },

  resetCustomModifiers() {
    this.customSeparation = 0;
    this.customAlignment = 0;
    this.customCohesion = 0;
  },

  backAndForth(sketch, width, height) {
    this.customSeparation = 0;
    this.customAlignment = 0;
    this.customCohesion = 0;

    let steering = sketch.createVector();
    switch (this.index % 4) {
      case 0: 
        steering.add(sketch.createVector(width, height));
        break;
      case 1: 
        steering.add(sketch.createVector(-1, height));
        break;
      case 2: 
        steering.add(sketch.createVector(width, -1));
        break;
      default:
        steering.add(sketch.createVector(-1, -1));
        break;
    }
    steering.sub(this.position.x, this.position.y, this.position.z);
    steering.setMag(this.maxSpeed + 5);
    steering.sub(this.velocity.x, this.velocity.y, this.velocity.z);
    steering.limit(this.maxForce + .5);

    this.acceleration.add(steering);
  },

  explodyBalls(sketch, beatStart, beatDuration, progress) {
    this.customAlignment = 0;

    this.customSeparation = this.cos( 10, 1,
      Math.round(beatStart),
      Math.round(beatStart) + Math.round(beatDuration),
      progress
    );
    this.customCohesion = this.cos( 1, 10,
      Math.round(beatStart),
      Math.round(beatStart) + Math.round(beatDuration),
      progress
    );
  },

  cos( top, bottom, start, end, progress ) {
    let a = (top - bottom) / 2;
    let b = (2 * Math.PI) / (end - start);
    return a * Math.cos(b * (progress - start)) + a + bottom;
  },

  update(sketch) {
    this.position.add(this.velocity.x, this.velocity.y, this.velocity.z);
    this.velocity.add(this.acceleration.x, this.acceleration.y, this.acceleration.z);
    this.velocity.limit(this.maxSpeed);
    this.acceleration = sketch.createVector(0, 0);
  },

  show(sketch, hue, style) {
    
    switch (this.index % 3) {
      case 0: {
        sketch.stroke(`hsl(${hue}, 72%, 40%)`);
        break;
      }
      case 1: {
        sketch.stroke(`hsl(${hue}, 47%, 60%)`);
        break;
      }
      case 2: {
        let lowHue = hue - 60;
        if (lowHue < 0) {
          lowHue = lowHue + 225;
        }
        sketch.stroke(`hsl(${lowHue}, 75%, 31%)`);
        break;
      }
    }

    switch (style) {
      case 'Triangle': {
        sketch.strokeWeight(6);
        let forwards = sketch.createVector(this.velocity.x, this.velocity.y, 0);
        forwards.setMag(5);
        let backRight = sketch.createVector(this.velocity.x, this.velocity.y, 0);
        backRight.setMag(5);
        backRight.rotate(sketch.radians(140));
        let backLeft = sketch.createVector(this.velocity.x, this.velocity.y, 0);
        backLeft.setMag(5);
        backLeft.rotate(sketch.radians(-140));
        sketch.triangle(
          forwards.x + this.position.x,
          forwards.y + this.position.y,
          backRight.x + this.position.x,
          backRight.y + this.position.y,
          backLeft.x + this.position.x,
          backLeft.y + this.position.y
        );
        break;
      }
      case 'Hidden': {
        break;
      }
      default: {
        sketch.strokeWeight(12);
        sketch.point(this.position.x, this.position.y);
        break;
      } 
    }
  },

  get x() {
    return this.position.x;
  },

  get y() {
    return this.position.y;
  },
};
