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
  border-radius: 6px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.233);
}

.details {
  margin-left: 24px;
}

.details .title {
  font-size: 1.5rem;
  margin: 0;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.932);
}

.details .artists {
  margin: 0;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.932);
  color: rgba(255, 255, 255, 0.685);
}
</style>