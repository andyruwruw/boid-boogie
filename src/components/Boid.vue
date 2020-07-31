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
    tickCounter: 8,

    currWidth: 0,
    currHeight: 0,
    boundary: null,

    boidNum: 120,
    boids: [],
    
    perception: 200,
    alignment: 1,
    cohesion: 1.5,
    separationModifier: 0,

    maxForce: .2,
    maxSpeed: 14,

    averagePitch: .2,
    hue: 292,
  }),
  computed: {
    ...mapGetters('track', [
      'activeBeat',
      'activeBar',
      'activeSegment',
      'activeSection',
      'activeTatum',
      'progress',
      'inicialized',
    ]),
    beatStart() {
      return this.activeBeat.start || 0;
    },
    beatDuration() {
      return this.activeBeat.duration;
    },
    barStart() {
      return this.activeBar.start || 0;
    },
    barDuration() {
      return this.activeBar.duration;
    },
    density() {
      return this.width / 10000 * this.height / this.boidNum;
    },
    separation() {
      return Math.max(this.density + this.separationModifier, .8 + this.separationModifier);
    }
  },
  methods: {
    ...mapActions('track', [
      'trackTickUpdate',
      'trackFrameUpdate',
    ]),
    setup(sketch) {
      sketch.resizeCanvas(this.width, this.height);
      this.boundary = new Rectangle(0, 0, this.width, this.height);
      this.currWidth = this.width;
      this.currHeight = this.height;
      this.createBoids(sketch);
    },
    draw(sketch) {
      this.checkTick();
      this.trackFrameUpdate();
      this.resizeCanvas(sketch);
      const quadTree = this.generateQuadTree();
      this.updateParameters();

      sketch.clear();
      sketch.background('rgba(10,10,10,1)');

      this.updateBoids(sketch, quadTree);
    },
    createBoids(sketch) {
      for (let i = 0; i < this.boidNum; i++) {
        this.boids.push(new Boid(
          sketch,
          Math.random() * this.width,
          Math.random() * this.height,
          this.perception,
          this.maxForce,
          this.maxSpeed,
          this.alignment,
          this.cohesion,
          this.separation,
          i,
        ));
      }
    },
    checkTick() {
      if (this.tickCounter > 0) {
        this.tickCounter -= 1;
      } else {
        this.tickCounter = 8;
        this.trackTickUpdate();
      }
    },
    resizeCanvas(sketch) {
      if (this.currWidth !== this.width || this.currHeight !== this.height) {
        sketch.resizeCanvas(this.width, this.height);
        this.boundary = new Rectangle(0, 0, this.width, this.height);
        this.currWidth = this.width;
        this.currHeight = this.height;
      }
    },
    generateQuadTree(sketch) {
      let quadTree = new QuadTree(this.boundary, 1, false, sketch);

      for (let i = 0; i < this.boids.length; i++) {
        let point = new Point(this.boids[i].x, this.boids[i].y, this.boids[i]);
        quadTree.insert(point);
      }
      return quadTree;
    },
    updateParameters() {
      if (this.inicialized) {
        this.alignment = this.cos(1, .4,
          Math.round(this.barStart),
          Math.round(this.barStart) + Math.round(this.barDuration),
        );
      }
    },
    updateBoids(sketch, quadTree) {
      const highlight = this.getColor();

      for (let boid of this.boids) {
        let view = new Circle(boid.x, boid.y, this.perception / 2);
        let other = quadTree.query(view).map((point) => point.data);

        let radius = new Circle(boid.x, boid.y, 75);
        radius.show(sketch, other.length, highlight);

        boid.updateValues(this.perception, this.maxForce, this.maxSpeed, this.alignment, this.cohesion, this.separation);
        boid.edges(this.width, this.height);
        boid.flock(sketch, other);
        if (this.inicialized) {
          boid.section(sketch, this.activeBar, this.width, this.height, this.beatStart, this.beatDuration, this.progress);
        }
        boid.update(sketch);
        boid.show(sketch, this.hue);
      }
    },
    getColor() {
      let alpha;
      if (this.inicialized) {
        alpha = this.cos( .03, .01,
          Math.round(this.beatStart),
          Math.round(this.beatStart) + Math.round(this.beatDuration),
        );
      } else {
        alpha = 0.03;
      }
      return `hsla(${this.hue}, 50%, 65%, ${alpha})`
    },
    cos( top, bottom, start, end ) {
      let a = (top - bottom) / 2;
      let b = (2 * Math.PI) / (end - start);
      return a * Math.cos(b * (this.progress - start)) + a + bottom;
    },
  },
  watch: {
    activeSection(val) {
      switch (val.index % 5) {
        case 0:
          this.hue = 292;
          break;
        case 1:
          this.hue = 193;
          break;
        case 2:
          this.hue = 122;
          break;
        case 3:
          this.hue = 39;
          break;
        default:
          this.hue = 0;
          break;
      }
    },
    activeSegment(val) {
      this.maxSpeed = ((val.loudness_max + 50) / 50 * 3) + 8;
    },
  },
};
</script>

<style module>
.component {
  display: flex;
  justify-content: center;
}
</style>