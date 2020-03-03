<template>
    <el-card shadow='never'>
		<div slot="header" >
			<span>报告集合管理</span>
		    <el-button type="text" style="float: right;padding: 3px 0" @click="add_sns_set" >添加报告</el-button>
		</div>
        <div>
            <el-select clearable  v-model="searchData.status" :placeholder="$t('search.check_status')" @change="getList">
                <el-option :label="$t('search.pass')" :value="2"></el-option>
                <el-option :label="$t('search.nopass')" :value="-1"></el-option>
                <el-option :label="$t('home.wait_pass')" :value="1"></el-option>
            </el-select>
            <el-table :data="tableList">
				<el-table-column :label="$t('home.status')">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.status == 2">{{$t('home.is_pass')}}</el-tag>
						<el-tag type="danger" v-if="scope.row.status == -1">{{$t('home.not_pass')}}</el-tag>
						<el-tag type="default" v-if="scope.row.status == 1">{{$t('home.wait_pass')}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="username" label="创建人" ></el-table-column>
				<el-table-column prop="created" label="创建时间" ></el-table-column>
				<el-table-column prop="check_username" label="审核人" ></el-table-column>
				<el-table-column prop="action" :label="$t('operation')" min-width="100" >
					<template slot-scope="scope"    >
						<el-button size="mini" type="info" round @click="readReport(scope.row)">{{$t('search.read')}}</el-button>
						<el-button size="mini" type="warning" round @click="checkReport(scope.row)">{{$t('search.checked')}}</el-button>
                        <el-button size="mini" type="primary" round @click="editReport(scope.row)">{{$t('edit')}}</el-button>
						<!-- <el-button size="mini" type="danger" round @click="delReport(scope.row)">{{$t('delete')}}</el-button> -->
					</template>
				</el-table-column>
			</el-table>
		<el-pagination background v-if="pageData.count > 10" layout="prev, pager, next" :total="pageData.count" @current-change="pageChange"></el-pagination>
        <el-dialog :visible.sync="showDetails" custom-class="no-padding-box" width="1000px" top="20px">
            <div slot="title">
                热门速报 <a @click="getPdf('#pdfDom')" href="javascript:void(0);">（点击下载）</a>
            </div>
            <Details v-if="showDetails" id="pdfDom" :detailsData="detailsData"></Details>
        </el-dialog>
        <el-dialog :visible.sync="checkBoxShow" top='2vh' min-width='375px' title="审核报告">
			<div slot='footer'>
				<el-input type="textarea" :rows="2" placeholder="若不通过,请输入审核不通过原因" style="margin-bottom: 10px;" v-model="nocheckedreason"></el-input>
				<el-button type="primary" @click='checkedStatus(2)'>{{$t('search.pass')}}</el-button>
				<el-button type="danger" @click='checkedStatus(-1)'>{{$t('search.nopass')}}</el-button>
				<el-button type="default" @click='checkedStatus()'>{{$t('cancel_text')}}</el-button>
			</div>
		</el-dialog>
        </div>
    </el-card>    
</template>
<script>
import { knowledgeDailyList,checkKnowledgeDailyStatus } from '@/api/sns'
import Details from './component/details'

export default {
    components:{Details},
    data() {
        return{
            tableList: [],
            pageData: {
				page: 1,
				count: null
            },
            nocheckedreason:"",
            htmlTitle:'热门速报',
            showDetails: false,
            checkBoxShow: false,
            detailsData: {},
            editData:{},
            searchData:{
					title:'',
					tag:[],
					status:'',
				}
        }
    },
    methods:{
        pageChange(page) {
			this.pageData.page = page;
			this.getList();
		},
        getList(){
            let postData = {
				page: this.pageData.page,
				pageSize: 10,
            };
            if(this.searchData.status)postData.status = this.searchData.status
            knowledgeDailyList(postData).then( res => {
                this.tableList = res.data.list;
				this.pageData.count = res.data.count;
            })
        },
        changeSetStatus(data,val){
            let postData = {
                id: data.id,
                status: val,
            };
            CHANGE_SET_STATUS(postData).then(res => {
                this.$message.success('修改成功')
                this.getList();
            }).catch(res => {
                data.status = (val == -1?1:-1)
            })
        },
        add_sns_set(){
            this.$router.push({
                name:'snsReportAdd'
            })
        },
        
        editReport(data){
            this.$router.push({
                name:'snsReportAdd',
                params: {data:data}
            })
        },
        checkReport(data){
            this.editData = data
            this.checkBoxShow = true;
        },
        checkedStatus(status){
            if(status){
                let postData = {
                    status: status,
                    id: this.editData.daily_main_id
                }
                if(status == -1&&!this.nocheckedreason){this.$message.warning('请输入审核不通过原因');return}
				if(status == -1&&this.nocheckedreason){postData.negative_reason = this.nocheckedreason}
                checkKnowledgeDailyStatus(postData).then(res => {
                    this.$message.success("审核完成")
                    this.checkBoxShow = false
                    this.getList()
                })
            }else{
                this.checkBoxShow = false
            }
        },
        readReport(data){
            this.detailsData = data
            this.showDetails = true
        },
        delReport(data){
            this.$message('暂不支持删除')
            console.log(data.id)
        }
    },
    created(){
        this.getList();
    }
}
</script>
<style>
.no-padding-box .el-dialog__body{
    padding: 0 !important;
}
</style>
