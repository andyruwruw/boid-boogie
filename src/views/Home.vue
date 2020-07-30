<template>
  <div>
    <v-btn @click="login">Login</v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapActions('auth', [
      'login',
    ]),
  },
};
</script>