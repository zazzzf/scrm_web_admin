<template>
	<el-card>
		
		<div slot="header" >
			<span>集合管理</span>
		    <el-button type="text" style="float: right;padding: 3px 0" >
				   <router-link to="/sns/set-add">
                        添加集合
                   </router-link>
			</el-button>
		</div>
		<div style="min-height: 700px;">
			<el-table :data="caseList">
				<el-table-column label="集合标题" prop="title" ></el-table-column>
				<el-table-column label="集合状态" prop="status" >
                    <template slot-scope="e">
                        <el-select v-model="e.row.status" @change="changeStatus($event,e.row.id)">
                            <el-option label="关闭" :value="-1"></el-option>
                            <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
				<el-table-column :label="$t('home.creat_time')" prop="created" ></el-table-column>
				<el-table-column :label="$t('operation')" min-width="300">
					<template slot-scope="scope">
						<el-button size="mini"  type="primary" @click='editSet(scope.row)'>{{$t('edit')}}</el-button>
						<el-button size="mini"  type="danger" @click='delSet(scope.row.id)'>{{$t('delete')}}</el-button>
					 </template>
				</el-table-column>
			</el-table>
		</div>
	</el-card>
</template>

<script>
import setsApi from '@/api/sets.js'
import Upload from '@/components/coustom-upload'
	export default{
		components:{Upload},
		data(){
			return{
				showDialog: false,
				formData:{
					reportName:"",
					reportFileName:"",
					categoryId:"",
				},
				rules:{
					reportFileName: [
						{ required: true, message: '请上传报告', trigger: 'change' }
					],
					reportName: [
						{ required: true, message: '请填入报告名', trigger: 'change' }
					],
					categoryId: [
						{ required: true, message: '请选择分类', trigger: 'change' ,type: "number"}
					],
				},
				caseList:[],
				readSnsShow:false,
				readSnsData:{},
				nocheckedreason:"",
				doWhat:'',
				pageData:{
					page:1,
					count:null,
				},
				searchData:{
					title:'',
					tag:'',
					status:'',
				}
			}
		},
		computed:{
			
			categoryList(){
				return this.$store.getters.categoryList
			}
		},
		methods:{
			getLink(e){this.formData.reportFileName = e},
			changeStatus(status,id){
                let postData = {
                    id,
                    status,
                }
                setsApi.status(postData).then(res => {
                    this.$message.success('修改成功')
                    this.getList()
                })
            },
			getList(){
				let postData = {
					page:this.pageData.page,
					pageSize:10,
					keywords: this.searchData.title,
				};
				// if(this.searchData.tag.length>0){
				// 	var tags = '';
				// 	this.searchData.tag.forEach(item => {
				// 		tags = tags.concat(`${item},`)
				// 	})
				// 	postData.categoryId = tags.substr(0,tags.length-1);
				// }
				if(this.searchData.tag)postData.categoryId = this.searchData.tag
				setsApi.list(postData).then(res => {
					this.caseList = res.data
				})
			},
			editSet(data){
				if(data){
					this.$router.push({
						name:'setsAdd',
						params: {
							data,
						}
					})
				}
			},
			
			delSet(id){
				this.$confirm('此操作将永久删除该集合, 是否继续?', '提示', {
				  confirmButtonText: '确认删除',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  setsApi.del({knowledgeSetId:id}).then(res => {
				  	this.$message.success('删除成功');
				  	this.getList();
				  })
				}).catch(() => {
				           
				});
				
			},
			
			pageChange(page){
				this.pageData.page = page;
				this.getList();
			},
			handleSearch(){
				this.pageData.page = 1;
				this.getList();
			},
			resetSearch(){
				this.pageData.page = 1;
				this.$refs.searchForm.resetFields();
				this.getList();
			}
		},
		created(){
			this.getList()
		}
	}
</script>

<style lang="less" scoped>
	video:focus{
		outline: none;
	}
	.video-number{
		margin-bottom: 20px;
		border-top:1px solid #BFCBD9;
		border-bottom:1px solid #BFCBD9;
		p{
			text-align: center;
		}
	}
</style>
