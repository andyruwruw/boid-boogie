import api from '@/api';

const state = {
  deviceID: null,
  playback: null,
  playbackContext: null,
  track: null,
};

const getters = {
  getDeviceID: (state) => state.deviceID,
  getPlayback: (state) => state.playback,
  getPlaybackContext: (state) => state.playbackContext,
  track: (state) => state.track,
  isPlaying: (state) => {
    if (state.playback) {
      return state.playback.is_playing;
    }
  },
};

const mutations = {
  setDeviceID(state, deviceID) {
    state.deviceID = deviceID;
  },
  setPlayback(state, playback) {
    state.playback = playback;
  },
  setPlaybackContext(state, playback) {
    state.playbackContext = playback;
    state.track = playback.track_window.current_track;
  },
};

const actions = {
  init: async function({ commit, rootGetters, dispatch }) {
    window.onSpotifyWebPlaybackSDKReady = () => {};

    async function waitForSpotifyWebPlaybackSDKToLoad() {
      return new Promise((resolve) => {
        if (window.Spotify) {
          resolve(window.Spotify);
        } else {
          window.onSpotifyWebPlaybackSDKReady = () => {
            resolve(window.Spotify);
          };
        }
      });
    }

    async function waitUntilUserHasSelectedPlayer(sdk) {
      return new Promise((resolve) => {
        let interval = setInterval(async () => {
          let state = await sdk.getCurrentState();
          if (state !== null) {
            resolve(state);
            clearInterval(interval);
          }
        });
      });
    }

    (async () => {
      const { Player } = await waitForSpotifyWebPlaybackSDKToLoad();
      const token = rootGetters['auth/getAccessToken'];

      // eslint-disable-next-line
      const player = new Player({
        name: 'Boid Boogie',
        getOAuthToken: (cb) => {
          cb(token);
        }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => {
        console.error('initialization_error', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('authentication_error', message);
        //dispatch('auth/login', null, { root: true });
      });

      player.addListener('account_error', ({ message }) => {
        console.error('account_error', message);
      });

      player.addListener('playback_error', ({ message }) => {
        console.error('playback_error', message);
      });

      // Playback status updates
      player.addListener('player_state_changed', (state) => {
        if (state) {
          dispatch('setPlaybackContext', state);
          dispatch('setPlayback');
          dispatch('track/updateTrack', state, { root: true });
        }
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        commit('setDeviceID', device_id);

        api.spotify.player.transferUsersPlayback([device_id], true);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      let connected = await player.connect();

      if (connected) {
        await waitUntilUserHasSelectedPlayer(player);
      }
    })();
  },

  async setPlayback({ commit }) {
    try {
      const response = await api.spotify.player.getCurrentPlayback();
      commit('setPlayback', response.data);
    } catch (e) {
      console.log(e);
    }
  },

  setPlaybackContext({ commit }, context) {
    commit('setPlaybackContext', context);
  }
};

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default module;