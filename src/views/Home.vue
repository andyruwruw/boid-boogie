<template>
  <div>
    <currently-playing v-if="trackDataAvailable" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CurrentlyPlaying from '@/components/CurrentlyPlaying';

export default {
  name: 'Home',
  components: {
    CurrentlyPlaying,
  },
  computed: {
    ...mapGetters('player', [
      'trackDataAvailable',
    ]),
    ...mapGetters('auth', [
      'getAccessToken',
    ]),
  },
  created() {
    if (!this.getAccessToken) {
      this.$router.push('/');
    }
  },
};
</script>