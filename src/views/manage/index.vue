<template>
    <el-card shadow='never'>
		<div slot="header" >
			<span>商户权限管理</span>
			<el-button type="text" style="float: right;padding: 3px 0">
				<router-link to="/manage/manage-add">
				    添加商户
				</router-link>
			</el-button>
		</div>
        <div>
            <div style="min-height: 580px;">
				<el-table  :data="groupList">
					<el-table-column prop="name" label="公司名称"></el-table-column>
					<el-table-column prop="username" label="主账户名称"></el-table-column>
					<el-table-column prop="email" label="公司邮箱"></el-table-column>
					<el-table-column prop="mobile" label="手机号"></el-table-column>
				    <el-table-column label="创建时间">
				        <template slot-scope="scope">
				            <i class="el-icon-time"></i>
				            <span style="margin-left: 10px">{{ scope.row.date_added }}</span>
				        </template>
				    </el-table-column>
					<el-table-column prop="action" label="操作" >
						<template slot-scope="scope">
							<el-button
							  size="mini"
							  type="primary"
							  @click="handleEdit(scope.row)">配置权限</el-button>
							 <el-button
							   size="mini"
							   type="warning"
							   @click="handleEditAccount(scope.row)">编辑账户</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-pagination
			  background
			  layout="prev, pager, next"
			  :total="pageData.count"
			  @current-change='pageChange'>
			</el-pagination>
        </div>
        <el-dialog :visible.sync="showEdit" width='375px' :mask-closable='false' :title="store_id?'权限修改':'添加权限组'"  @on-ok='confirmModal'>
            <el-input readonly v-model="authName"prefix="ios-contact" placeholder="请输入权限组名称" style="margin-bottom: 30px" />
            <el-tree ref="authTree" :data="userAuth" show-checkbox node-key="id"  :default-checked-keys="selectAuthId"></el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showEdit = false">取 消</el-button>
				<el-button type="primary" @click="confirmModal">确 定</el-button>
			  </span>
        </el-dialog>
    </el-card>    
</template>
<script>
import manageApi from '@/api/manage'
export default {
    data() {
        return{
            groupList: [],
            showEdit: false,
            userAuth: [],
			selectAuthId:[],
            authName:'',
            store_id:'',
			pageData:{
				page:1,
				count:null,
			}
        }
    },
    methods:{
        getUserGroup(){
            let postData = {
                page:this.pageData.page,
                pageSize:10,
            }
            manageApi.getlists(postData).then( data => {
                this.groupList = data.data.list;
				this.pageData.count = data.data.count;
            })
        },
        showEditModal(store_id){
            if(!store_id)this.authName = '';
            this.store_id = store_id;
            manageApi.getPerMissionList({storeId: this.store_id}).then(data => {
                var list = data.data;
                var treeData = [];
                var authList = [];
				var selectId = [];
                for(var i = 0; i<list.length; i++){
                    list[i].label = list[i].name;
                    list[i].id = list[i].node_id;
                    if(list[i].is_auth == 1)authList.push(list[i].node_id)
                    list[i].children = list[i].second
                    list[i].children.forEach(item => {
                        item.label = item.name;
						item.id = item.node_id;
                        item.children = item.third;
                        if(item.is_auth == 1)authList.push(item.node_id)
                        item.children.forEach(son => {
                            son.label = son.name;
							son.id = son.node_id;
							if(son.is_auth==1){
								selectId.push(son.id)
								authList.push(son.node_id)
							}
                        })
                    })
                }
				this.selectAuthId = selectId;
                this.userAuth = list;
                this.showEdit = true;
            })
        },
        
        confirmModal(){
            let list = [];
			let getCheckedNodes = this.$refs.authTree.getCheckedNodes();
			let getHalfCheckedNodes = this.$refs.authTree.getHalfCheckedNodes();
            let treeChecked = [...getCheckedNodes,...getHalfCheckedNodes];
            if(treeChecked.length>0){
                treeChecked.forEach(item => {
                    list.push(item.node_id);
                })
            };
            let postData = {
                permission: JSON.stringify(list),
                name: this.authName,
            };  
            if(this.store_id){
                postData.storeId = this.store_id;
                manageApi.setStorePermission(postData).then(data => {
                    this.$message.success(this.$t('setManage.edit_success'));
					this.showEdit = false;
                    this.getUserGroup();
                })
            }else{
                manageApi.addUserGroup(postData).then(data => {
                    this.$message.success(this.$t('setManage.add_success'));
					this.showEdit = false;
                    this.getUserGroup();
                })
            }
            
        },
		handleEdit(data){
			this.authName = data.name;
			this.showEditModal(data.store_id)
		},
		handleEditAccount(data){
			if(data){
				this.$router.push({
					name:'manageAdd',
					params: {
						data,
					}
				})
			}
		},
		pageChange(page){
			this.pageData.page = page;
			this.getUserGroup();
		}
    },
    created(){
        this.getUserGroup();
    }
}
</script>
