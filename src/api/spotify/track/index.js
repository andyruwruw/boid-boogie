import request from "./../request";

export default {
  getAudioAnalysis(id) {
    return request.get(`audio-analysis/${id}`);
  },
};