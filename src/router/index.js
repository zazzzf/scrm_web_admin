import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
	{
	  path: '/profile',
	  component: Layout,
	  redirect: '/profile/index',
	  hidden: true,
	  children: [
		{
		  path: 'index',
		  component: () => import('@/views/profile/index'),
		  name: 'Profile',
		  meta: { title: 'profile', icon: 'user', noCache: true }
		}
	  ]
	},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/home/index'),
      meta: { title: 'dashboard', icon: 'dashboard', affix: true }
    }]
  },
  
  {
	path: '/manage',
	component: Layout,
	redirect: '/manage/account',
	name: 'manage',
	meta: { title: 'manage', icon: 'huiyuan' },
    children: [
	{
      path: 'account',
      name: 'account',
      component: () => import('@/views/manage/index.vue'),
      meta: { title: 'account', icon: 'mange', affix: true }
    },
	{
		path: 'manage-add',
		name: 'manageAdd',
		hidden: true,
		component: () => import('@/views/manage/add.vue'),
		meta: { title: 'manageAdd', icon: 'mange', affix: true }
	},
	]
  },
	
  {
  	path: '/case',
  	component: Layout,
  	redirect: '/case/case-manage',
  	name: 'case',
  	meta: { title: 'case', icon: 'clipboard' },
    children: [
  	{
      path: 'case-manage',
      name: 'caseManage',
      component: () => import('@/views/case/index.vue'),
      meta: { title: 'caseManage', icon: 'clipboard', affix: true }
    },
	{
	  path: 'script-manage',
	  name: 'scriptManage',
	  component: () => import('@/views/script/index.vue'),
	  meta: { title: 'scriptLibrary', icon: 'people', affix: true }
	},
	{
		path: 'script-add',
		name: 'scriptAdd',
		hidden: true,
		component: () => import('@/views/script/add.vue'),
		meta: { title: 'scriptAdd', icon: 'mange', affix: true }
	},
	{
		path: 'case-add',
		name: 'caseAdd',
		hidden: true,
		component: () => import('@/views/case/add.vue'),
		meta: { title: 'caseAdd', icon: 'mange', affix: true }
	},
	{
		path: 'resource',
		name: 'resource',
		component: () => import('@/views/case/resource'),
		meta: { title: 'resource', icon: 'mange', affix: true }
	},
  	]
  },
  {
  	path: '/sns',
  	component: Layout,
  	redirect: '/sns/sns-manage',
  	name: 'sns',
  	meta: { title: 'sns', icon: 'documentation' },
    children: [
  	{
      path: 'sns-manage',
      name: 'snsManage',
      component: () => import('@/views/sns/index.vue'),
      meta: { title: 'snsManage', icon: 'documentation', affix: true }
    },
	{
		path: 'sns-add',
		name: 'snsAdd',
		hidden: true,
		component: () => import('@/views/sns/add.vue'),
		meta: { title: 'snsAdd', icon: 'mange', affix: true }
	},
  	]
  },
  {
  	path: '/course',
  	component: Layout,
  	redirect: '/course/course-manage',
  	name: 'course',
  	meta: { title: 'course', icon: 'huiyuan' },
    children: [
  	{
      path: 'course-manage',
      name: 'courseManage',
      component: () => import('@/views/course/index.vue'),
      meta: { title: 'courseManage', icon: 'qq', affix: true }
    },
    
  	]
  },
	{
		path: '/tags',
		component: Layout,
		redirect: '/tags/tags-manage',
		name: 'tags',
		meta: { title: 'tags', icon: 'edit' },
	  children: [
		{
	    path: 'tags-manage',
	    name: 'tagsManage',
	    component: () => import('@/views/tags/index.vue'),
	    meta: { title: 'tagsManage', icon: 'edit', affix: true }
	  },
		]
	},
  {
  	path: '/admin',
  	component: Layout,
  	redirect: '/admin/admin-manage',
  	name: 'admin',
  	meta: { title: 'admin', icon: 'peoples' },
    children: [
  	{
      path: 'admin-manage',
      name: 'adminManage',
      component: () => import('@/views/admin/index.vue'),
      meta: { title: 'adminManage', icon: 'peoples', affix: true }
    },
  	]
  },
  
  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
