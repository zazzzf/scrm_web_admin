<template>
    <div  style="min-width:864px">
        <el-card >
            <Tag class="checked-tag" v-for="item in plateList" size="large" :key="item.id" :checked='item.id==checkPlate_id?true:false' checkable color="primary"  @on-change="changePlate(item.id,$event)">
                <el-row type="flex" align='middle'>
                    <img :src="imgBaseUrl+item.icon_square" alt="" style="width:20px;">
                    <span style="margin-left:10px">{{item.title}}</span>
                </el-row>
            </Tag>          
            <el-divider />
            <el-row style="min-width:864px">
                <el-col :span="2">
                    <Tag class="checked-tag" checkable color="primary" size="large" :checked='checkTag==0?true:false' @on-change="changeTag(0,$event)">
                        <div style="width:50px">全部</div>
                    </Tag>
                </el-col>
                <el-col :span="15">
                    <Tag class="checked-tag" v-for="item in tagList" size="large" :key="item.id" :checked='item.id==checkTag?true:false' checkable color="primary"  @on-change="changeTag(item.id,$event)">
                        <div style="width:100px">
                            <img :src="imgBaseUrl+(item.id==checkTag?item.icon_url_white:item.icon_url_gray)" alt="" style="width:16px; padding:7px 0; float:left;margin:0 5px">
                            {{item.title}}
                        </div>
                    </Tag>
                </el-col>
            </el-row>
            <el-divider />
            <div>
                <span>周榜：</span>
                <el-select v-model="checkDate" @change="getData">
                    <el-option v-for="(item,index) in dateList" :label="item.period" :value="index" :key="index"></el-option>
                </el-select>
                <span style="margin-left:10px;color:#c2c2c2">用户样本数：{{sampleCount|formatNumberRgx}}</span>
                <p style="float:right;line-height:36px">更新日期：{{updated_at}}</p>
            </div>
        </el-card>
        <el-card style="margin-top:20px" shadow="never">
            <el-button @click="backtoTop" 
            icon="el-icon-caret-top"
            type='primary'
            size='large'
            circle
            title="返回顶部"
            style="position: fixed; right: 30px;bottom: 50px; z-index: 999; width: 50px; height: 50px;"></el-button>
            <el-table :data="tableList"  size='medium' stripe  v-loading='loading'>
                <el-table-column label="排名"  header-row-class-name="header-class-name">
                    <template slot-scope="scope">
                        <!-- prop="category_ranking" -->
                        <img :src="topImgList[(checkTag>0?scope.row.category_ranking:scope.row.new_ranking)-1]" alt="" width="32" v-if="(checkTag>0?scope.row.category_ranking:scope.row.new_ranking)<4">
                        <span style="padding-left:10px" v-else>{{checkTag>0?scope.row.category_ranking:scope.row.new_ranking}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="title" min-width="200px">
                    <template slot-scope="scope">
                        <el-row type="flex" align='middle'>
                            <el-avatar :size='60' :src="scope.row.pic_url"></el-avatar>
                            <span style="margin-left:50px">{{scope.row.title}}</span>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column  prop="fan_count">
                    <template slot="header" slot-scope="scope">
                        粉丝总数
                        <el-tooltip :content="tipText" placement="top" >
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column  prop="video_average" v-if="video_average">
                    <template slot="header" slot-scope="scope">
                        集均播放量<el-tooltip content="近90天新增的播放总量/新增视频数量" placement="top" >
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column  prop="comment_average">
                    <template slot="header" slot-scope="scope">
                        集均评论<el-tooltip content="近90天新增的评论总数/新增视频数" placement="top" >
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                    </template>
                </el-table-column>
                <!-- bili 特有表格 -->
                <el-table-column prop="ad_coin" v-if="checkPlate_id == 58">
                    <template slot="header" slot-scope="scope">
                        集均硬币<el-tooltip content="近90天新增的硬币总数/新增视频数" placement="top" >
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column  prop="ad_fav" v-if="checkPlate_id == 58">
                    <template slot="header" slot-scope="scope">
                        集均收藏<el-tooltip content="近90天新增的收藏总数/新增视频数" placement="top" >
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column  prop="up_average">
                    <template slot="header" slot-scope="scope">
                        集均赞<el-tooltip content="近90天新增的点赞总数/新增视频数" placement="top" >
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column :label="checkPlate_id == 184?'集均转发':'集均分享'" prop="ad_share" v-if="ad_share">
                    <template slot="header" slot-scope="scope">
                        {{checkPlate_id == 184?'集均转发':'集均分享'}}
                        <el-tooltip :content="`近90天新增的${checkPlate_id == 184?'转发':'分享'}总数/新增视频数`" placement="top" >
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="集均转发" prop="ad_share" v-if=""></el-table-column> -->
            </el-table>
            <div style="text-align:center;padding:20px 0">
                <el-pagination
                background
                :page-size='50'
                v-if="pageData.count>10"
                layout="prev, pager, next"
                :total="pageData.count"
                @current-change='pageChange'>
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
import KASI from '@/api/kasiData'
import { Tag } from 'view-design';
export default {
    components:{Tag},
    data(){
        return{
            imgBaseUrl:'https://pic.caasdata.com/',
            tagList:[],
            checkTag: 0,
            checkPlate_id: 998,
            plateList:[],
            loading:false,

            // 时间筛选
            checkDate:0,
            dateList:[],
            updated_at: "",
            sampleCount:0,
            //表单数据
            tableList:[],
            topImgList:["https://www.caasdata.com/static/index/layouts/img/top_new1.png",
                        "https://www.caasdata.com/static/index/layouts/img/top_new2.png",
                        "https://www.caasdata.com/static/index/layouts/img/top_new3.png"],

            //分页数据
            pageData:{
				page:1,
				count:null,
			}
        }
    },
    filters:{
        //超过一千用逗号隔开
        formatNumberRgx: function(num) {
            console.log(num)
            var parts = num.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        },
    },
    computed:{
        // 计算是否显示视频播放量
        video_average(){
            var list = [998,184];
            if(list.indexOf(Number(this.checkPlate_id))>=0){
                return false;
            }else{
                return true;
            }
        },
        // 计算是否显示分享栏
        ad_share(){
            var list = [993,58,95,997];
            if(list.indexOf(Number(this.checkPlate_id))>=0){
                return false;
            }else{
                return true;
            }
        },
        tipText(){
            var id_list = [998,997,996];
            var list = {
                '998':"统计截止日期累积的抖音粉丝量（不包含西瓜视频、火山小视频粉丝量）",
                '997':'统计截止日期累积的西瓜视频粉丝量（不包含抖音、火山小视频粉丝量）',
                '996':'统计截止日期累积的火山小视频粉丝量（不包含抖音、西瓜视频粉丝量）',
            };
            if(id_list.indexOf(Number(this.checkPlate_id))>=0){
                return list[String(this.checkPlate_id)];
            }else{
                return "统计截止日期累积的粉丝总数";
            }
        }
    },
    methods:{
        getTags(){
            let postData = {
                config_type_id:1,
                status:1,
                platform_id: this.checkPlate_id,
            };
            KASI.getTags(postData).then(res => {
                var data = JSON.parse(res.data)
                this.tagList = data.data;
            })
        },
        getDates(){
            KASI.getDates().then(data => {
                 var res = JSON.parse(data.data)
                this.plateList = res.data.date.kolPlatformList;

                this.dateList = res.data.date.times.kolWeeks;

                this.updated_at = this.dateList[0].updated_at;
                this.getData();
            })
        },
        changeTag(id,status){
            if(status){this.checkTag = id}else{this.checkTag = 0};
            this.pageData.page = 1;
            this.getData();
        },

        changePlate(id,status){
            if(status){this.checkPlate_id = id}else{this.checkPlate_id = 998};
            this.getTags();
            this.checkTag = 0;
            this.pageData.page = 1;
            this.checkDate = 0;
            this.getData();
        },

        // 获取列表
        getData(){
            let postData = {
                dataType: 'kol',
                tag: this.checkTag,
                timer: this.checkDate,
                page: this.pageData.page,
                timeType: "week",
                platform: this.checkPlate_id,
                count:50,
            };
            this.loading = true;
            KASI.getData(postData).then(data => {
                 var res = JSON.parse(data.data)
                this.sampleCount = res.data.sampleCount;
                this.tableList = res.data.data;
				this.pageData.count = res.data.total;
                this.$nextTick(()=>{this.loading = false});
            })
        },
        pageChange(page){
			this.pageData.page = page;
            this.getData();
            document.documentElement.scrollTop = 0;
        },
        backtoTop(){
            document.documentElement.scrollTop = 0;
        }
    },
    created(){
        this.getTags();
        this.getDates();
    }
}
</script>
<style scoped>
    .checked-tag{
        cursor: pointer;
    }
    .header-class-name{
        color: #000;
    }
</style>