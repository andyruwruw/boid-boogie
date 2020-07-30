import api from '@/api';

const state = {
  currID: null,
  analysis: null,
  start: 0,
  progress: 0,
  activeInterval: {},
};

const getters = {
  analysis: state => state.analysis,
  activeInterval: state => state.activeInterval,
  progress: state => state.progress,
};

const mutations = {
  setCurrID: (state, id) => state.currID = id,
  setAnalysis: (state, analysis) => state.analysis = analysis,
  setStart: (state, start) => state.start = start,
  setProgress: (state, progress) => state.progress = progress,
  setActiveInterval: (state, { type, interval }) => state.activeInterval[type] = interval,
};

const actions = {
  async updateTrack(context, track) {
    const { id } = track.track_window.current_track;
    context.commit('setStart', (new Date()).getTime() - track.position);
    context.commit('setProgress', track.position);

    if (id !== context.state.currID) {
      context.commit('setCurrID', id);
      let response = await api.spotify.track.getAudioAnalysis(id);
      
      ['tatums', 'segments', 'beats', 'bars', 'sections'].forEach((type) => {
        const data = response.data[type];
        data[0].duration = data[0].start + data[0].duration;
        data[0].start = 0;
        data[data.length - 1].duration = response.data.track.duration - data[data.length - 1].start;
        data.forEach((interval) => {
          if (interval.loudness_max_time) {
            interval.loudness_max_time = interval.loudness_max_time * 1000;
          }
          interval.start = interval.start * 1000;
          interval.duration = interval.duration * 1000;
        });
      });

      context.commit('setAnalysis', response.data);
    }
  },
  async trackTickUpdate ({ commit, dispatch, state }) {
    if (state.currID != null && state.analysis != null) {
      commit('setProgress', ((new Date()).getTime() - state.start));
      console.log(state.progress);
      await dispatch('setActiveIntervals');
    }
    dispatch('boid/boidTickUpdate', null, { root: true });
  },
  async trackFrameUpdate ({ commit, dispatch, state }) {
    if (state.currID != null && state.analysis != null) {
      commit('setProgress', ((new Date()).getTime() - state.start));
    }
    dispatch('boid/boidFrameUpdate', null, { root: true });
  },
  setActiveIntervals ({ commit, state }) {
    const determineInterval = (type) => {
      const analysis = state.analysis[type];
      const progress = state.progress;
      for (let i = 0; i < analysis.length; i++) {
        if (i === (analysis.length - 1)) {
          return i;
        }
        if (analysis[i].start < progress && progress < analysis[i + 1].start) {
          return i;
        }
      }
    }
  
    ['tatums', 'segments', 'beats', 'bars', 'sections'].forEach(type => {
      const index = determineInterval(type)
      const interval = { ...state.analysis[type][index], index }
      const { start, duration } = interval;
      const elapsed = state.trackProgress - start;
      interval.elapsed = elapsed;
      interval.progress = elapsed / duration;
      commit('setActiveInterval', { type, interval });
    });
    // console.log(state.activeInterval);
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