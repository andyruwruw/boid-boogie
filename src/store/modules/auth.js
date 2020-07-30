import api from '@/api';

const state = {
  accessToken: null,
  refreshToken: null,
  expiryTime: null
};

const getters = {
  getAccessToken: (state) => state.accessToken,
  getRefreshToken: (state) => state.refreshToken,
  getExpiryTime: (state) => state.expiryTime
};

const mutations = {
  setAccessToken(state, token) {
    state.accessToken = token;
  },
  setRefreshToken(state, token) {
    state.refreshToken = token;
  },
  setExpiryTime(state, time) {
    state.expiryTime = time;
  }
};

const actions = {
  login: async function() {
    try {
      const response = await api.auth.getUserAuthURL();
      if (response.data) {
        window.location.href = response.data;
      }
    } catch (e) {
      console.log(e);
    }
  },

  callback: async function(context, query) {
    try {
      const response = await api.auth.callback(query);
      if (response.data) {
        const { access_token, refresh_token, expires_in } = response.data;
        context.commit('setAccessToken', access_token);
        context.commit('setRefreshToken', refresh_token);
        context.commit('setExpiryTime', expires_in);
      }
      context.dispatch('player/init', {}, {root: true});
    } catch (e) {
      console.log(e);
    }
  },

  refreshToken: async function({ commit, state, dispatch }) {
    try {
      if (state.refreshToken) {
        const response = await api.auth.refreshToken(state.refreshToken);
        commit('setAccessToken', response.data.access_token);

        const accessToken = response.data.access_token;

        dispatch('setAccessToken', accessToken);
        return response;
      }
    } catch (e) {
      console.log(e);
    }
  },

  logout: function() {
    let script = document.createElement('script');

    script.src = 'https://www.spotify.com/logout/';
    document.getElementById('app').appendChild(script);

    window.localStorage.clear();
    window.sessionStorage.clear();

    setTimeout(() => {
      location.reload();
    }, 1000);
  },

  setAccessToken({ commit }, token) {
    commit('setAccessToken', token);
  },

  setRefreshToken({ commit }, token) {
    commit('setRefreshToken', token);
  },

  setExpiryTime({ commit }, time) {
    commit('setExpiryTime', time);
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