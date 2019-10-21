<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>{{$t('profile.userinfo')}}</span>
      <el-button type="text" style="float: right;padding: 3px 0" @click="showChange = true">
				    {{$t('profile.change_password')}}
			</el-button>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          <br>
          {{ user.username }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.username }}</div>
        <div class="user-role text-center text-muted">{{ user.role}}</div>
      </div>
    </div>
    <el-divider />
    <div class="user-bio">
      <p  class="text item">{{$t('profile.username')}} ： {{ user.username?user.username:'0000000' }}</p>
      <p  class="text item">{{$t('profile.mobile')}} ： {{ user.mobile?user.mobile:'0000000' }}</p>
      <p  class="text item">{{$t('profile.email')}} ： {{ user.email?user.email:'0000000' }}</p>
    </div>
    <el-divider />
    <el-dialog :visible.sync="showChange" :title="$t('profile.change_password')">
      <el-form ref="ruleForm" :model="formData" :rules="ruleform">
        <el-form-item :label="$t('password')" prop="password">
          <el-input  :placeholder="$t('profile.in_new_password')" v-model="formData.password" show-password></el-input>
        </el-form-item>
        <el-form-item :label="$t('confirm_password')" prop="confirmPassword">
          <el-input :placeholder="$t('profile.in_again_password')" v-model="formData.confirmPassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="changePassword">{{$t('ok_text')}}</el-button>
        <el-button @click='showChange = false'>{{$t('cancel_text')}}</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { changepassword } from "@/api/login.js";

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          roles: ''
        }
      }
    }
  },
  data(){
    return{
      showChange:false,
      formData:{
        password:'',
        confirmPassword:'',
      },
      ruleform:{
        password:[{ required: true,min:6, message: this.$t('profile.in_new_password'), trigger: 'change' }],
        confirmPassword:[{ required: true, min:6, message: this.$t('profile.in_again_password'), trigger: 'change' }]
      }
    }
  },
  methods:{
    changePassword(){
      this.$refs['ruleForm'].validate(valid => {
        if(valid&& this.formData.password === this.formData.confirmPassword){
          let postData = {
            password: this.formData.password,
            confirmPassword: this.formData.confirmPassword,
          };
          changepassword(postData).then(res => {
            this.$message.success(this.$t('message.edit_success'));
            this.$refs['ruleForm'].resetFields();
            this.showChange = false;
          })
        }else if(valid&& this.formData.password !== this.formData.confirmPassword){
            this.$message.info(this.$t('profile.password_error'));
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
