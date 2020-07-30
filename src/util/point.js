export default function Point(x, y, data) {
  this.x = x;
  this.y = y;
  this.data = data;
}

Point.prototype = {
  show(sketch) {
    sketch.strokeWeight(6);
    sketch.stroke(255);
    sketch.point(this.x, this.y);
  }
};
