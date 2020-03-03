import {  logon } from '@/api/login'
import tagsApi from '@/api/tags'
import { categoryList } from '@/api/admin.js';
import { getToken, setToken, removeToken, getRole } from '@/utils/auth'
import Cookies from 'js-cookie'

import config from '@/config/config.js'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  tagList:[],
  categoryList:[],
  userRole: getRole(),
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
  SET_CATEGORY: (state, data) => {
    state.categoryList = data
  },
  SET_USERINFO: (state, data) => {
    state.userinfo = data
  },
  SET_USERROLE: (state, data) => {
    state.userRole = data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      logon({ userName: userName.trim(), password: password }).then(response => {
        const { data } = response
        /** 前端控制路由  默认设置为 editor    管理员全部权限为   admin
         */

        const ADMIN_LIST = config.ADMIN_LIST;
        if(ADMIN_LIST.indexOf(data.username) == -1){
          data.role = "editor"
        }else{
          data.role = "admin"
        }

        Cookies.set('userName', data.username, {expires: 7});
        Cookies.set('user_id', data.user_id, {expires: 7});
        Cookies.set('master', data.master, {expires: 7});
        Cookies.set('userinfo', JSON.stringify(data), {expires: 7});


        commit('SET_TOKEN', data.token)
        commit('SET_USERROLE', data.role)
        commit('SET_NAME', data.username)
        // commit('SET_USERINFO', data.role)
        setToken(data.token)
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
      Cookies.remove('SCS_PLATE_TOKEN');
      Cookies.remove('token');

      commit('SET_TOKEN', '')
      commit('SET_USERROLE', '')
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
  
  getCategoryList({ commit, state }) {
	  return new Promise((resolve, reject) => {
	    categoryList({noloading:true}).then(response => {
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

