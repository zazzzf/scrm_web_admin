<template>
	<div>
		<el-table :data="caseList">
				<el-table-column :label="$t('title')" prop="title" min-width="400"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-tag type="default" v-if="scope.row.status == 1">
							<el-link type="primary" href="">
								<router-link to="/hotTrack/hot-Video">
									去审核<i class="el-icon-right"></i>
								</router-link>
							</el-link>
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('home.creat_name')" prop="username" ></el-table-column>
				<el-table-column :label="$t('home.creat_time')" prop="created" min-width="120"></el-table-column>
		</el-table>
	</div>
</template>

<script>
	import {pendinghotvideo} from '@/api/home.js'
	export default {
		data(){
			return{
				caseList:[],
			}
		},
		methods:{
			getList(){
				pendinghotvideo().then(res => {
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
