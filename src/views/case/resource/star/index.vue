<template>
	<div>
		<el-select style='position: fixed;width: 100px;right: 20px; z-index: 2; ' v-model='periods' @change='handleChange'>
			<el-option v-for='item in periodsArr' :key='item' :value='item.toString()' :label="item+ $t('casemanage.period')"></el-option>
		</el-select>
		<div v-infinite-scroll="handleReachBottom"  class="infinite-list" :style="{height:`${height}px`,marginTop:'20px'}">
			<el-card dis-hover v-for="(item, index) in hotVideoList" :key="index" class='videoCard' style="margin-bottom: 20px;">
				<el-row>
					<el-col :span='3'>
						<div style="display:inline-flex; align-items: center;">
							<svg-icon icon-class="fire" style='color:#FF7530;font-size:28px' v-if='index+1<4' />
							<div style="width: 28px;" v-else></div>
							<span style="font-size: 18px; margin-right: 10px;">{{index+1}}.</span>
							<img :src="JSON.parse(item.avatar).url_list[0]" alt="" width="70px">
						</div>
					</el-col>
					<el-col :span='15'>
						<div style="display:inline-flex;height:70px; align-items: center;">
							<p class="desc">{{$t('profile.anchor')}}：<a href="javascript:void(0);" @click="getStarDetails(item.uid)">{{item.nickname}}</a></p>
						</div>
					</el-col>
					<el-col :span='6'>
						<div style="display:inline-flex;height:70px; align-items: center;">
							<svg-icon icon-class="fire"  style='color:#FF7530' />{{$t('casemanage.hot_value')}}：{{item.hot_value|formatNumberRgx}}
						</div>
					</el-col>
				</el-row>
			</el-card>
		</div>
		<el-dialog :visible.sync='showStarDetails'>
			<div v-if="starDetails.avatar">
				<div style="display:flex;height:70px; align-items: center;">
					<img v-if="showStarDetails" :src="JSON.parse(starDetails.avatar).url_list[0]" alt="" width="70px">
					<p style="font-size: 20px; font-weight: bold; margin-left: 20px;">
						<a title="点击跳转播主主页" :href="'https://' + starDetails.share_url" target="_blank">{{starDetails.nickname}}</a>
					</p>
				</div>
				<p style="padding: 10px 10px;font-size: 16px; ">{{starDetails.signature}}</p>
				<el-divider></el-divider>
				<p style="padding: 10px 10px;font-size: 16px; ">{{$t('hotTrack.following_count')}}: {{starDetails.following_count}}</p>
				<p style="padding: 10px 10px;font-size: 16px; ">{{$t('hotTrack.dongtai_count')}}: {{starDetails.dongtai_count}}</p>
				<p style="padding: 10px 10px;font-size: 16px; ">{{$t('hotTrack.digg_count')}}: {{starDetails.total_favorited}}</p>
				<p style="padding: 10px 10px;font-size: 16px; ">{{$t('hotTrack.favoriting_count')}}: {{starDetails.favoriting_count}}</p>
				<p style="padding: 10px 10px;font-size: 16px; ">{{$t('hotTrack.aweme_count')}}: {{starDetails.aweme_count}}</p>
			</div>
			<div v-else style="height: 300px; display: flex; align-items: center;justify-content: center;font-size: 20px; color: #b5C8CE;">
				<p >{{$t('hotTrack.no_data')}}</p>
			</div>
			<div slot='footer'></div>
		</el-dialog>
	</div>
</template>

<script>
	import hotTrack from '@/api/resource.js'
    export default {
		props:{
			height:{type:Number,default:800}
		},
		filters:{
			//超过一千用逗号隔开
			formatNumberRgx: function(num) {
			    var parts = num.toString().split(".");
			    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			    return parts.join(".");
			},
		},
        data () {
            return {
				hotVideoList:[],
				pageNum:1,
				showStarDetails:false,
				periodsData:{},
				periods:null,
				starDetails:{},
            }
        },
		computed:{
			periodsArr(){
				var periodsArr = [];
				for(var i = this.periodsData.min_periods; i <= this.periodsData.max_periods; i++){
					periodsArr.push(i);
				};
				return periodsArr;
			}
		},
        methods: {
            handleReachBottom () {
				this.getList();
            },
			getList(){
				if(!this.periods)return
				let postData = {
					page:this.pageNum,
					periods: this.periods,
				};
				hotTrack.getHotStar(postData).then(res => {
					var list = res.data.list;
					var oldList = this.hotVideoList;
					if(list.length>0){
						this.hotVideoList = oldList.concat(list);
						this.pageNum++;
					}else{
						this.$Message.warning('没有更多了')
					}
				})
			},
			getMaxPeriods(){
				hotTrack.getMaxPeriods().then(res => {
					this.periodsData = res.data;
					this.periods = this.periodsData.max_periods;
					this.getList();
				})
			},
			getStarDetails(uid){
				hotTrack.getStarUserInfo({uid}).then(res => {
					this.starDetails = res.data;
					this.showStarDetails = true;
				})
			},
			handleChange(){
				this.pageNum = 1;
				this.hotVideoList = [];
				this.getList();
			}
        },
		created() {
			this.getMaxPeriods();
		}
    }
</script>

<style>
	.videoCard{
		padding: 10px;
	}
	.desc{
		font-size: 16px;
	}
	.userNumber{
		text-align: center;
	}
</style>
