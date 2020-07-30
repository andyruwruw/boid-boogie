<template>
  <div>
    <vue-p5
      v-on="{ setup, draw }"
      :class="$style.component">
    </vue-p5>
  </div>
</template>

<script>
import VueP5 from 'vue-p5';
import QuadTree from '@/util/quadtree';
import Rectangle from '@/util/rectangle';
import Boid from '@/util/boid';
import Circle from '@/util/circle';
import Point from '@/util/point';

export default {
  name: 'Boid',
  components: {
    VueP5,
  },
  props: {
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
  },
  data: () => ({
    currWidth: 0,
    currHeight: 0,
    boundary: null,
    boids: [],
    boidNum: 40,
    perception: 300,
  }),
  methods: {
    setup(sketch) {
      sketch.resizeCanvas(this.width, this.height);
      this.boundary = new Rectangle(0, 0, this.width, this.height);
      for (let i = 0; i < this.boidNum; i++) {
        this.boids.push(new Boid(sketch, Math.random() * this.width, Math.random() * this.height, this.perception))
      }
      this.currWidth = this.width;
      this.currHeight = this.height;
    },
    draw(sketch) {
      sketch.clear();
      sketch.background('#000000');
      let quadTree = new QuadTree(this.boundary, 1, true, sketch);

      for (let i = 0; i < this.boids.length; i++) {
        let point = new Point(this.boids[i].x, this.boids[i].y, this.boids[i]);
        quadTree.insert(point);
      }

      // console.log(quadTree);

      for (let boid of this.boids) {
        let view = new Circle(boid.x, boid.y, this.perception / 2);
        
        let other = quadTree.query(view).map((point) => point.data);
        view.show(sketch, other.length);

        boid.edges(this.width, this.height);
        boid.flock(sketch, other);
        boid.update(sketch);
        boid.show(sketch);
      }
    },
  },
  computed: {
    
  },
}
</script>

<style module>
.component {
  display: flex;
  justify-content: center;
}
</style>