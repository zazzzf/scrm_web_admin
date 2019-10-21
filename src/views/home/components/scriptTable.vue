<template>
	<div>
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
			<el-table-column :label="$t('home.creat_time')" prop="created" min-width="120"></el-table-column>
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
