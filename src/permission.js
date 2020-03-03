import router from './router'
import {resetRouter} from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken,getRole } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Cookies from 'js-cookie'
import {GetUrlRelativePath} from "@/utils/relurl.js"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  await store.dispatch("app/setUA", navigator.userAgent)
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const userRole = store.getters.userRole

  if (hasToken) {
    
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path:'/'})
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.tagList.length>0?true:false
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getTags')
          await store.dispatch('user/getCategoryList')
          await store.dispatch('app/setLoading',"clear")
          store.dispatch('GenerateRoutes', { roles: [userRole] }).then(() => { // 生成可访问的路由表
            resetRouter(); //初始化路由
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        } catch (error) {
          // remove token and go to login page to re-login
		  
          // await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
