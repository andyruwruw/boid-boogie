export default function Rectangle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

Rectangle.prototype = {
  get left() {
    return this.x - this.w / 2;
  },

  get right() {
    return this.x + this.w / 2;
  },

  get top() {
    return this.y - this.h / 2;
  },

  get bottom() {
    return this.y + this.h / 2;
  },

  contains(point) {
    return (point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h);
  },

  intersects(range) {
    return !(range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h);
  },

  show(sketch) {
    sketch.rect(this.x, this.y, this.w, this.h);
  },
};
