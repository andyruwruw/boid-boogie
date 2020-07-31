import api from '@/api';

const state = {
  currID: null,
  analysis: null,
  start: 0,
  progress: 0,
  activeInterval: {},
  activeBeat: null,
  activeBar: null,
  activeSegment: null,
  activeSection: null,
  activeTatum: null,
};

const getters = {
  analysis: state => state.analysis,
  activeInterval: state => state.activeInterval,
  activeBeat: state => state.activeBeat,
  activeBar: state => state.activeBar,
  activeSegment: state => state.activeSegment,
  activeSection: state => state.activeSection,
  activeTatum: state => state.activeTatum,
  progress: state => state.progress,
  inicialized: state => (state.currID != null
    && state.analysis
    && state.activeBeat
    && state.activeBar
    && state.activeSegment
    && state.activeSection
    && state.activeTatum),
};

const mutations = {
  setCurrID: (state, id) => state.currID = id,
  setAnalysis: (state, analysis) => state.analysis = analysis,
  setStart: (state, start) => state.start = start,
  setProgress: (state, progress) => state.progress = progress,
  setActiveInterval: (state, { type, interval }) => state.activeInterval[type] = interval,
  setActiveBeat: (state, beat) => state.activeBeat = beat,
  setActiveBar: (state, bar) => state.activeBar = bar,
  setActiveSegment: (state, segment) => state.activeSegment = segment,
  setActiveSection: (state, section) => state.activeSection = section,
  setActiveTatum: (state, tatum) => state.activeTatum = tatum,
  resetActiveInterval: (state) => {
    state.activeBeat = null;
    state.activeBar = null;
    state.activeSegment = null;
    state.activeSection = null;
    state.activeTatum = null;
  },
};

const actions = {
  async updateTrack(context, track) {
    context.commit('resetActiveInterval');
    const { position, track_window, timestamp } = track;
    const { id } = track_window.current_track;

    const delay = (new Date()).getTime() - timestamp;

    context.commit('setStart', (new Date()).getTime() - position + delay);
    context.commit('setProgress', position);

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
  async trackTickUpdate ({ dispatch, state }) {
    if (state.currID != null && state.analysis != null) {
      await dispatch('setActiveIntervals');
    }
    // dispatch('boid/boidTickUpdate', null, { root: true });
  },
  async trackFrameUpdate ({ commit, state }) {
    if (state.currID != null && state.analysis != null) {
      const cursor = ((new Date()).getTime() - state.start + 750);
      commit('setProgress', cursor);
    }
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
      const index = determineInterval(type);
      const stateFields = {
        tatums: 'activeTatum',
        segments: 'activeSegment',
        beats: 'activeBeat',
        bars: 'activeBar', 
        sections: 'activeSection',
      };
      if (!(state[stateFields[type]]) || state[stateFields[type]].index !== index) {
        const updates = {
          tatums: 'setActiveTatum',
          segments: 'setActiveSegment',
          beats: 'setActiveBeat',
          bars: 'setActiveBar', 
          sections: 'setActiveSection',
        };
        const interval = { ...state.analysis[type][index], index };
        commit(updates[type], interval);
      }
    });
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