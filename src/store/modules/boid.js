const state = {
  perception: 200,
  alignment: 2,
  cohesion: 1,
  separation: 1.5,
  maxForce: .2,
  maxSpeed: 20,
};

const getters = {
  perception: state => state.perception,
  alignment: state => state.alignment,
  cohesion: state => state.cohesion,
  separation: state => state.separation,
  maxForce: state => state.maxForce,
  maxSpeed: state => state.maxSpeed,
};

const mutations = {
  setPerception: (state, perception) => state.perception = perception,
  setAlignment: (state, alignment) => state.alignment = alignment,
  setCohesion: (state, cohesion) => state.cohesion = cohesion,
  setSeparation: (state, separation) => state.separation = separation,
  setMaxForce: (state, maxForce) => state.maxForce = maxForce,
  setMaxSpeed: (state, maxSpeed) => state.maxSpeed = maxSpeed,
};

const actions = {
  boidTickUpdate() {
    // console.log('boid tick');
  },
  async boidFrameUpdate(context) {
    let activeInterval = context.rootGetters['track/activeInterval'];
    let progress = context.rootGetters['track/progress'];

    if (activeInterval !== null && progress !== null && 'beats' in activeInterval && 'start' in activeInterval.beats) {
      let value = await context.dispatch('parabolic', { 
        top: 200,
        bottom: 150,
        start: Math.round(activeInterval.bars.start),
        end: Math.round(activeInterval.bars.start) + Math.round(activeInterval.bars.duration),
        progress,
      });
      context.commit('setPerception', value);
      value = await context.dispatch('parabolic', { 
        top: 10,
        bottom: 0,
        start: Math.round(activeInterval.bars.start),
        end: Math.round(activeInterval.bars.start) + Math.round(activeInterval.bars.duration),
        progress,
      });
      context.commit('setSeparation', value);
      value = await context.dispatch('parabolic', { 
        top: 2,
        bottom: 0,
        start: Math.round(activeInterval.beats.start),
        end: Math.round(activeInterval.beats.start) + Math.round(activeInterval.beats.duration),
        progress,
      });
      context.commit('setCohesion', value);
      value = await context.dispatch('parabolic', { 
        top: .5,
        bottom: .2,
        start: Math.round(activeInterval.beats.start),
        end: Math.round(activeInterval.beats.start) + Math.round(activeInterval.beats.duration),
        progress,
      });
      context.commit('setMaxForce', value);
    }
  },
  parabolic(context, { top, bottom, start, end, progress }) {
    let a = ((top - bottom) * 4) / (Math.pow((end - start), 2));
    let h = (end + start) / 2;
    let k = bottom;
    return (a * Math.pow((progress - h), 2)) + k;
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
