import Vue from 'vue';
import Vuex from 'vuex';

import player from './modules/player';
import auth from './modules/auth';
import track from './modules/track';
import boid from './modules/boid';
import spotifyApiPlugin from '@/api/spotify/plugin';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    player,
    auth,
    boid,
    track,
  },
  plugins: [spotifyApiPlugin],
});
