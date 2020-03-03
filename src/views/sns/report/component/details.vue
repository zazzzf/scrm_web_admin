<template>
    <div>
        
        <div id="pdfDom">
            <div class="details-title">
                <h1>短视频热点速报</h1>
                <h3>{{detailsData.created?detailsData.created.substring(0,10).replace(/-/g,"."):'预览时间'}}</h3>
            </div>
            <img src="@/assets/plate_images/remenzl.jpg" alt="" width="100%">
            <div class="details-chart">
                <div id="hotChart" v-if="detailsData.type_json" style="width:80%;height:400px"></div>
            </div>
            <div class="details-hotStar">
                <img src="../../../../assets/plate_images/douyin.png" alt="" class='title-image'>
                <div class="dy-star-box">
                    <el-row type="flex"   align="middle" style="height:100px;margin-top:50px" justify="center">
                        <el-col :span="8">
                            <el-row type="flex">
                                <el-col style="z-index:2">
                                    <el-avatar class="author-header" :size="100" :src="formData.dyLikeist[0].author_img"></el-avatar>
                                </el-col>
                                <el-col style="z-index:1">
                                    <div class="author-info">
                                        <div class="author-info-top">
                                            <p :title="formData.dyLikeist[0].author">{{formData.dyLikeist[0].author}}</p>
                                            <p>{{formData.dyLikeist[0].author_fans}}粉丝</p>
                                        </div>
                                        <div class="author-info-bottom">
                                            <p>{{formData.dyLikeist[0].like_num}}赞</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8">
                            <el-row type="flex">
                                <el-col style="z-index:2">
                                    <el-avatar class="author-header" :size="100" :src="formData.dyCommentList[0].author_img"></el-avatar>
                                </el-col>
                                <el-col style="z-index:1">
                                    <div class="author-info">
                                        <div class="author-info-top">
                                            <p :title="formData.dyCommentList[0].author">{{formData.dyCommentList[0].author}}</p>
                                            <p>{{formData.dyCommentList[0].author_fans}}粉丝</p>
                                        </div>
                                        <div class="author-info-bottom">
                                            <p>{{formData.dyCommentList[0].comment_num}}评论</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8">
                            <el-row type="flex">
                                <el-col style="z-index:2">
                                    <el-avatar class="author-header" :size="100" :src="formData.dyShareList[0].author_img"></el-avatar>
                                </el-col>
                                <el-col style="z-index:1">
                                    <div class="author-info">
                                        <div class="author-info-top">
                                            <p :title="formData.dyShareList[0].author">{{formData.dyShareList[0].author}}</p>
                                            <p>{{formData.dyShareList[0].author_fans}}粉丝</p>
                                        </div>
                                        <div class="author-info-bottom">
                                            <p>{{formData.dyShareList[0].share_num}}转发</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </div>
                <img src="../../../../assets/plate_images/kuaishou.png" alt="" class='title-image'>
                <div class="dy-star-box">
                    <el-row type="flex"   align="middle" style="height:100px;margin-top:50px" justify="center">
                        <el-col :span="8">
                            <el-row type="flex">
                                <el-col style="z-index:2">
                                    <el-avatar class="author-header" :size="100" :src="formData.ksLikeist[0].author_img"></el-avatar>
                                </el-col>
                                <el-col style="z-index:1">
                                    <div class="author-info">
                                        <div class="author-info-top">
                                            <p :title="formData.ksLikeist[0].author">{{formData.ksLikeist[0].author}}</p>
                                            <p>{{formData.ksLikeist[0].author_fans}}粉丝</p>
                                        </div>
                                        <div class="author-info-bottom">
                                            <p>{{formData.ksLikeist[0].like_num}}赞</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8">
                            <el-row type="flex">
                                <el-col style="z-index:2">
                                    <el-avatar class="author-header" :size="100" :src="formData.ksCommentList[0].author_img"></el-avatar>
                                </el-col>
                                <el-col style="z-index:1">
                                    <div class="author-info">
                                        <div class="author-info-top">
                                            <p :title="formData.ksCommentList[0].author">{{formData.ksCommentList[0].author}}</p>
                                            <p>{{formData.ksCommentList[0].author_fans}}粉丝</p>
                                        </div>
                                        <div class="author-info-bottom">
                                            <p>{{formData.ksCommentList[0].comment_num}}评论</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8">
                            <el-row type="flex">
                                <el-col style="z-index:2">
                                    <el-avatar class="author-header" :size="100" :src="formData.ksShareList[0].author_img"></el-avatar>
                                </el-col>
                                <el-col style="z-index:1">
                                    <div class="author-info">
                                        <div class="author-info-top">
                                            <p :title="formData.ksShareList[0].author">{{formData.ksShareList[0].author}}</p>
                                            <p>{{formData.ksShareList[0].author_fans}}粉丝</p>
                                        </div>
                                        <div class="author-info-bottom">
                                            <p>{{formData.ksShareList[0].share_num}}浏览</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div>
                <img src="@/assets/plate_images/dybaokuan.jpg" alt="" width="100%" style="margin:50px 0">
                <div class="dy-day dy-like">
                    <div class="dy-day-header-title">
                        <span>点赞</span><span>top3</span>
                    </div>
                    <div>
                        <el-row type="flex" align="middle"  class="dy-day-top-list" :key="item.daily_assistant_id" v-for="(item,index) in formData.dyLikeist" >
                            <el-col :span="6">
                                <el-image  shape="square" fit="cover" style="width: 150px; height: 150px; border-radius:10px;border:1px #ccc solid" :src="item.img">
                                    <div slot="error" class="image-slot" style="text-align:center">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                            </el-col>
                            <el-col :span="18" class="dy-day-top-list-col-two">
                                <div>
                                    <p>{{index + 1}}.{{item.title}}</p>
                                    <p>播主：{{item.author}}</p>
                                    <p>点赞数：{{item.like_num}}</p>
                                    <p>分析：{{item.analyze}}</p>
                                    <el-link :href="item.link" target="_blank">{{item.link}}</el-link>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="dy-day dy-pl">
                    <div class="dy-day-header-title">
                        <span>评论</span><span>top3</span>
                    </div>
                    <div>
                        <el-row type="flex" align="middle"  class="dy-day-top-list" :key="item.daily_assistant_id" v-for="(item,index) in formData.dyCommentList">
                            <el-col :span="6">
                                <el-image  shape="square" fit="cover" style="width: 150px; height: 150px; border-radius:10px;border:1px #ccc solid" :src="item.img">
                                    <div slot="error" class="image-slot" style="text-align:center">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                            </el-col>
                            <el-col :span="18" class="dy-day-top-list-col-two">
                                <div>
                                    <p>{{index + 1}}.{{item.title}}</p>
                                    <p>播主：{{item.author}}</p>
                                    <p>评论数：{{item.comment_num}}</p>
                                    <p>分析：{{item.analyze}}</p>
                                    <el-link :href="item.link" target="_blank">{{item.link}}</el-link>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="dy-day dy-fx">
                    <div class="dy-day-header-title">
                        <span>分享</span><span>top3</span>
                    </div>
                    <div>
                        <el-row type="flex" align="middle"  class="dy-day-top-list" :key="item.daily_assistant_id" v-for="(item,index) in formData.dyShareList">
                            <el-col :span="6">
                                <el-image  shape="square" fit="cover" style="width: 150px; height: 150px; border-radius:10px;border:1px #ccc solid" :src="item.img">
                                    <div slot="error" class="image-slot" style="text-align:center">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                            </el-col>
                            <el-col :span="18" class="dy-day-top-list-col-two">
                                <div>
                                    <p>{{index + 1}}.{{item.title}}</p>
                                    <p>播主：{{item.author}}</p>
                                    <p>分享数：{{item.share_num}}</p>
                                    <p>分析：{{item.analyze}}</p>
                                    <el-link :href="item.link" target="_blank">{{item.link}}</el-link>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div>
                <!-- 快手每日爆款视频 -->
                <img src="@/assets/plate_images/ksbaokuan.jpg" alt="" width="100%" style="margin:50px 0">
                <div class="ks-day-baokuan-video">
                    <div class="dy-day-header-title">
                        <span>点赞</span><span>top3</span>
                    </div>
                    <div style="margin:20px auto" :class="`ks-day-top-list-${index+1}`" :key="item.daily_assistant_id" v-for="(item,index) in formData.ksLikeist">
                        <div :class="`ks-day-top-list-${index+1}-phone`">
                            <el-image  shape="square" fit="cover" style="width: 220px; height: 460px; border-radius:20px;" :src="item.img">
                                <div slot="error" class="image-slot" style="text-align:center">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                        <el-row type="flex"  align="middle"  class="dy-day-top-list" >
                            <el-col>
                                <div>
                                    <p>{{index + 1}}.{{item.title}}</p>
                                    <p>播主：{{item.author}}</p>
                                    <p>点赞数：{{item.like_num}}</p>
                                    <p>分析：{{item.analyze}}</p>
                                    <el-link :href="item.link" target="_blank">{{item.link}}</el-link>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="dy-day-header-title">
                        <span>评论</span><span>top3</span>
                    </div>
                    <div style="margin:20px auto" :class="`ks-day-top-list-${index+1}`" :key="item.daily_assistant_id" v-for="(item,index) in formData.ksCommentList">
                        <div :class="`ks-day-top-list-${index+1}-phone`">
                            <el-image  shape="square" fit="cover" style="width: 220px; height: 460px; border-radius:20px;" :src="item.img">
                                <div slot="error" class="image-slot" style="text-align:center">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                        <el-row type="flex"  align="middle"  class="dy-day-top-list" >
                            <el-col>
                                <div>
                                    <p>{{index + 1}}.{{item.title}}</p>
                                    <p>播主：{{item.author}}</p>
                                    <p>评论数：{{item.comment_num}}</p>
                                    <p>分析：{{item.analyze}}</p>
                                    <el-link :href="item.link" target="_blank">{{item.link}}</el-link>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="dy-day-header-title">
                        <span>浏览</span><span>top3</span>
                    </div>
                    <div style="margin:20px auto" :class="`ks-day-top-list-${index+1}`" :key="item.daily_assistant_id" v-for="(item,index) in formData.ksShareList">
                        <div :class="`ks-day-top-list-${index+1}-phone`">
                            <el-image  shape="square" fit="cover" style="width: 220px; height: 460px; border-radius:20px;" :src="item.img">
                                <div slot="error" class="image-slot" style="text-align:center">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                        <el-row type="flex"  align="middle"  class="dy-day-top-list" >
                            <el-col>
                                <div>
                                    <p>{{index + 1}}.{{item.title}}</p>
                                    <p>播主：{{item.author}}</p>
                                    <p>浏览数：{{item.share_num}}</p>
                                    <p>分析：{{item.analyze}}</p>
                                    <el-link :href="item.link" target="_blank">{{item.link}}</el-link>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <!-- 热搜榜 -->
            <div>
                <img src="@/assets/plate_images/dyresou.jpg" alt="" width="100%">
                <div class="dy-hot-keywords">
                    <p  :key="item.daily_assistant_id" v-for="(item,index) in formData.hot_keywords" >
                        <span>{{index+1}}.{{item.val}}</span>
                    </p>
                </div>
            </div>
            <!-- 页脚 -->
            <div>
                <img src="@/assets/plate_images/footerlogo.jpg" alt="" width="100%">
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import {StringExchangeEmoji} from '@/utils/util'

export default {
    props:{
        detailsData:{}
    },
    data(){
        return{
            htmlTitle:'热门速报',
            chartData:[],
            formData:{
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
            chartData:[],
        }
    },
    methods:{
         currentData(){
            if(this.detailsData){
                var data = JSON.parse(StringExchangeEmoji(JSON.stringify(this.detailsData)))
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
                setTimeout(()=>{this.drawChart()},100)
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
            }
        },
        drawChart(){
            var xTitle = [];
            var yData = [];

            this.chartData.map(item => {
                xTitle.push(item.key)
                yData.push(item.val)
            })
            this.chart1 = echarts.init(document.getElementById('hotChart'))
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
                        show: true,
                        type : 'value',
                    }],
                series : [
                    {
                        name:'图表数据',
                        type:'bar',
                        barWidth: '60%',
                        data:yData,
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                    }
                ]
            };
            this.chart1.setOption(option)

        }
    },
    created(){
        this.currentData()
    }
}
</script>
<style lang="less" scoped>
 @import url('./style.less');
</style>