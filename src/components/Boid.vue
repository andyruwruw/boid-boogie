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
import { mapGetters, mapActions } from 'vuex';
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
    boids: [],
    boidNum: 100,
    tickCounter: 8,
    frameCounter: 4,
  }),
  methods: {
    ...mapActions('track', [
      'trackTickUpdate',
      'trackFrameUpdate',
    ]),
    setup(sketch) {
      sketch.resizeCanvas(this.width, this.height);
      for (let i = 0; i < this.boidNum; i++) {
        this.boids.push(new Boid(sketch, Math.random() * this.width, Math.random() * this.height, this.perception, this.maxForce, this.maxSpeed, this.alignment, this.cohesion, this.separation))
      }
      this.currWidth = this.width;
      this.currHeight = this.height;
    },
    draw(sketch) {
      if (this.tickCounter > 0) {
        this.tickCounter -= 1;
      } else {
        this.tickCounter = 8;
        this.trackTickUpdate();
      }
      if (this.frameCounter > 0) {
        this.frameCounter -= 1;
      } else {
        this.frameCounter = 4;
        this.trackFrameUpdate();
      }
      if (this.currWidth !== this.width || this.currHeight !== this.height) {
        sketch.resizeCanvas(this.width, this.height);
        this.currWidth = this.width;
        this.currHeight = this.height;
      }
      

      let boundary = new Rectangle(0, 0, this.width, this.height);

      sketch.clear();
      sketch.background('rgba(0,0,0,0)');
      
      let quadTree = new QuadTree(boundary, 1, false, sketch);

      for (let i = 0; i < this.boids.length; i++) {
        let point = new Point(this.boids[i].x, this.boids[i].y, this.boids[i]);
        quadTree.insert(point);
      }

      for (let boid of this.boids) {
        let view = new Circle(boid.x, boid.y, this.perception / 2);
        
        let other = quadTree.query(view).map((point) => point.data);
        view.show(sketch, other.length);
        console.log(this.separation);
        boid.updateValues(this.perception, this.maxForce, this.maxSpeed, this.alignment, this.cohesion, this.separation);
        boid.edges(this.width, this.height);
        boid.flock(sketch, other);
        boid.update(sketch);
        boid.show(sketch);
      }
    },
  },
  computed: {
    ...mapGetters('boid', [
      'perception',
      'alignment',
      'cohesion',
      'separation',
      'maxForce',
      'maxSpeed',
    ]),
    ...mapGetters('track', [
      'activeInterval',
    ]),
  },
  watch: {
    // activeInterval(val) {
    //   console.log(val);
    // }
  }
}
</script>

<style module>
.component {
  display: flex;
  justify-content: center;
}
</style>