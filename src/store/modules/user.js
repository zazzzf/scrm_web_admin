import {  logon } from '@/api/login'
import tagsApi from '@/api/tags'
import {categoryApi} from '@/api/category'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  tagList:[],
  categoryList:[]
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TAGLIST: (state, data) => {
    state.tagList = data
  },
  SET_CATEGORY: (state,data) => {
    state.categoryList = data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      logon({ userName: userName.trim(), password: password }).then(response => {
        const { data } = response
        Cookies.set('userName', data.username, {expires: 7});
        Cookies.set('user_id', data.user_id, {expires: 7});
        Cookies.set('master', data.master, {expires: 7});
        Cookies.set('userinfo', JSON.stringify(data), {expires: 7});
        commit('SET_TOKEN', data.token)
        console.log(data.username)
        const userAdmin = ['diandian','admin','nick','heci','houlianjing','koko','xhl']
        if(userAdmin.indexOf(data.username)>=0){
          Cookies.set('role', 'admin', {expires: 7});
        }else{
          Cookies.set('role', 'editor', {expires: 7});
        }

        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TAGLIST', [])
      resolve();
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

	// getTags
	getTags({ commit, state }) {
	  return new Promise((resolve, reject) => {
	    tagsApi.tagList().then(response => {
	      const { data } = response
        commit('SET_TAGLIST', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
	  })
  },
  	// getTags
	getCategory({ commit, state }) {
	  return new Promise((resolve, reject) => {
	    categoryApi.categoryList().then(response => {
	      const { data } = response
        commit('SET_CATEGORY', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
	  })
	}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

