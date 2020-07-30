<template>
  <div class="landing">
    <v-dialog
      v-model="dialog"
      max-width="800"
      width="90vw"
      dark
      persistent>
      <v-card
        color="transparent"
        elevation="0"
        :class="$style['title-card']">
        <img src="../assets/logo.svg" class="logo"/>

        <p :class="$style.title">
          boid boogie
        </p>

        <p :class="$style.description">
          a spotify driven boid simulation
        </p>

        <v-btn
          x-large
          color="#9C27B0"
          :class="$style.login"
          :loading="action"
          :disabled="action"
          @click="handleLogin">
          <v-icon left color="white" large :class="$style.icon">{{ icon }}</v-icon>
          Login
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mdiSpotify } from '@mdi/js';

export default {
  name: 'Landing',
  data: () => ({
    dialog: true,
    icon: mdiSpotify,
    action: false,
  }),
  methods: {
    ...mapActions('auth', [
      'login',
    ]),
    handleLogin() {
      this.action = true;
      this.login();
    },
  },
};
</script>

<style module>
.title-card img {
  display: block;
  margin: 0 auto;
  width: 200px;
}

.title-card p.title {
  font-size: 3rem;
  text-align: center;
  margin: 0;
}

.title-card p.description {
  text-align: center;
  color: rgba(255, 255, 255, 0.712);
  margin: 0;
}

.login {
  display: block;
  margin: 0 auto;
  margin-top: 32px;
}

.login .icon {
  transform: scale(.8, .8);
}
</style>

<style>
.v-dialog {
  box-shadow: none !important;
}
</style>