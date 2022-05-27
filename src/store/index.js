import { createStore } from 'vuex'

export default createStore({
  state: {
    cards: [],
    posts: [],
  },
  getters: {
    getPostsByCardId: (state) => (id) => {
      return state.posts.filter(post => post.category_id === id)
    }
  },
  mutations: {
    getCards(state, cards) {
      state.cards = cards;
    },
    getPosts(state, posts) {
      state.posts = posts;
    },

  },
  actions: {
  },
  modules: {
  }
})
