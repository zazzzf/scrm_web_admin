<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <lang-select class="right-menu-item hover-effect" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span style="position:relative; bottom:17px; margin-right:10px">{{userinfo.userName}}</span>
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/profile">
            <el-dropdown-item>
              {{$t('navbar.profile')}}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LangSelect from '@/components/LangSelect'
import Cookies from 'js-cookie'


export default {
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect
  },
  data(){
    return{
      userinfo: JSON.parse(Cookies.get('userinfo'))||{},
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      // await this.$store.dispatch('user/logout')
      Cookies.remove('email');
      Cookies.remove('store_id');
      Cookies.remove('userName');
      Cookies.remove('master');
      Cookies.remove('user_id');
      Cookies.remove('userinfo');
      Cookies.remove('SCRM_PLATE_TOKEN');
      Cookies.remove('token');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  },
  created(){
  }
}
</script>

<style lang="scss" scoped>
.user-dropdown{
  top: 50px !important;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        cursor: pointer;
        .user-avatar {
          // cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
