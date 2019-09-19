<template>
	<el-card>
		<div slot="header">
			<span>社交报告管理</span>
			<el-button type="text" style="float: right;padding: 3px 0"><router-link to="/sns/sns-add">添加报告</router-link></el-button>
		</div>
		<div class="search-box">
			<el-form  ref="searchForm" :model="searchData" inline="">
				<el-form-item prop="title">
					<el-input v-model="searchData.title" style="width: 300px;" placeholder="标题搜索"></el-input>
				</el-form-item>
				<el-form-item prop="tag">
					<el-select clearable  v-model="searchData.tag" multiple collapse-tags  placeholder="标签筛选">
						<el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="status">
					<el-select clearable  v-model="searchData.status" placeholder="审核状态">
						<el-option label="通过" :value="1"></el-option>
						<el-option label="未通过" :value="-1"></el-option>
						<el-option label="待审核" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="industry">
					<el-select clearable  v-model="searchData.industry" placeholder="类型筛选">
						<el-option label="行业报告" :value="1"></el-option>
						<el-option label="专家访谈" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click='handleSearch'>搜索</el-button>
					<el-button type="text" @click='resetSearch'>重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div style="min-height: 700px;">
			<el-table :data="snsList">
				<el-table-column label="报告标题" prop="title" min-width="400"></el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.status == 1">已通过</el-tag>
						<el-tag type="danger" v-if="scope.row.status == -1">已拒绝</el-tag>
						<el-tag type="default" v-if="scope.row.status == 0">待审核</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建人" prop="username"></el-table-column>
				<el-table-column label="审核人" prop="check_manager"></el-table-column>
				<el-table-column label="创建时间" prop="created" min-width="120"></el-table-column>
				<el-table-column label="操作" min-width="300">
					<template slot-scope="scope">
						<el-button size="mini" type="info" @click="readSns(scope.row)" round>查看</el-button>
						<el-button size="mini" type="warning" round @click="checkedSns(scope.row)">审核</el-button>
						<el-button size="mini" round type="primary" @click="editSns(scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" round @click="deleteSns(scope.row.knowledge_id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination background v-if="snsList.length > 10" layout="prev, pager, next" :total="pageData.count" @current-change="pageChange"></el-pagination>
		<el-dialog :visible.sync="readSnsShow" top="2vh" min-width="375px">
			<el-form style="margin:20px 0" label-width="130px" label-position="top">
				<el-form-item label="社交报告标题">{{ readSnsData.title }}</el-form-item>
				<el-form-item label="社交报告类型">
					<el-tag type="success" v-if="readSnsData.type == 1">行业报告</el-tag>
					<el-tag type="warning" v-if="readSnsData.type == 2">专家访谈</el-tag>
				</el-form-item>
				<el-form-item label="社交报告状态">
					<el-tag type="success" v-if="readSnsData.status == 1">已通过</el-tag>
					<el-tag type="danger" v-if="readSnsData.status == -1">已拒绝</el-tag>
					<el-tag type="default" v-if="readSnsData.status == 0">待审核</el-tag>
				</el-form-item>
				<el-form-item label="不通过原因" v-if="readSnsData.status == -1">{{ readSnsData.reason }}</el-form-item>
				<el-form-item label="社交报告创建人">{{ readSnsData.username }}</el-form-item>
				<el-form-item label="社交报告创建时间">{{ readSnsData.created }}</el-form-item>
				<el-form-item label="社交报告审核人">{{ readSnsData.check_manager }}</el-form-item>
				<el-form-item label="社交报告">
					<pdf :src='readSnsData.url' v-if="readSnsShow"></pdf>
					<!-- <object :data="readSnsData.url" type="application/pdf" width="100%" height="800px">This browser does not support PDFs.</object> -->
				</el-form-item>
			</el-form>
			<div slot="footer" v-if="doWhat == 'checked'">
				<el-input type="textarea" :rows="2" placeholder="若不通过,请输入审核不通过原因" style="margin-bottom: 10px;" v-model="nocheckedreason"></el-input>
				<el-button type="primary" @click="checkedSnsStatus(1)">审核通过</el-button>
				<el-button type="danger" @click="checkedSnsStatus(-1)">审核不通过</el-button>
				<el-button type="default" @click="checkedSnsStatus()">取消审核</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
import snsApi from '@/api/sns.js';
import tagsApi from '@/api/tags.js';
import pdf from '@/components/pdf/index.vue';
export default {
	components: {
		pdf
	},
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
				status:this.searchData.status,
			};
			if(this.searchData.tag.length>0){
				var tags = '';
				this.searchData.tag.forEach(item => {
					tags = tags.concat(`${item},`)
				})
				postData.tag = tags.substr(0,tags.length-1);
			}
			snsApi.getList(postData).then(res => {
				this.snsList = res.data.list;
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
