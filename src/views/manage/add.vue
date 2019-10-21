<template>
	<el-card>
		<span slot="header">
			<el-page-header :title="$t('back')"
				@back="getBackManage"
				:content="$t('manage.master_set')"
			></el-page-header>
		</span>
		<div style="padding: 0 200px;">
			<el-form :rules="manageRules" ref="manageForm" :model="manageData" label-width="100px">
				<el-form-item :label="$t('profile.email')" prop="email">
					<el-input v-model="manageData.email"></el-input>
				</el-form-item>
				<el-form-item :label="$t('manage.username')" prop="userName">
					<el-input v-model="manageData.userName"></el-input>
				</el-form-item>
				<el-form-item :label="$t('manage.company_name')"  prop="enterpriseName">
					<el-input v-model="manageData.enterpriseName" :readonly="enterpriseNameReadonly"></el-input>
				</el-form-item>
				<el-switch
					v-if="manageData.userId"
				    v-model="ischangePassword"
				    style="margin-bottom:20px"
				    :active-text="$t('manage.change_password')"
				    :inactive-text="$t('manage.unchange_password')">
				</el-switch>
				<template v-if="!manageData.userId||manageData.userId&&ischangePassword">
					<el-form-item :label="$t('password')" prop="password">
						<el-input v-model="manageData.password" :readonly='noFocus' show-password @focus='passwordBug()'></el-input>
					</el-form-item>
					<el-form-item :label="$t('confirm_password')" prop="confirmPassword">
						<el-input v-model="manageData.confirmPassword" :readonly='noFocus' show-password></el-input>
					</el-form-item>
				</template>
			</el-form>
			<div class="footer">
				<el-button type="primary" @click='commitManage'>{{$t('ok_text')}}</el-button>
				<el-button type="default" @click="getBackManage">{{$t('cancel_text')}}</el-button>
			</div>
		</div>
	</el-card>
</template>
<script>
import manageApi from '@/api/manage';

export default {
	data() {
		return {
			ischangePassword:false,
			enterpriseNameReadonly:false,
			noFocus:true,
			manageData:{
				userId:'',
				email:'',
				userName:'',
				enterpriseName:'',
				password:'',
				confirmPassword:'',
			},
			manageRules:{
				email:[{ required: true, message: '请输入邮箱', trigger: 'blur' }],
				userName:[{ required: true, message: '请输入姓名', trigger: 'blur' }],
				enterpriseName:[{ required: true, message: '请输入公司名称', trigger: 'blur' }],
				password:[{ required: true, message: '请输入密码', trigger: 'blur' }],
				confirmPassword:[{ required: true, message: '请输入确认密码', trigger: 'blur' }],
			}
		};
	},
	methods: {
		passwordBug(){ //解决浏览器自动填充问题
			this.noFocus = false
		},
		commitManage(){
			this.$refs.manageForm.validate((valid)=>{
				if(valid){
					let postData = {
						email: this.manageData.email,
						userName: this.manageData.userName,
						enterpriseName: this.manageData.enterpriseName,
						password: this.manageData.password,
						confirmPassword: this.manageData.confirmPassword,
					}
					if(this.manageData.userId){
						postData.userId = this.manageData.userId
						manageApi.editstoremainaccount(postData).then(res => {
							this.$message.success('修改成功');
							this.getBackManage();
						})
					}else{
						manageApi.addStoreMainAccount(postData).then(res => {
							this.$message.success('添加成功');
							this.getBackManage();
						})
					}
				}
			})
		},
		isEdit(data){
			if(data){
				this.enterpriseNameReadonly = true;
				this.manageData = {
					userId:data.user_id,
					storeId:data.storeId,
					email:data.email,
					userName: data.username,
					enterpriseName: data.name,
					password:'',
					confirmPassword:'',
				}
			}else{
				return
			}
		},
		getBackManage(){
			this.$refs['manageForm'].resetFields();
			this.$router.push('/manage')
		}
		
	},
	created() {
		this.isEdit(this.$route.params.data)
	}
};
</script>
<style>
</style>
