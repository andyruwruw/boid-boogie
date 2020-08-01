<template>
  <div :class="$style.component">
    <div
      :class="[$style['bottom-bar'], { [$style.show]: show || hover }]"
      @mouseenter="handleHover"
      @mouseleave="handleLeave">
      <div :class="$style.content">
        <currently-playing v-if="track != null" />

        <v-spacer></v-spacer>

        <v-dialog
          v-model="dialog"
          width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              :x-large="true"
              v-bind="attrs"
              v-on="on"
              outlined="">
              <v-icon left>{{ cog }}</v-icon>
              Settings
            </v-btn>
          </template>

          <settings />
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mdiCog } from '@mdi/js';
import CurrentlyPlaying from '@/components/CurrentlyPlaying';
import Settings from '@/components/Settings';

export default {
  name: 'Home',
  components: {
    CurrentlyPlaying,
    Settings,
  },
  data: () => ({
    show: false,
    hover: false,
    cog: mdiCog,
    dialog: false,
  }),
  computed: {
    ...mapGetters('player', [
      'track',
    ]),
    ...mapGetters('auth', [
      'getAccessToken',
    ]),
  },
  watch: {
    track() {
      this.show = true;
      setTimeout(this.timeExpired, 4000);
    },
  },
  methods: {
    handleHover() {
      this.hover = true;
    },
    handleLeave() {
      this.hover = false;
    },
    timeExpired() {
      this.show = false;
    }
  },
  created() {
    if (!this.getAccessToken) {
      this.$router.push('/');
    }
  },
};
</script>

<style module>
.component {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
}

.bottom-bar {
  display: flex;
  opacity: 0;
  width: 100%;
}

.bottom-bar.show {
  opacity: 1;
}

.bottom-bar .content {
  transform: translateY(100%);
  transition: all .3s ease 0s;
  padding: 24px;
  background: rgb(255,255,255,0.05);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom-bar.show .content {
  transform: translateY(0);
}
</style>