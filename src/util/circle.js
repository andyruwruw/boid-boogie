export default function Circle(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.rSquared = this.r * this.r;
}

Circle.prototype = {
  contains(point) {
    let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
    return d <= this.rSquared;
  },

  intersects(range) {
    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    let r = this.r;

    let w = range.w;
    let h = range.h;

    let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

    if (xDist > (r + w) || yDist > (r + h)) {
      return false;
    }
        
    if (xDist <= w || yDist <= h) {
      return true;
    }
        
    return edges <= this.rSquared;
  },

  show(sketch, num, color) {
    sketch.fill(color);
    sketch.stroke(color);
    sketch.strokeWeight(1);
    sketch.ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
};
