<template>
    <el-card class="form-box">
        <div>
            <el-form :model="formData">
                <el-form-item label="报告标题">
                    <el-input v-model="formData.title" style="width:500px"></el-input>
                </el-form-item>
                <el-form-item label="报告封面">
                    <image-upload :limit='1' 
                        ref="imgUpload"
						:accept="'image/*'" 
						:uploadType="1" 
						:qiniuBaseUrl="$config.QINIU_URL_TYPE_IMG" 
						:qiniuNamePrefix="'ZK_BG_'" 
						:isAppendDialog="true" 
						:propFileList="formData.img?[{url:formData.img +'?imageMogr2/auto-orient'}]:[]" 
						@on-upSuccess="(val)=>{formData.img = val}"></image-upload>
                </el-form-item>

                <el-form-item label="报告分类">
                    <el-select v-model="formData.category_id">
                        <el-option v-for="item in categoryList" :label="item.name" :value="item.category_id" :key="item.category_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报告集合">
                    <el-select v-model="formData.knowledge_set_id">
                        <el-option v-for="item in set_list" :label="item.title" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图表数据">
                    <el-button @click="addOneChartData">添加</el-button>
                    <el-button @click="readCharts">预览</el-button>
                    <div v-for="(item,index) in chartData" :key="index" style="margin:10px 0">
                        标签名：<el-input style="width:300px" v-model="item.key"></el-input>
                        数值：<el-input-number  v-model="item.val"></el-input-number>
                        <el-button type="danger" @click="delOneChartData(index)">删除</el-button>
                    </div>
                    <div id="formHotChart" style="height:400px; width:640px" v-show="showChart"></div>
                </el-form-item>
            </el-form>
            <el-row :gutter="20" v-if="formData.dyLikeist.length>0">
                <el-col :span="12">
                    <el-alert title="抖音红人榜" type="success" :closable="false" description="此处取自下方各榜单第一，若需修改请直接修改TOP榜第一" effect="dark"></el-alert>
                    <Author :authorData="formData.dyLikeist" ></Author>
                    <Author :authorData="formData.dyCommentList" :type='1'></Author>
                    <Author :authorData="formData.dyShareList" :type='2'></Author>
                </el-col>
                <el-col :span="12">
                    <el-alert title="快手红人榜" type="error" :closable="false" description="此处取自下方各榜单第一，若需修改请直接修改TOP榜第一" effect="dark"></el-alert>
                    <Author :authorData="formData.ksLikeist" ></Author>
                    <Author :authorData="formData.ksCommentList" :type='1' ></Author>
                    <Author :authorData="formData.ksShareList" :type='2' :plateType="2"></Author>
                </el-col>
            </el-row>
             
            <!-- 抖音 -->
            <setTable ref="dylike" :tableFormRef="'dy_like'" :titleType="'success'" :tableTitle="'抖音点赞Top3'" :tableData="formData.dyLikeist"></setTable>
            <setTable ref="dycomment"  :titleType="'warning'" :tableTitle="'抖音评论Top3'" :tableData="formData.dyCommentList"></setTable>
            <setTable ref="dyshare"  :titleType="'error'" :tableTitle="'抖音分享Top3'" :tableData="formData.dyShareList"></setTable>
            <!-- 快手 -->
            <setTable ref="kslike"  :type="2" :titleType="'success'" :tableTitle="'快手点赞Top3'" :tableData="formData.ksLikeist"></setTable>
            <setTable ref="kscomment" :type="2" :titleType="'warning'" :tableTitle="'快手评论Top3'" :tableData="formData.ksCommentList"></setTable>
            <setTable ref="ksshare" :type="2" :titleType="'error'" :tableTitle="'快手分享Top3'" :tableData="formData.ksShareList"></setTable>

            <!-- 话题排行 -->
            <el-alert title="抖音话题排行" type="error" description="输入框顺序即为话题排行顺序" :closable="false"  effect="dark"></el-alert>
            <el-input aria-required style="margin:10px 10px 10px 0; width:300px" :placeholder="`请填入排行第${index+1}话题`" v-for="(item,index) in formData.hot_keywords" v-model="item.val" :key="index"></el-input>
        </div>
        <el-card class="footer-submit">
            <el-tooltip class="item" effect="dark" content="注：保存草稿功能仅保存一条当前编辑中草稿，提交后自动删除" placement="left">
            <el-button @click="saveMyFormData" type="success">保存草稿</el-button>
            </el-tooltip>
            <el-button @click="submitForm('readonly')" type="warning">预览</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="cancelSubimt">取消</el-button>
        </el-card>
        <el-dialog :visible.sync="show" custom-class="no-padding-box" width="1000px" top="20px">
            <div slot="title">
                热门速报 <a @click="getPdf('#pdfDom')" href="javascript:void(0);">（点击下载）</a>
            </div>
            <Details v-if="show" id="pdfDom" :detailsData="readData"></Details>
        </el-dialog>
    </el-card>
</template>
<script>
import Cookies from 'js-cookie'
import echarts from 'echarts';
import imageUpload from '@/components/image-upload'
import {getTodayTop, addknowledgedaily, editknowledgedaily } from '@/api/sns'
import Details from './component/details'
import setTable from './component/settable'
import Author from './component/author'
import {initData} from './initData'
import { GET_SETLIST } from '@/api/sns'
import { resolve } from 'url';

import {StringExchangeEmoji} from '@/utils/util'


export default {
    components:{Details,imageUpload,setTable ,Author},
    data(){
        return{
            imgUrl:"https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar",
            chartData:[],
            htmlTitle:'哈吉斯侃大山',
            formData:{
                title:'',
                img:'',
                category_id:null,
                knowledge_set_id:'',
                type_json: [],
                hot_keywords: [{val:''},{val:''},{val:''},{val:''},{val:''}, {val:''},{val:''},{val:''},{val:''},{val:''}],
                dyLikeist: [],
                dyCommentList:[],
                dyShareList:[],
                ksLikeList:[],
                ksCommentList:[],
                ksShareList:[],
            },
            set_list:[],
            showChart: false,
            show:false,
            readData:{}
        }
    },
    computed:{
        categoryList(){
			return this.$store.getters.categoryList
        },
    },
    methods:{
        cancelSubimt(){
            this.removeMySaveData();
            this.$router.push('/sns/sns-report');
        },
        getTopData(){
           getTodayTop().then(res => {
               res.data = JSON.parse(StringExchangeEmoji(JSON.stringify(res.data)))
               var data = initData(res.data)
               this.formData.dyLikeist = data.dy.like;
               this.formData.dyCommentList = data.dy.comment;
               this.formData.dyShareList = data.dy.share;
               this.formData.ksLikeist = data.ks.like;
               this.formData.ksCommentList = data.ks.comment;
               this.formData.ksShareList = data.ks.share;
           }) 
        },
        get_SetList(){
            GET_SETLIST().then(res => {
                this.set_list = res.data
            })
        },
        currentData(){
            if(this.$route.params.data){
                var data = JSON.parse(StringExchangeEmoji(JSON.stringify(this.$route.params.data)))
                var keywordList = data.hot_keywords.split(',');
                this.formData.hot_keywords.map((item,index) => {
                    item.val = keywordList[index]
                })
                var chartJson = JSON.parse(data.type_json)
                for (let [key, value] of Object.entries(chartJson)) {
                    this.chartData.push({
                        key: key,
                        val: value
                    })
                }
                setTimeout(()=>{this.readCharts()},100)
               this.formData.img = data.main_img;
               this.formData.title = data.main_title;
               this.formData.category_id = data.category_id;
               this.formData.daily_main_id = data.daily_main_id;
               this.formData.knowledge_set_id = data.knowledge_set_id;
               this.formData.type_json = data.type_json;
               this.formData.dyLikeist = data.dy_like;
               this.formData.dyCommentList = data.dy_comment;
               this.formData.dyShareList = data.dy_share;
               this.formData.ksLikeist = data.ks_like;
               this.formData.ksCommentList = data.ks_comment;
               this.formData.ksShareList = data.ks_share;
            }else{
                this.getTopData()
            }
        },
        addOneChartData(){
            if(this.chartData.length>0&&this.chartData[this.chartData.length-1].key == ""){
                this.$notify({
                    title: '警告',
                    message: '请填写完整上一条信息后再添加',
                    type: 'warning'
                });
                return
            }
            this.chartData.push({
                key: '', val: 0
            })
        },
        readCharts(){
            if(this.chartData.length == 0){
                this.$notify({
                    title: '错误',
                    message: '请填入至少一条数据',
                    type: 'error'
                });
            }else if(this.chartData.length>0&&this.chartData[this.chartData.length-1].key == ""){
                this.$notify({
                    title: '警告',
                    message: '请填写完整上一条信息后再添加',
                    type: 'warning'
                });
                return
            }else{
                this.showChart = true;
                this.drawChart()
            }
        },
        delOneChartData(index){
            this.chartData.splice(index,1)
            if(this.chartData.length == 0)this.showChart = false;
        },
        drawChart(){
            var xTitle = [];
            var yData = [];
            this.chartData.map(item => {
                xTitle.push(item.key)
                yData.push(item.val)
            })
            this.tableChart = echarts.init(document.getElementById('formHotChart'))
            var option = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '0%',
                    right: '8%',
                    containLabel: true
                },
                xAxis : [{
                        type : 'category',
                        data : xTitle,
                        axisTick: {
                            alignWithLabel: true
                        }}],
                yAxis : [{
                        show: false,
                        type : 'value',
                        axisTick: {show: false},
                    }],
                series : [
                    {
                        name:'值',
                        type:'bar',
                        barWidth: '60%',
                        data: yData,
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                    }
                ]
            };
            this.tableChart.setOption(option)
        },
        submitForm(btnType){
            if(!this.formData.category_id){this.$message.error(`请选择分类`) ; return}
            if(!this.formData.knowledge_set_id){this.$message.error(`请选择集合`); return}
            if(!this.formData.img){this.$message.error(`请上传封面`); return}
            if(!this.formData.title){this.$message.error(`请输入标题`); return}
            if(this.chartData.length == 0){this.$message.error(`请填入至少一条图表数据`); return}
            new Promise(resolve => {
                var validNumber = 0;
                this.$refs['dylike'].validForm().then(res => {
                    if(res)if(res)validNumber++
                    this.$refs['dycomment'].validForm().then(res => {
                        if(res)validNumber++
                        this.$refs['dyshare'].validForm().then(res => {
                            if(res)validNumber++
                            this.$refs['kslike'].validForm().then(res => {
                                if(res)validNumber++
                                this.$refs['kscomment'].validForm().then(res => {
                                    if(res)validNumber++
                                    this.$refs['ksshare'].validForm().then(res => {
                                        if(res)validNumber++
                                        resolve(validNumber)
                                    })
                                })
                            })
                        })
                    })
                })
            }).then(res => {
                if(res>=6){
                    let type_json = new Object();
                    let hot_keywords = new Array();
                    this.chartData.map(item => {
                        type_json[item.key] = item.val
                    })
                    for(var i = 0; i< this.formData.hot_keywords.length; i++){
                        if(this.formData.hot_keywords[i].val == ""){
                            this.$message.error(`第${i+1 }条抖音热门话题未填入`)
                            return false
                            break
                        }
                        hot_keywords.push(this.formData.hot_keywords[i].val)
                    }
                    var str_hot_keywords='';
					if(this.formData.hot_keywords.length>0){
						for(var i = 0; i< this.formData.hot_keywords.length; i++){
                            if(this.formData.hot_keywords[i].val == ""){
                                this.$message.error(`第${i+1 }条抖音热门话题未填入`)
                                return false
                                break
                            }
                            str_hot_keywords = str_hot_keywords.concat(`${this.formData.hot_keywords[i].val},`)
                        }
                    };
                    str_hot_keywords = str_hot_keywords.substr(0,str_hot_keywords.length-1);
                    let postData = {
                        title: this.formData.title,
                        img: this.formData.img,
                        category_id: this.formData.category_id,
                        knowledge_set_id: this.formData.knowledge_set_id,
                        type_json: JSON.stringify(type_json),
                        hot_keywords: str_hot_keywords,
                        dyLikeist: JSON.stringify(this.formData.dyLikeist),
                        dyCommentList: JSON.stringify(this.formData.dyCommentList),
                        dyShareList: JSON.stringify(this.formData.dyShareList),
                        ksLikeList: JSON.stringify(this.formData.ksLikeist),
                        ksCommentList: JSON.stringify(this.formData.ksCommentList),
                        ksShareList: JSON.stringify(this.formData.ksShareList),
                    }
                    if(btnType == "readonly"){
                        this.readData = {
                            category_id: this.formData.category_id,
                            knowledge_set_id: this.formData.knowledge_set_id,
                            type_json: JSON.stringify(type_json),
                            hot_keywords: str_hot_keywords,
                            dy_like: (this.formData.dyLikeist),
                            dy_comment: (this.formData.dyCommentList),
                            dy_share: (this.formData.dyShareList),
                            ks_like: (this.formData.ksLikeist),
                            ks_comment: (this.formData.ksCommentList),
                            ks_share: (this.formData.ksShareList),
                        }
                        this.show = true
                        return
                    }
                    if(this.formData.daily_main_id){
                        postData.daily_main_id = this.formData.daily_main_id
                        editknowledgedaily(postData).then(res => {
                            this.$message.success('提交完成');
                            this.cancelSubimt();
                        })
                    }else{
                        addknowledgedaily(postData).then(res => {
                            this.$message.success('提交完成');
                            this.cancelSubimt();
                        })
                    }
                }
            })
        },

        findMySaveData(){
            var formData = localStorage["THE_REPORT_FROM"]
            console.log(formData)
            if(formData){
                this.$confirm('检测到您有未提交的草稿，是否恢复？', '提示', {
                    confirmButtonText: '恢复草稿',
                    cancelButtonText: '删除草稿',
                    type: 'warning'
                    }).then(() => {
                        this.formData = JSON.parse(formData)
                        this.$refs['imgUpload'].setFileList([{url:this.formData.img}])
                    }).catch(() => {
                        this.removeMySaveData()         
                    });
            }
        },
        
        removeMySaveData(){
            localStorage.removeItem('THE_REPORT_FROM')
            this.$message({
                type: 'info',
                message: '已删除草稿'
            });   
        },
        /**保存草稿 */
        saveMyFormData(){
            var formData = JSON.stringify(this.formData)
            localStorage["THE_REPORT_FROM"] = formData
            this.$message.success("保存草稿成功")
        },
        
        /**回填触发更新组件视图 */
        
    },
    created(){
        this.currentData()
        this.get_SetList()
        this.findMySaveData()
    }
}
</script>
<style>
.footer-submit{
    position: fixed;bottom:0;
    left: 0;
    text-align: right;
    width: 100vw;
}
.form-box{
    padding-bottom: 100px
}
</style>