import {  logon } from '@/api/login'
import tagsApi from '@/api/tags'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  tagList:[],
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
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      logon({ userName: userName.trim(), password: password }).then(response => {
        const { data } = response
			Cookies.set('userName', data.userName, {expires: 7});
		  Cookies.set('user_id', data.user_id, {expires: 7});
		  Cookies.set('master', data.master, {expires: 7});
		  Cookies.set('userinfo', JSON.stringify(data), {expires: 7});
        commit('SET_TOKEN', data.token)
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
      Cookies.remove('email');
      Cookies.remove('store_id');
      Cookies.remove('userName');
      Cookies.remove('master');
      Cookies.remove('user_id');
      Cookies.remove('userinfo');
      Cookies.remove('SCRM_PLATE_TOKEN');
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
	}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

