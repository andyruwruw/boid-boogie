import request from './request';

export default {
  getUserAuthURL: function() {
    return request.get('login');
  },

  callback: async function(query) {
    return await request.post('callback', query);
  },

  refreshToken: function(refresh_token) {
    return request.get(`refresh_token?refresh_token=${refresh_token}`);
  }
};