const state = {
  perception: 300,
  alignment: 1.5,
  cohesion: 1,
  separation: 2,
  maxForce: .2,
  maxSpeed: 5,
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
  
};

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default module;