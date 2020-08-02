<template>
  <v-card dark>
    <v-card-title>
    </v-card-title>
    <v-card-text>
      <h3 :class="[$style.subheader, $style.top]">
        Simulation Settings
      </h3>

      <v-slider
        v-model="boidNum"
        min="0"
        max="300"
        color="#9C27B0"
        label="Number of Boids"
        dense
        hide-details="">
      </v-slider>

      <v-switch
        v-model="quadTree"
        label="Show Quad-Tree"
        color="#9C27B0"
        dense>
      </v-switch>

      <h3 :class="$style.subheader">
        Boid Settings
      </h3>

      <v-select
        v-model="style"
        :items="styles"
        color="#9C27B0"
        solo
        background-color="rgba(255,255,255,.05)"
        hide-details="">
      </v-select>

      <p :class="$style.label">
        Select a Boid Style
      </p>

      <h3 :class="$style.subheader">
        Outline Settings
      </h3>

      <v-switch
        v-model="circles"
        label="Show Circles"
        color="#9C27B0"
        dense
        hide-details>
      </v-switch>

      <v-switch
        v-model="pulse"
        label="Pulse"
        color="#9C27B0"
        dense>
      </v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Settings',
  data: () => ({
    styles: ['Triangle', 'Dot', 'Hidden'],
  }),
  computed: {
    circles: {
      get() {
        return this.$store.state.preferences.circles;
      },
      set(value) {
        this.$store.commit('preferences/setCircles', value);
      },
    },
    pulse: {
      get() {
        return this.$store.state.preferences.pulse;
      },
      set(value) {
        this.$store.commit('preferences/setPulse', value);
      },
    },
    boidNum: {
      get() {
        return this.$store.state.preferences.boidNum;
      },
      set(value) {
        this.$store.commit('preferences/setBoidNum', value);
      },
    },
    style: {
      get() {
        return this.$store.state.preferences.style;
      },
      set(value) {
        this.$store.commit('preferences/setStyle', value);
      },
    },
    quadTree: {
      get() {
        return this.$store.state.preferences.quadTree;
      },
      set(value) {
        this.$store.commit('preferences/setQuadTree', value);
      },
    },
  },
};
</script>

<style module>
.subheader {
  margin: 18px 0 18px;
  color: rgba(255,255,255, .1);
  text-transform: uppercase;
}

.subheader.top {
  margin: 0 0 18px;
}

.label {
  opacity: .8;
  margin-top: 3px;
  margin-left: 3px;
}

.tab {
  margin: 24px 0;
}
</style>