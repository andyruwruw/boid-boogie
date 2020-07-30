import api from '@/api';

const state = {
  track: null,
};

const getters = {
  track: state => state.track,
};

const mutations = {
  setTrack: (state, track) => state.track = track,
};

const actions = {
  async updateTrack(context, track) {
    const { id } = track.track_window.current_track;
    let response = await api.spotify.track.getAudioAnalysis(id);
    console.log(response.data);
    context.commit('setTrack', response.data);
  },
};

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default module;