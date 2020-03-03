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
 * constantRouterMap
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [{
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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/home/index'),
      meta: {
        title: 'dashboard',
        icon: 'dashboard',
        affix: true
      }
    }]
  },

  


  // 404 page must be placed at the end !!!
  
]

export const asyncRouterMap = [
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    meta:{
      role:['admin'],
    },
    children: [{
      path: 'index',
      component: () => import('@/views/profile/index'),
      name: 'Profile',
      meta: {
        title: 'profile',
        icon: 'user',
        noCache: true,
        role:['admin']
      }
    }]
  },
  /**
   * 账户管理
   */
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/account',
    name: 'manage',
    meta: {
      title: 'manage',
      icon: 'huiyuan',
      role:['admin']
    },
    children: [{
        path: 'account',
        name: 'account',
        component: () => import('@/views/manage/index.vue'),
        meta: {
          title: 'account',
          icon: 'mange',
          affix: true,
          role:['admin']
        }
      },
      {
        path: 'manage-add',
        name: 'manageAdd',
        hidden: true,
        component: () => import('@/views/manage/add.vue'),
        meta: {
          title: 'manageAdd',
          icon: 'mange',
          affix: true,
          role:['admin']
        }
      },
    ]
  },
    /**
   * 案例研究
   */
  {
    path: '/case',
    component: Layout,
    redirect: '/case/case-manage',
    name: 'case',
    meta: {
      title: 'case',
      icon: 'clipboard',
      role:['admin']
    },
    children: [{
        path: 'case-manage',
        name: 'caseManage',
        component: () => import('@/views/case/index.vue'),
        meta: {
          title: 'caseManage',
          icon: 'clipboard',
          affix: true,
          role:['admin']
        }
      },
      {
        path: 'script-manage',
        name: 'scriptManage',
        component: () => import('@/views/script/index.vue'),
        meta: {
          title: 'scriptLibrary',
          icon: 'people',
          affix: true,
          role:['admin']
        }
      },
      {
        path: 'script-add',
        name: 'scriptAdd',
        hidden: true,
        component: () => import('@/views/script/add.vue'),
        meta: {
          title: 'scriptAdd',
          icon: 'mange',
          affix: true,
          role:['admin']
        }
      },
      {
        path: 'case-add',
        name: 'caseAdd',
        hidden: true,
        component: () => import('@/views/case/add.vue'),
        meta: {
          title: 'caseAdd',
          icon: 'mange',
          affix: true,
          role:['admin']
        }
      },
    ]
  },
  /**
   * 热点追踪
   */
  {
    path: '/hotTrack',
    component: Layout,
    redirect: '/hotTrack/hot-rank',
    name: 'hotTrack',
    meta: {
      title: '热点追踪',
          role:['admin','editor'],
          icon: 'hot'
    },
    children: [{
        path: 'hot-rank',
        name: 'hotRank',
        component: () => import('@/views/hot/hotRank'),
        meta: {
          title: '热点排行',
          icon: 'chart',
          role:['admin'],
          affix: true
        }
      },
      {
        path: 'hot-Video',
        name: 'hotVideo',
        component: () => import('@/views/hot/hotVideo'),
        meta: {
          title: '热点视频',
          icon: 'hotVideo',
          role:['admin','editor'],
          affix: true
        }
      },
      
    ]
  },
  {
    path: '/hotTrack/hot-Video-add',
    component: Layout,
    hidden:true,
    role:['admin','editor'],
    children:[{
      path: '/hotTrack/hot-Video-add',
      component: () => import('@/views/hot/hotVideo/add'),
      name: 'hotVideoAdd',
      meta: {
        title: '热点视频添加',
        icon: 'hotVideo',
        role:['admin','editor'],
        affix: true
      },
    }]
  },

/**
 * 内部报告
 */
{
  path: '/internal',
  component: Layout,
  redirect: '/internal',
  meta:{
    role:['admin'],
  },
  children: [{
    path: 'internal',
    name: 'Internal',
    component: () => import('@/views/internal/index'),
    meta: {
      title: 'internal',
      icon: 'internal',
          role:['admin'],
          affix: true
    }
  },
  {
    path: 'internal-add',
    name: 'internalAdd',
    hidden: true,
    component: () => import('@/views/internal/add.vue'),
    meta: {
      title: 'internalAdd',
      icon: 'mange',
          role:['admin'],
          affix: true
    }
  }]
},
  /**
   * 社交报告
   */
  {
    path: '/sns',
    component: Layout,
    redirect: '/sns/sns-manage',
    name: 'sns',
    meta: {
      title: 'sns',
      role:['admin'],
      icon: 'documentation'
    },
    children: [{
        path: 'sns-manage',
        name: 'snsManage',
        component: () => import('@/views/sns/index.vue'),
          
          meta: {title: 'snsManage',icon: 'documentation',role:['admin'],affix: true}
      },
      {
        path: 'sns-add',
        name: 'snsAdd',
        hidden: true,
        component: () => import('@/views/sns/add.vue'),
        meta: {title: 'snsAdd',icon: 'mange', role:['admin'],affix: true}
      },
      {
        path: 'sns-set',
        name: 'snsSet',
        component: () => import('@/views/sns/set/snsSet.vue'),
        meta: {title: 'snsSet',icon: 'edit',role:['admin'],affix: true}
      },
      {
        path: 'sns-set-add',
        name: 'snsSetAdd',
        hidden: true,
        component: () => import('@/views/sns/set/addSet.vue'),
        meta: {title: 'snsSet',icon: 'edit',role:['admin'],affix: true}
      },
      {
        path: 'sns-report',
        name: 'snsReport',
        component: () => import('@/views/sns/report/report.vue'),
        meta: {title: 'snsReport',icon: 'edit',role:['admin'],affix: true}
      },
      {
        path: 'sns-report-add',
        name: 'snsReportAdd',
        hidden: true,
        component: () => import('@/views/sns/report/addReport.vue'),
        meta: {title: 'snsSet',icon: 'edit',role:['admin'],affix: true}
      },
    ]
  },
  /**
   * 后台管理
   */
  {
    path: '/course',
    component: Layout,
    redirect: '/course/course-manage',
    name: 'course',
    hidden: true,
    meta: { title: 'course', role:['admin'],icon: 'huiyuan' },
    children: [{
        path: 'course-manage',
        name: 'courseManage',
        component: () => import('@/views/course/index.vue'),
        meta: { title: 'courseManage',role:['admin'], icon: 'qq', affix: true }
      },
    ]
  },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/admin-manage',
    name: 'admin',
    meta: {
      title: 'admin',
      role:['admin'],
      icon: 'edit'
    },
    children: [{
      path: 'admin-manage',
      name: 'adminManage',
      component: () => import('@/views/admin/index.vue'),
      meta: {
        title: 'adminManage',
        icon: 'peoples',role:['admin'],
        affix: true
      }
    },
    /**
     * 标签管理
     */ 
    {
      path: 'tags-manage',
      name: 'tagsManage',
      component: () => import('@/views/admin/tag.vue'),
      meta: {title: 'tagsManage', icon: 'tag',role:['admin'], affix: true }
    },
    {
      path: 'class-manage',
      name: 'classManage',
      component: () => import('@/views/admin/class.vue'),
      meta: {title: 'classManage', icon: 'table', affix: true, role:['admin']}
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

const router = createRouter()


// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
