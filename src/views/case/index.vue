<template>
	<el-card>
		
		<div slot="header" >
			<span>{{$t('casemanage.case_manage')}}</span>
		    <el-button type="text" style="float: right;padding: 3px 0">
				<router-link to="/case/case-add">
				    {{$t('casemanage.add_case')}}
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
			<el-table :data="caseList">
				<el-table-column :label="$t('home.case_title')" prop="tiktok_video_name" min-width="400"></el-table-column>
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
						<el-button size="mini" type="danger" round @click='deleteSns(scope.row.inspiration_id)'>{{$t('delete')}}</el-button>
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
			<el-row v-if="readSnsShow">
				<el-col :span="8">
					<video controls="controls" style="width:100%;" :src="readSnsData.no_watermark_video"></video>
				</el-col>
				<el-col :span="16">
					<el-form style="margin:20px 0" label-width="130px" >
						<el-form-item :label="$t('home.case_title')">{{readSnsData.tiktok_video_name}}</el-form-item>
						<el-form-item :label="$t('casemanage.case_status')">
							<el-tag type="success" v-if="readSnsData.status == 1">{{$t('home.is_pass')}}</el-tag>
							<el-tag type="danger" v-if="readSnsData.status == -1">{{$t('home.not_pass')}}</el-tag>
							<el-tag type="default" v-if="readSnsData.status == 0">{{$t('home.wait_pass')}}</el-tag>
						</el-form-item>
						<el-form-item :label="$t('casemanage.case_checkname')">{{readSnsData.check_manager}}</el-form-item>
						<el-form-item :label="$t('casemanage.case_username')">{{readSnsData.username}}</el-form-item>
						<el-form-item :label="$t('home.creat_time')">{{readSnsData.created}}</el-form-item>
						<div class="video-number">
							<el-row>
								<el-col :span="8"><p>获赞</p><p>100000000000</p></el-col>
								<el-col :span="8"><p>获赞</p><p>100000000000</p></el-col>
								<el-col :span="8"><p>获赞</p><p>100000000000</p></el-col>
							</el-row>
						</div>
						<el-form-item :label="$t('casemanage.inspiration')">{{readSnsData.inspiration}}</el-form-item>
						<el-form-item :label="$t('casemanage.reason')">{{readSnsData.reason}}</el-form-item>
						<el-form-item :label="$t('casemanage.learn')">{{readSnsData.learn}}</el-form-item>
						<el-form-item :label="$t('casemanage.tag')">
							<el-tag v-for="item in readSnsData.tag" :key='item.tag_id'>{{item.name}}</el-tag>
						</el-form-item>
						
					</el-form>
				</el-col>
			</el-row>
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
import caseApi from '@/api/case.js'
	export default{
		data(){
			return{
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
				caseApi.getList(postData).then(res => {
					this.caseList = res.data.list
					this.pageData.count = res.data.count;
				})
			},
			editSns(data){
				if(data){
					this.$router.push({
						name:'caseAdd',
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
			},
			checkedSnsStatus(status){
				if(status){
					let postData = {id:this.readSnsData.inspiration_id,status};
					if(status == -1&&!this.nocheckedreason){this.$message.warning('请输入审核不通过原因');return}
					if(status == -1&&this.nocheckedreason){postData.reason = this.nocheckedreason}
					caseApi.checkTikTok(postData).then(res => {
						this.$message.success('审核完成');
						this.readSnsShow = false;
						this.getList();
					})
				}else{
					this.readSnsShow = false;
				}
			},
			deleteSns(inspirationId){
				this.$confirm('此操作将永久删除该案例, 是否继续?', '提示', {
				  confirmButtonText: '确认删除',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  caseApi.delTikTok({inspirationId}).then(res => {
				  	this.$message.success('删除成功');
				  	this.getList();
				  })
				}).catch(() => {
				           
				});
				
			},
			readSns(data){
				this.readSnsData = data;
				this.readSnsShow = true;
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
