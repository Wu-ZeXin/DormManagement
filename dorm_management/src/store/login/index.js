import { reqLoginInfo } from '@/api/index'

export default {
  namespaced: true,

  state: {
    routeLists: []
  },

  actions: {
  },

  mutations: {
    SETROUTELISTS(state, data) {
      state.routeLists = data
    }
  },

  getters: {

  }
}