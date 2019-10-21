<template>
    <el-card shadow='never'>
		<div slot="header" >
			<span>后台账号管理</span>
		    <el-button type="text" style="float: right;padding: 3px 0" @click="showEditModal()" >添加账号</el-button>
		</div>
        <div>
            <el-table :data="userList">
				<el-table-column prop="manage_user_id" label="ID" ></el-table-column>
				<el-table-column prop="username" :label="$t('profile.username')" ></el-table-column>
				<el-table-column prop="mobile" :label="$t('profile.mobile')"></el-table-column>
				<el-table-column prop="action" :label="$t('operation')" min-width="200" >
					<template slot-scope="scope"    >
                        <el-button
						  size="mini"
						  type="primary"
						  @click="handleEdit(scope.row)">{{$t('edit')}}</el-button>
						<el-button
						  size="mini"
						  type="danger"
                          v-if="scope.row.manage_user_id!==1"
						  @click="handleDelete(scope.row.manage_user_id)">{{$t('delete')}}</el-button>
					</template>
                    
				</el-table-column>
			</el-table>
        </div>
		<el-pagination
		  background
		  v-if='pageData.count>10'
		  layout="prev, pager, next"
		  :total="pageData.count"
		  @current-change='pageChange'>
		</el-pagination>
        <el-dialog 
        :visible.sync="showEdit" 
        width='375px' 
        :modal-append-to-body='false' 
        :title="editId?'修改账号':'添加账号'"  
        :close-on-click-modal='false'>
            <el-form :model="userForm" :rules="rules" ref="userForm"  class="demo-ruleForm">
                <el-form-item :label="$t('profile.username')" prop="username">
                    <el-input v-model="userForm.username" prefix="ios-contact" placeholder="请输入用户名"  />
                </el-form-item>
                <el-switch
                    v-model="ischangePassword"
                    v-if="editId"
                    style="margin-bottom:20px"
                    active-text="改密"
                    inactive-text="不改密">
                </el-switch>
                <template v-if="ischangePassword||!editId">
                    <el-form-item :label="$t('password')" prop="password">
                        <el-input v-model="userForm.password" show-password prefix="ios-contact" placeholder="请输入密码"  />
                    </el-form-item>
                    <el-form-item :label="$t('confirm_password')" prop="confirmPassword">
                        <el-input v-model="userForm.confirmPassword" show-password  prefix="ios-contact" placeholder="请输入确认密码"  />
                    </el-form-item>
                </template>
            </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancalSet">取 消</el-button>
				<el-button type="primary" @click="confirmModal" :loading="fullscreenLoading">确 定</el-button>
			  </span>
        </el-dialog>
    </el-card>    
</template>
<script>
import adminUser from '@/api/admin'
export default {
    data() {
        return{
            ischangePassword:false,
            fullscreenLoading:false,
            userList: [],
            showEdit: false,
            editId:'',
            userForm:{
                username:'',
                password:'',
                confirmPassword:'',
            },
            rules: {
                username: [{ required: true, message: '请填写用户名', trigger: 'change' }],
                password: [{ required: true, message: '请填写密码', trigger: 'change' }],
                confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'change' }],
            },
			pageData:{
				page:1,
				count:null,
			}
        }
    },
    methods:{
		pageChange(page){
			this.pageData.page = page;
			this.getUserList();
		},
        getUserList(){
			let postData = {
				page: this.pageData.page,
				pageSize:10,
			};
            adminUser.userList(postData).then( res => {
                this.userList = res.data.list;
				this.pageData.count = res.data.count;
            })
        },
        showEditModal(id){
            this.editId = id
            this.showEdit = true;
        },
        
        confirmModal(){
            this.fullscreenLoading = true;
            let postData = {
                notLoading: 1,
                username: this.userForm.username,
            };  
            if(this.editId){
                postData.id = this.editId;
                if(this.ischangePassword){
                    postData.password = this.userForm.password
                    postData.confirmPassword = this.userForm.confirmPassword
                }
                adminUser.editUser(postData).then(data => {
                    this.$message.success('修改成功');
                    this.showEdit = false;
                    this.fullscreenLoading = false;
                    this.getUserList();
                }).catch((err) => {
                    this.fullscreenLoading = false;
                })
            }else{
                postData.password = this.userForm.password
                postData.confirmPassword = this.userForm.confirmPassword
                adminUser.addUser(postData).then(data => {
                    this.$message.success('添加成功');
                    this.showEdit = false;
                    this.fullscreenLoading = false;
                    this.getUserList();
                }).catch((err) => {
                    this.fullscreenLoading = false;
                })
            }
            
        },
		handleEdit(data){
			this.userForm.username = data.username;
			this.showEditModal(data.manage_user_id)
		},
		handleDelete(id){
			this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				adminUser.delUser({id:id}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.getUserList();
				})
			  
			}).catch(() => {
			        
			});
        },
        cancalSet(){
            this.showEdit = false;
            this.$refs['userForm'].resetFields();
            this.editId = '';
        }
    },
    created(){
        this.getUserList();
    }
}
</script>
