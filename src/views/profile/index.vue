<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card style="max-height:820px">
            <el-tabs v-model="activeTab">
              <el-tab-pane lazy :label="$t('profile.sc_video')" name="account">
                <HotVideo  :height='scheight'></HotVideo>
              </el-tab-pane>
              <el-tab-pane :label="$t('profile.sc_challenge')" name="account1">
                <HotChallenge  :height='scheight'></HotChallenge>
              </el-tab-pane>
              <el-tab-pane :label="$t('profile.sc_hotspot')" name="account2">
                <HotSpotVideo  :height='scheight'></HotSpotVideo>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import HotVideo from './components/video'
import HotChallenge from './components/challenge'
import HotSpotVideo from './components/hotSpot'

export default {
  name: 'Profile',
  components: { UserCard,HotVideo,HotChallenge,HotSpotVideo },
  data() {
    return {
      user: {},
      activeTab: 'account',
      componentsArr:[HotVideo,HotChallenge,HotSpotVideo],
      componentsIndex:1,
			scheight:1,
    }
  },
  computed:{
			currentTabComponent(){
				return this.componentsArr[this.componentsIndex-1]
			}
		},
  created() {
    this.getUser()
  },
  mounted(){
		    var height = document.body.clientHeight; 
		    this.scheight = height - 50-52-70;
		},
  methods: {
    getUser() {
	  var userJSon = Cookies.get('userinfo')
    var user = JSON.parse(userJSon)
    console.log(user)
      this.user = {
        username:  user.username,
        mobile:  user.mobile,
        role: this.userName,
        email: user.email,
        avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
      }
    }
  }
}
</script>
