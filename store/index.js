import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        auth: {
            token: ''
        },
        currentPage: 1,
        data: {},
        fullPictureData: false
    },
    mutations: {
        SET_IMAGES_TO_STATE(state, response) {
            state.data = response
        },
        SET_PAGE(state, page) {
            state.currentPage = page
        },
        SET_FULL_PICTURE_DATA(state, response) {
            state.fullPictureData = response
        }
    },
    actions: {
        AUTH({commit}) {
            return this.$axios.$post('http://interview.agileengine.com/auth', {
                apiKey: process.env.API_KEY,
            })
                .then((response) => {
                    this.state.auth.token = response?.token
                    this.$axios.setHeader('Authorization', this.state.auth.token)
                    return response
                })
                .catch((error) => {
                    console.log(error)
                    return error
                })
        },
        GET_IMAGES_PAGE({commit}, page) {
            const url = page > 1 ? `http://interview.agileengine.com/images?page=${page}` : 'http://interview.agileengine.com/images';
            return this.$axios.$get(url)
                .then((response) => {
                    commit('SET_IMAGES_TO_STATE', response)
                    return response
                })
                .catch((error) => {
                    console.log(error)
                    return error
                })
        },
        GET_IMAGES_FROM_API({commit, dispatch}, page = 1) {
            if (!this.state.auth.token) {
                dispatch('AUTH')
                    .then((resp) => {
                        dispatch('GET_IMAGES_PAGE', page)
                    })
            } else {
                dispatch('GET_IMAGES_PAGE', page)
            }
        },
        CHANGE_PAGE({commit, dispatch}, page) {
            commit('SET_PAGE', page)
            dispatch('GET_IMAGES_FROM_API', page)
        },
        LOAD_FULL_PICTURE_DATA({commit}, picture){
            return this.$axios.$get(`http://interview.agileengine.com/images/${picture.id}`)
                .then((response) => {
                    commit('SET_FULL_PICTURE_DATA', response)
                    return response
                })
                .catch((error) => {
                    console.log(error)
                    return error
                })
        }
    },
    getters: {
        DATA(state) {
            return state.data
        },
        CURRENT_PAGE(state) {
            return state.currentPage
        },
        FULL_PICTURE_DATA(state) {
            return state.fullPictureData
        }
    }
})

export default store
