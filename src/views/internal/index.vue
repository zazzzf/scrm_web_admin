<template>
    <el-card shadow='never'>
		<div slot="header" >
			<span>内部报告</span>
		    <el-button type="text" style="float: right;padding: 3px 0" @click="showDelog()" >添加报告</el-button>
		</div>
		<div class="search-box">
			<el-form  ref="searchForm" :model="searchData" inline="">
				<el-form-item prop="title">
					<el-input v-model="searchData.title" style="width: 300px;" placeholder="报告名搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click='handleSearch'>{{$t('table.search')}}</el-button>
					<el-button type="text" @click='resetSearch'>{{$t('search.reset')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
        <div style="min-height:544px">
            <el-table :data="internal_list">
				<!-- <el-table-column prop="internal_report_id" label="ID" ></el-table-column> -->
				<el-table-column prop="report_name" label="报告名" min-width="200"></el-table-column>
				<el-table-column prop="date_added" label="创建时间"></el-table-column>
				<el-table-column prop="action" :label="$t('operation')" min-width="200" >
					<template slot-scope="scope"    >
                        <el-link type="primary" target="_blank" :href="scope.row.report_file_name">查看</el-link>
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
    </el-card>    
</template>
<script>
import {internalList, addInternal} from '@/api/internal'
export default {
    data() {
        return{
            internal_list: [],
            showAdd: false,
            pageData:{
				page:1,
				count:null,
			},
			searchData:{
				title:""
			}
        }
    },
    methods:{
		pageChange(page){
			this.pageData.page = page;
			this.getList();
		},
        getList(){
			let postData = {
				page: this.pageData.page,
				pageSize:10,
				keywords: this.searchData.title
			};
            internalList(postData).then( res => {
                this.internal_list = res.data.list;
				this.pageData.count = res.data.count;
            })
        },
        showDelog(){
            this.$router.push({
                name:'internalAdd',
            })
		},
		handleSearch(){
			this.internal_list = []
			this.pageData.page = 1
			this.getList()
		},
		resetSearch(){
			this.searchData.title= ""
			this.pageData.page = 1
			this.internal_list = []
			this.getList()
		}
    },
    created(){
        this.getList();
    }
}
</script>
