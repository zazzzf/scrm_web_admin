<template>
	<el-card>
		<div slot="header">
			<span>社交报告管理</span>
			<el-button type="text" style="float: right;padding: 3px 0"><router-link to="/sns/sns-add">添加报告</router-link></el-button>
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
				<el-form-item prop="industry">
					<el-select clearable  v-model="searchData.industry" placeholder="类型筛选">
						<el-option v-for="item in categoryList" :label="item.name" :value="item.category_id" :key="item.category_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click='handleSearch'>{{$t('table.search')}}</el-button>
					<el-button type="text" @click='resetSearch'>{{$t('search.reset')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div style="min-height: 580px;">
			<el-table :data="snsList">
				<el-table-column label="报告标题" prop="title" min-width="400"></el-table-column>
				
				<el-table-column :label="$t('home.status')">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.status == 1">{{$t('home.is_pass')}}</el-tag>
						<el-tag type="danger" v-if="scope.row.status == -1">{{$t('home.not_pass')}}</el-tag>
						<el-tag type="default" v-if="scope.row.status == 0">{{$t('home.wait_pass')}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('home.creat_name')" prop="username"></el-table-column>
				<el-table-column :label="$t('checkname')" prop="check_manager"></el-table-column>
				<el-table-column :label="$t('home.creat_time')" prop="created" min-width="120"></el-table-column>
				<el-table-column :label="$t('operation')" min-width="300">
					<template slot-scope="scope">
						<el-button size="mini" type="info" @click="readSns(scope.row)" round>{{$t('search.read')}}</el-button>
						<el-button size="mini" type="warning" round @click="checkedSns(scope.row)">{{$t('search.checked')}}</el-button>
						<el-button size="mini" round type="primary" @click="editSns(scope.row)">{{$t('edit')}}</el-button>
						<el-button size="mini" type="danger" round @click="deleteSns(scope.row.knowledge_id)">{{$t('delete')}}</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination background v-if="pageData.count > 10" layout="prev, pager, next" :total="pageData.count" @current-change="pageChange"></el-pagination>
		<el-dialog :visible.sync="readSnsShow" top="2vh" min-width="375px">
			<el-form style="margin:20px 0" label-width="130px" label-position="left">
				<el-form-item label="社交报告标题">{{ readSnsData.title }}</el-form-item>
				<el-form-item :label="$t('casemanage.cover')">
					<img :src='readSnsData.cover' width="100px" />
				</el-form-item>
				<el-form-item label="社交报告类型">
					<el-tag v-if="readSnsShow">{{ categoryList.find(element => element.category_id == readSnsData.type).name}}</el-tag>
				</el-form-item>
				<el-form-item label="社交报告状态">
					<el-tag type="success" v-if="readSnsData.status == 1">{{$t('home.is_pass')}}</el-tag>
					<el-tag type="danger" v-if="readSnsData.status == -1">{{$t('home.not_pass')}}</el-tag>
					<el-tag type="default" v-if="readSnsData.status == 0">{{$t('home.wait_pass')}}</el-tag>
				</el-form-item>
				<el-form-item label="不通过原因" v-if="readSnsData.status == -1">{{ readSnsData.reason }}</el-form-item>
				<el-form-item label="社交报告创建人">{{ readSnsData.username }}</el-form-item>
				<el-form-item label="社交报告创建时间">{{ readSnsData.created }}</el-form-item>
				<el-form-item label="社交报告审核人">{{ readSnsData.check_manager }}</el-form-item>
				<el-form-item label="社交报告标签">
					<el-tag v-for="item in readSnsData.tag" :key='item.tag_id'>{{item.name}}</el-tag>
				</el-form-item>
				<el-form-item label="社交报告">
					<!-- <a :href="readSnsData.url" download="filename.zip">下载</a> -->
					<!-- <el-button @click="()=>{}}">下载</el-button> -->
				</el-form-item>
				<iframe :src="readSnsData.url"  width="100%" height="800px"></iframe>
				<!-- <pdf :src='readSnsData.url' v-if="readSnsShow"></pdf> -->
			</el-form>
			<div slot="footer" v-if="doWhat == 'checked'">
				<el-input type="textarea" :rows="2" placeholder="若不通过,请输入审核不通过原因" style="margin-bottom: 10px;" v-model="nocheckedreason"></el-input>
				<el-button type="primary" @click="checkedSnsStatus(1)">{{$t('search.pass')}}</el-button>
				<el-button type="danger" @click="checkedSnsStatus(-1)">{{$t('search.nopass')}}</el-button>
				<el-button type="default" @click="checkedSnsStatus()">{{$t('cancel_text')}}</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
import snsApi from '@/api/sns.js';
import tagsApi from '@/api/tags.js';
// import pdf from '@/components/pdf/index.vue';

export default {
	data() {
		return {
			snsList: [],
			readSnsShow: false,
			readSnsData: {},
			nocheckedreason: '',
			doWhat: '',
			pageData: {
				page: 1,
				count: null
			},
			searchData: {
				industry: '',
				title: '',
				status: '',
				tag:[],
			}
		};
	},
	computed:{
		tagsList(){
			return this.$store.getters.tagList
		},
		categoryList(){
			return this.$store.getters.categoryList
		}
	},
	methods: {
		pageChange(page) {
			this.pageData.page = page;
			this.getList();
		},
		getList() {
			let postData = {
				page: this.pageData.page,
				pageSize: 10,
				title: this.searchData.title,
				industry: this.searchData.industry,
			};
			if(this.searchData.status)postData.status = this.searchData.status
			if(this.searchData.tag.length>0){
				var tags = '';
				this.searchData.tag.forEach(item => {
					tags = tags.concat(`${item},`)
				})
				postData.tag = tags.substr(0,tags.length-1);
			}
			snsApi.getList(postData).then(res => {
				this.snsList = res.data.list;
				this.pageData.count = res.data.count;
			});
		},
		editSns(data) {
			if (data) {
				this.$router.push({
					name: 'snsAdd',
					params: {
						data
					}
				});
			}
		},
		checkedSns(data) {
			this.readSnsData = data;
			this.doWhat = 'checked';
			this.readSnsShow = true;
		},
		checkedSnsStatus(status) {
			if (status) {
				let postData = { id: this.readSnsData.knowledge_id, status };
				if (status == -1 && !this.nocheckedreason) {
					this.$message.warning('请输入审核不通过原因');
					return;
				}
				if (status == -1 && this.nocheckedreason) {
					postData.reason = this.nocheckedreason;
				}
				snsApi.checkKnowledge(postData).then(res => {
					this.$message.success('审核完成');
					this.readSnsShow = false;
					this.getList();
				});
			} else {
				this.readSnsShow = false;
			}
		},
		deleteSns(knowledgeId) {
			this.$confirm('此操作将永久删除该社交报告, 是否继续?', '提示', {
				confirmButtonText: '确认删除',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					snsApi.delKnowledge({ knowledgeId }).then(res => {
						this.$message.success('删除成功');
						this.getList();
					});
				})
				.catch(() => {});
		},
		readSns(data) {
			this.readSnsData = data;
			this.readSnsShow = true;
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
	created() {
		this.getList();
	},
};
</script>

<style lang="less" scoped>
video:focus {
	outline: none;
}
.video-number {
	margin-bottom: 20px;
	border-top: 1px solid #bfcbd9;
	border-bottom: 1px solid #bfcbd9;
	p {
		text-align: center;
	}
}
.search-box {
	margin-bottom: 10px;
}
</style>
