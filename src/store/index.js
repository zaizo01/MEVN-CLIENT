import Vue from 'vue'
import Vuex from 'vuex'

// For decode jwt 
import decode from 'jwt-decode'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    userDB: ''
  },
  mutations: {
    getUser(state, payload){
      state.token = payload;
      if (payload === '') {
        state.userDB = ''
      } else {
        state.userDB = decode(payload);
        //router.push({name: 'Notes'});
      }
    }
  },
  actions: {
    saveUser({commit}, payload){
      localStorage.setItem('token', payload);
      commit('getUser', payload);
    },
    closeSession({commit}){
      commit('getUser', '');
      localStorage.removeItem('token');
      router.push({name: 'Login'});
    },
    readToken({commit}){
      const token = localStorage.getItem('token');
      if (token) {
        commit('getUser', token);
      } else {
        commit('getUser', '');
      }
    }
  },
  getters: {
    active: state => !!state.token
  }
})
