<template>
  <div>
    <img :src="image"/>
    <p>{{ name }}</p>
    <p>{{ artists }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CurrentlyPlaying',
  computed: {
    ...mapGetters('player', [
      'getPlaybackContext',
    ]),
    image() {
      return this.getPlaybackContext.track_window.currentTrack.album.images[0];
    },
    name() {
      return this.getPlaybackContext.track_window.currentTrack.name;
    },
    artists() {
      return this.getPlaybackContext.track_window.currentTrack.artists.join(',');
    },
  },
}
</script>