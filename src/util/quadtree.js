import Rectangle from './rectangle';
import Circle from './circle';

export default function QuadTree(boundary, capacity, draw) {
  if (!boundary) {
    throw TypeError('Boundary is null or undefined.');
  }
  if (!(boundary instanceof Rectangle)) {
      throw TypeError('boundary should be a Rectangle');
  }
  if (typeof capacity !== 'number') {
      throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
  }
  if (capacity < 1) {
      throw RangeError('capacity must be greater than 0');
  }
  this.boundary = boundary;
  this.capacity = capacity;
  this.points = [];
  this.draw = draw;
  this.divided = false;
}

QuadTree.prototype = {
  insert(point, sketch) {
    if (!this.boundary.contains(point)) {
      return false;
    }
    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }
    if (!this.divided) {
      this.subdivide(sketch);
    }
    return (this.northeast.insert(point, sketch) || this.northwest.insert(point, sketch) ||
    this.southeast.insert(point, sketch) || this.southwest.insert(point, sketch));
  },

  subdivide(sketch) {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    let ne = new Rectangle(x + w, y, w, h);
    this.northeast = new QuadTree(ne, this.capacity, this.draw);
    let nw = new Rectangle(x, y, w, h);
    this.northwest = new QuadTree(nw, this.capacity, this.draw);
    let se = new Rectangle(x + w, y + h, w, h);
    this.southeast = new QuadTree(se, this.capacity, this.draw);
    let sw = new Rectangle(x, y + h, w, h);
    this.southwest = new QuadTree(sw, this.capacity, this.draw);

    if (this.draw) {
      this.drawSquares(ne, nw, se, sw, sketch);
    }

    this.divided = true;
  },

  drawSquares(ne, nw, se, sw, sketch) {
    sketch.fill('rgba(0,0,0,0)');
    sketch.stroke('rgba(255,255,255,0.3)');
    sketch.strokeWeight(1);
    sketch.rect(ne.x, ne.y, ne.w, ne.h);
    sketch.rect(nw.x, nw.y, nw.w, nw.h);
    sketch.rect(se.x, se.y, se.w, se.h);
    sketch.rect(sw.x, sw.y, sw.w, sw.h);
  },

  query(range, found) {
    if (!found) {
      found = [];
    }

    if (!range.intersects(this.boundary)) {
      return found;
    }

    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }
    return found;
  },

  closest(point, count, maxDistance) {
    if (typeof point === "undefined") {
      throw TypeError("Method 'closest' needs a point");
    }
    if (typeof count === "undefined") {
      count = 1;
    }

    // Limit to number of points in this QuadTree
    if (this.length == 0) {
      return [];
    }
    if (this.length < count) {
      return this.points;
    }

    if (typeof maxDistance === "undefined") {
    // A circle that contains the entire QuadTree
      const outerReach = Math.sqrt(
          Math.pow(this.boundary.w, 2) + Math.pow(this.boundary.h, 2)
      );
    // Distance of query point from center
      const pointDistance = Math.sqrt(
          Math.pow(point.x, 2) + Math.pow(point.y, 2)
      );
    // One QuadTree size away from the query point
      maxDistance = outerReach + pointDistance;
    }

    // Binary search with Circle queries
    let inner = 0;
    let outer = maxDistance;
    let limit = 8; // Limit to avoid infinite loops caused by ties
    let points;
    while (limit > 0) {
      const radius = (inner + outer) / 2;
      const range = new Circle(point.x, point.y, radius);
      points = this.query(range);
      if (points.length === count) {
        return points; // Return when we hit the right size
      } 
      else if (points.length < count) {
        inner = radius;
      } 
      else {
        outer = radius;
        limit --;
      }
    }
    // Sort by squared distance
    points.sort(
      (a, b) => {
        const aDist = Math.pow(point.x - a.x, 2) +
            Math.pow(point.y - a.y, 2);
        const bDist = Math.pow(point.x - b.x, 2) +
            Math.pow(point.y - b.y, 2);
        return aDist - bDist;
      }
    );
    // Slice to return correct count (breaks ties)
    return points.slice(0, count);
  },

  forEach(fn) {
    this.points.forEach(fn);
    if (this.divided) {
      this.northeast.forEach(fn);
      this.northwest.forEach(fn);
      this.southeast.forEach(fn);
      this.southwest.forEach(fn);
    }
  },

  merge(other, capacity) {
    let left = Math.min(this.boundary.left, other.boundary.left);
    let right = Math.max(this.boundary.right, other.boundary.right);
    let top = Math.min(this.boundary.top, other.boundary.top);
    let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);
    let height = bottom - top;
    let width = right - left;
    let midX = left + width / 2;
    let midY = top + height / 2;
    let boundary = new Rectangle(midX, midY, width, height);
    let result = new QuadTree(boundary, capacity);
    this.forEach(point => result.insert(point));
    other.forEach(point => result.insert(point));

    return result;
  },

  get length() {
    let count = this.points.length;
    if (this.divided) {
      count += this.northwest.length;
      count += this.northeast.length;
      count += this.southwest.length;
      count += this.southeast.length;
    }
    return count;
  },
};