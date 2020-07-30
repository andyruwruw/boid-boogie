<template>
  <v-app
    v-resize="onResize"
    style="position: relative;">
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <boid
      class="canvas"
      :width="windowSize.x"
      :height="windowSize.y"/>
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
  }),
  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
  },
  created() {

  },
};
</script>

<style>
.canvas {
  position: fixed;
  left: 0;
  top: 0;
}
</style>
