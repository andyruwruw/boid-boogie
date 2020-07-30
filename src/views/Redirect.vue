<template>
  <div>
    <h1>REDIRECT</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Redirect',
  created() {
    this.$store.dispatch('auth/callback', this.$route.query);
  },
  computed: {
    ...mapGetters('auth', [
      'getAccessToken',
    ]),
  },
  watch: {
    getAccessToken(val) {
      if (val !== null) {
        this.$router.push('/home');
      }
    },
  },
};
</script>