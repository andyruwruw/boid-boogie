const state = {
  boidNum: 120,
  circles: true,
  pulse: true,
  style: 'Triangle',
  quadTree: false,
};

const getters = {
  boidNum: state => state.boidNum,
  circles: state => state.circles,
  pulse: state => state.pulse,
  style: state => state.style,
  quadTree: state => state.quadTree,
};

const mutations = {
  setBoidNum: (state, num) => state.boidNum = num,
  setCircles: (state, bool) => state.circles = bool,
  setPulse: (state, bool) => state.pulse = bool,
  setStyle: (state, style) => state.style = style,
  setQuadTree: (state, quadTree) => state.quadTree = quadTree,
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
