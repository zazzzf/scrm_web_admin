<template>
	<div>
		<el-table :data="caseList">
			<el-table-column label="案例标题" prop="tiktok_video_name" min-width="400"></el-table-column>
			<el-table-column label="状态">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.status == 1">已通过</el-tag>
					<el-tag type="danger" v-if="scope.row.status == -1">已拒绝</el-tag>
					<el-tag type="default" v-if="scope.row.status == 0">待审核</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="创建人" prop="username" ></el-table-column>
			<el-table-column label="创建时间" prop="created" min-width="120"></el-table-column>
		</el-table>
	</div>
</template>

<script>
	import {pendingChecKCase} from '@/api/home.js'
	export default {
		data(){
			return{
				caseList:[],
			}
		},
		methods:{
			getList(){
				pendingChecKCase().then(res => {
					this.caseList = res.data.list
				})
			}
		},
		created() {
			this.getList();
		}
	}
</script>

<style>
</style>
