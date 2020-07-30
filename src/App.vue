<template>
  <v-app
    v-resize="onResize"
    style="position: relative;">
    <v-app-bar
      app
      color="rgba(255,255,255,.1)"
      dark
      class="app-bar">
      <img src="./assets/logo.svg" class="logo"/>

      <v-spacer></v-spacer>

      <v-slider
        v-model="perception"
        min="0"
        max="300"
        label="Perception"
      ></v-slider>
    </v-app-bar>

    <boid
      class="canvas"
      :width="windowSize.x"
      :height="windowSize.y"
      :perception="perception"/>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Boid from '@/components/Boid';

export default {
  name: 'App',
  components: {
    Boid,
  },
  data: () => ({
    windowSize: {
      x: 0,
      y: 0,
    },
    perception: 300,
  }),
  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
  },
  created() {

  }
};
</script>

<style>
.canvas {
  position: fixed;
  left: 0;
  top: 0;
}

.app-bar {
  opacity: 0;
  transition: opacity .2s ease !important;
}

.app-bar:hover {
  opacity: 1;
}

.logo {
  height: 100%;
}
</style>
