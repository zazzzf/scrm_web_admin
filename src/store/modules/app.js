import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
  },
  language:'',
  device: 'desktop',
  loading: 0,
  isMobile: false,
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_LOADING: (state, type) => {
    if(type == "add"){state.loading ++}
    if(type == "end"){state.loading --}
    if(type == "clear"){state.loading = 0}
  },
  SET_UA:(state, type) => {
    state.isMobile = type
  }
  
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setLoading({commit}, type){
    commit('SET_LOADING',type)
  },
  setUA({commit},ua){
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    var isAndroid = ua.match(/(Android)\s+([\d.]+)/);
    var isMobile = isIphone || isAndroid ? true:false;
    commit('SET_UA',isMobile)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
