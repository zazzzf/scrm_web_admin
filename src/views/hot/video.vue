<template>
	<el-card>
		
		<div slot="header" >
			<span>热点视频</span>
		    <el-button type="text" style="float: right;padding: 3px 0">
				<router-link to="/hot/video-add">
				    添加视频
				</router-link>
			</el-button>
		</div>
		<div class="search-box">
			<el-form  ref="searchForm" :model="searchData" inline="">
				<el-form-item prop="title">
					<el-input v-model="searchData.title" style="width: 300px;" :placeholder="$t('search.title')"></el-input>
				</el-form-item>
				<!-- <el-form-item prop="tag">
					<el-select clearable  v-model="searchData.tag" multiple collapse-tags  :placeholder="$t('search.tag')">
						<el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item prop="status">
					<el-select clearable  v-model="searchData.status" :placeholder="$t('search.check_status')">
						<el-option :label="$t('search.pass')" :value="2"></el-option>
						<el-option :label="$t('search.nopass')" :value="-1"></el-option>
						<el-option :label="$t('home.wait_pass')" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click='handleSearch'>{{$t('table.search')}}</el-button>
					<el-button type="text" @click='resetSearch'>{{$t('search.reset')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div style="min-height: 700px;">
			<el-table :data="list">
				<el-table-column label="推荐理由" prop="title" min-width="200"></el-table-column>
				<el-table-column :label="$t('home.status')">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.status == 2">{{$t('home.is_pass')}}</el-tag>
						<el-tag type="danger" v-if="scope.row.status == -1">{{$t('home.not_pass')}}</el-tag>
						<el-tag type="default" v-if="scope.row.status == 1">{{$t('home.wait_pass')}}</el-tag>
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
						<el-button size="mini" type="danger" round @click='deleteSns(scope.row.data_id)'>{{$t('delete')}}</el-button>
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
				<video :src="readSnsData.video_url" style="width:100%;height:400px" controls></video>
				<el-form-item label="推荐理由">{{ readSnsData.title }}</el-form-item>
				<el-form-item label="审核状态">
					<el-tag type="success" v-if="readSnsData.status == 2">{{$t('home.is_pass')}}</el-tag>
					<el-tag type="danger" v-if="readSnsData.status == -1">{{$t('home.not_pass')}}</el-tag>
					<el-tag type="default" v-if="readSnsData.status == 1">{{$t('home.wait_pass')}}</el-tag>
				</el-form-item>
				<el-form-item label="不通过原因" v-if="readSnsData.status == -1">{{ readSnsData.negative_reason }}</el-form-item>
				<el-form-item :label="$t('home.creat_name')">{{ readSnsData.username }}</el-form-item>
				<el-form-item :label="$t('home.creat_time')">{{ readSnsData.created }}</el-form-item>
				<el-form-item :label="$t('checkname')">{{ readSnsData.check_manager }}</el-form-item>
				<el-form-item :label="$t('casemanage.tag')">
					<el-tag v-for="item in readSnsData.tag" style="margin:10px" :key='item.tag_id'>{{item.name}}</el-tag>
				</el-form-item>
				<el-form-item label="脚本">{{ readSnsData.script }}</el-form-item>
				<el-form-item label="铺垫">{{ readSnsData.bedding }}</el-form-item>
				<el-form-item label="正常故事">{{ readSnsData.normal_story }}</el-form-item>
				<el-form-item label="意外故事">{{ readSnsData.unexpected_story }}</el-form-item>
				<el-form-item label="可扩展场景">{{ readSnsData.scalable_scene }}</el-form-item>
				<el-form-item label="备注">{{ readSnsData.remarks }}</el-form-item>
				<el-form-item label="热评">{{ readSnsData.hot_review }}</el-form-item>
				<el-form-item label="视频链接">{{ readSnsData.video_link }}</el-form-item>
			</el-form>
			<div slot='footer' v-if="doWhat=='checked'">
				<el-input type="textarea" :rows="2" placeholder="若不通过,请输入审核不通过原因" style="margin-bottom: 10px;" v-model="nocheckedreason"></el-input>
				<el-button type="primary" @click='checkedSnsStatus(2)'>{{$t('search.pass')}}</el-button>
				<el-button type="danger" @click='checkedSnsStatus(-1)'>{{$t('search.nopass')}}</el-button>
				<el-button type="default" @click='checkedSnsStatus()'>{{$t('cancel_text')}}</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
import hotApi from '@/api/hot.js'
	export default{
		data(){
			return{
				list:[],
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
				};
				if(this.searchData.title)postData.title = this.searchData.title
				if(this.searchData.tag.length>0){
					var tags = '';
					this.searchData.tag.forEach(item => {
						tags = tags.concat(`${item},`)
					})
					postData.tag = tags.substr(0,tags.length-1);
				}
				if(this.searchData.status)postData.status = this.searchData.status
				hotApi.videoList(postData).then(res => {
					this.list = res.data.list
					this.pageData.count = res.data.count;
				})
			},
			editSns(data){
				if(data){
					this.$router.push({
						name:'videoAdd',
						params: {
							data,
						}
					})
				}
			},
			checkedSns(data){
				this.readSnsData = data;
                this.readSnsData.video_url = data.video_url.indexOf('http://')==-1?"http://"+data.video_url:data.video_url
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
					let postData = {id :this.readSnsData.data_id,status};
					if(status == -1&&!this.nocheckedreason){this.$message.warning('请输入审核不通过原因');return}
					if(status == -1&&this.nocheckedreason){postData.negative_reason = this.nocheckedreason}
					hotApi.checkHotVideo(postData).then(res => {
						this.$message.success('审核完成');
						this.readSnsShow = false;
						this.getList();
					})
				}else{
					this.readSnsShow = false;
				}
			},
			deleteSns(data_id){
				this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
				  confirmButtonText: '确认删除',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  hotApi.delHotVideo({id: data_id}).then(res => {
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
