<template>
  <div>
    <h1>REDIRECT</h1>
  </div>
</template>

<script>
export default {
  name: 'Redirect',
  created() {
    this.$store.dispatch('auth/callback', this.$route.query);
  },
};
</script>