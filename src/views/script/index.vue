<template>
	<el-card>
		
		<div slot="header" >
			<span>{{$t('casemanage.script_manage')}}</span>
		    <el-button type="text" style="float: right;padding: 3px 0">
				<router-link to="/case/script-add">
				    {{$t('casemanage.add_script')}}
				</router-link>
			</el-button>
		</div>
		<div class="search-box">
			<el-form  ref="searchForm" :model="searchData" inline="">
				<el-form-item prop="title">
					<el-input v-model="searchData.title" style="width: 300px;" :placeholder="$t('search.title')"></el-input>
				</el-form-item>
				<el-form-item prop="tag">
					<el-select clearable  v-model="searchData.tag" multiple collapse-tags  :placeholder="$t('search.tag')">
						<el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="status">
					<el-select clearable  v-model="searchData.status" :placeholder="$t('search.check_status')">
						<el-option :label="$t('search.pass')" :value="1"></el-option>
						<el-option :label="$t('search.nopass')" :value="-1"></el-option>
						<el-option :label="$t('home.wait_pass')" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click='handleSearch'>{{$t('table.search')}}</el-button>
					<el-button type="text" @click='resetSearch'>{{$t('search.reset')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div style="min-height: 700px;">
			<el-table :data="scriptList">
				<el-table-column :label="$t('title')" prop="title" min-width="200"></el-table-column>
				<el-table-column :label="$t('home.status')">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.status == 1">{{$t('home.is_pass')}}</el-tag>
						<el-tag type="danger" v-if="scope.row.status == -1">{{$t('home.not_pass')}}</el-tag>
						<el-tag type="default" v-if="scope.row.status == 0">{{$t('home.wait_pass')}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('home.creat_name')" prop="username" ></el-table-column>
				<el-table-column :label="$t('checkname')" prop="check_manager" ></el-table-column>
				<el-table-column :label="$t('home.creat_time')" prop="created" min-width="120"></el-table-column>
				<el-table-column :label="$t('operation')" min-width="300">
					<template slot-scope="scope">
						<el-button size="mini" type="info" @click='readSns(scope.row)' round>{{$t('search.read')}}</el-button>
						<el-button size="mini" type="warning" round @click='checkedSns(scope.row)'>{{$t('search.checked')}}</el-button>
						<el-button size="mini" round type="primary" @click='editSns(scope.row)'>{{$t('edit')}}</el-button>
						<el-button size="mini" type="danger" round @click='deleteSns(scope.row.script_id)'>{{$t('delete')}}</el-button>
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
		<el-dialog :visible.sync="readSnsShow" top='2vh' min-width='375px'>
			<p style="font-size: 18px; text-align: center;">{{readSnsData.title}}</p>
			<el-form style="margin:20px 0" label-width="130px" v-if="readSnsShow">
				<el-form-item :label="$t('title')">{{ readSnsData.title }}</el-form-item>
				<el-form-item :label="$t('casemanage.cover')">
					<img :src='readSnsData.cover' width="100px" />
				</el-form-item>
				<el-form-item label="审核状态">
					<el-tag type="success" v-if="readSnsData.status == 1">{{$t('home.is_pass')}}</el-tag>
					<el-tag type="danger" v-if="readSnsData.status == -1">{{$t('home.not_pass')}}</el-tag>
					<el-tag type="default" v-if="readSnsData.status == 0">{{$t('home.wait_pass')}}</el-tag>
				</el-form-item>
				<el-form-item label="不通过原因" v-if="readSnsData.status == -1">{{ readSnsData.reason }}</el-form-item>
				<el-form-item :label="$t('home.creat_name')">{{ readSnsData.username }}</el-form-item>
				<el-form-item :label="$t('home.creat_time')">{{ readSnsData.created }}</el-form-item>
				<el-form-item :label="$t('checkname')">{{ readSnsData.check_manager }}</el-form-item>
				<el-form-item :label="$t('casemanage.tag')">
					<el-tag v-for="item in readSnsData.tag" :key='item.tag_id'>{{item.name}}</el-tag>
				</el-form-item>
				<el-form-item label="内容">
					<div v-html="readSnsData.content"></div>
				</el-form-item>
			</el-form>
			<div slot='footer' v-if="doWhat=='checked'">
				<el-input type="textarea" :rows="2" placeholder="若不通过,请输入审核不通过原因" style="margin-bottom: 10px;" v-model="nocheckedreason"></el-input>
				<el-button type="primary" @click='checkedSnsStatus(1)'>{{$t('search.pass')}}</el-button>
				<el-button type="danger" @click='checkedSnsStatus(-1)'>{{$t('search.nopass')}}</el-button>
				<el-button type="default" @click='checkedSnsStatus()'>{{$t('cancel_text')}}</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
import scriptApi from '@/api/script.js'
	export default{
		data(){
			return{
				scriptList:[],
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
					tag:[],
					status:'',
				}
				
			}
		},
		computed:{
			tagsList(){
				return this.$store.getters.tagList
			}
		},
		methods:{
			getList(){
				let postData = {
					page:this.pageData.page,
					pageSize:10,
					keywords: this.searchData.title,
				};
				if(this.searchData.tag.length>0){
					var tags = '';
					this.searchData.tag.forEach(item => {
						tags = tags.concat(`${item},`)
					})
					postData.tag = tags.substr(0,tags.length-1);
				}
				if(this.searchData.status)postData.status = this.searchData.status
				scriptApi.getList(postData).then(res => {
					this.scriptList = res.data.list
					this.pageData.count = res.data.count;
				})
			},
			editSns(data){
				if(data){
					this.$router.push({
						name:'scriptAdd',
						params: {
							data,
						}
					})
				}
			},
			checkedSns(data){
				this.readSnsData = data;
				this.doWhat = 'checked';
				this.readSnsShow = true;
				this.$nextTick(()=>{
					if(data.content.indexOf('<iframe')){
						var iframe = document.querySelectorAll('iframe');
						for(var i = 0; i<iframe.length;i++){
							iframe[i].width = '100%';
							iframe[i].height = '300px';
						}
					}
				})
			},
			checkedSnsStatus(status){
				if(status){
					let postData = {scriptId :this.readSnsData.script_id,status};
					if(status == -1&&!this.nocheckedreason){this.$message.warning('请输入审核不通过原因');return}
					if(status == -1&&this.nocheckedreason){postData.negativeReason = this.nocheckedreason}
					scriptApi.checkScript(postData).then(res => {
						this.$message.success('审核完成');
						this.readSnsShow = false;
						this.getList();
					})
				}else{
					this.readSnsShow = false;
				}
			},
			deleteSns(script_id){
				this.$confirm('此操作将永久删除该案例, 是否继续?', '提示', {
				  confirmButtonText: '确认删除',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  scriptApi.delScript({scriptId: script_id}).then(res => {
				  	this.$message.success('删除成功');
				  	this.getList();
				  })
				}).catch(() => {
				           
				});
				
			},
			readSns(data){
				this.readSnsData = data;
				this.readSnsShow = true;
				this.$nextTick(()=>{
					if(data.content.indexOf('<iframe')){
						var iframe = document.querySelectorAll('iframe');
						for(var i = 0; i<iframe.length;i++){
							iframe[i].width = '100%';
							iframe[i].height = '300px';
						}
					}
				})
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
	iframe{
		width: 100%;
		height: 400px;
	}
</style>
