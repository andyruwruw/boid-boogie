<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    width="90vw"
    dark
    persistent>
    <div
      class="d-flex justify-space-around align-center"
      :class="$style.component">
      <loading />
    </div>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import Loading from '@/components/Loading';

export default {
  name: 'Redirect',
  components: {
    Loading,
  },
  data: () => ({
    dialog: true,
  }),
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
  created() {
    this.$store.dispatch('auth/callback', this.$route.query);
  },
};
</script>

<style module> 
.component {
  width: 100%;
  height: calc(100% - 64px);
}
</style>

<style>
.v-dialog {
  box-shadow: none !important;
}
</style>