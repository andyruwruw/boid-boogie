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

  section(sketch, section) {
    switch (section) {
      default: 
        return;
    }
    // console.log('index', section.index);
    // let animation = section.index % 3;
    // switch(animation) {
    //   case 0: 
    //     console.log(0);
    //     break;
    //   case 1: 
    //     console.log(1);
    //     break;
    //   case 2: 
    //     console.log(2);
    //     break;
    //   default break;
    // }
  },

  update(sketch) {
    this.position.add(this.velocity.x, this.velocity.y, this.velocity.z);
    this.velocity.add(this.acceleration.x, this.acceleration.y, this.acceleration.z);
    this.velocity.limit(this.maxSpeed);
    this.acceleration = sketch.createVector(0, 0);
  },

  show(sketch, hue) {
    sketch.strokeWeight(6);
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
  },

  get x() {
    return this.position.x;
  },

  get y() {
    return this.position.y;
  },
};
