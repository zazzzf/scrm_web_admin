<template>
	<div>
		<el-table :data="scriptList">
			<el-table-column label="标题" prop="title" min-width="200"></el-table-column>
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
	import {pendingCheckScript} from '@/api/home.js'
	export default {
		data(){
			return{
				scriptList:[],
			}
		},
		methods:{
			getList(){
				pendingCheckScript().then(res => {
					this.scriptList = res.data.list
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
