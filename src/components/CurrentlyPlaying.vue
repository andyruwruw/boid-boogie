<template>
  <div :class="$style.component">
    <img :src="image"/>

    <div :class="$style.details">
      <p :class="$style.title">
        {{ name }}
      </p>

      <p :class="$style.artists">
        {{ artists }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CurrentlyPlaying',
  computed: {
    ...mapGetters('player', [
      'getPlaybackContext',
      'track',
    ]),
    ...mapGetters('track', [
      'inicialized'
    ]),
    image() {
      if (this.track) {
        return this.track.album.images[0].url;
      }
      return '';
    },
    name() {
      if (this.track) {
        return this.track.name;
      }
      return 'lmao';
    },
    artists() {
      if (this.track) {
        return this.track.artists.map(artist => artist.name).join(',');
      }
      return '';
    },
  },
}
</script>

<style module>
.component {
  display: flex;
  align-items: center;
}

.component img {
  width: 6rem;
}

.details {
  margin-left: 24px;
}

.details .title {
  font-size: 1.5rem;
  margin: 0;
}

.details .artists {
  margin: 0;
}
</style>