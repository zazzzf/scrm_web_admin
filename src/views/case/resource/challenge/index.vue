<template>
	<div>
		<el-button @click="showDetails=false" 
		v-if="showDetails" 
		icon="el-icon-back"
		type='primary'
		size='large'
		circle
		title='点击返回话题列表'
		style="position: fixed;right: 50px;bottom: 30px; z-index: 999; width: 50px; height: 50px;"></el-button>
		<div v-infinite-scroll="handleReachBottom"  class="infinite-list" :style="{height:`${height}px`,marginTop:'20px'}" v-show='!showDetails'>
			<el-card dis-hover v-for="(item, index) in hotVideoList" :key="index" class='videoCard' style="margin-bottom: 20px;">
				<el-row type='flex' align='middle'>
					<el-col :span='1'>
						<div class="desc">
							<svg-icon icon-class="fire" v-if="index<3" style="font-size:28px" />
							<div style="width: 28px;" v-else></div>
							<span style="font-size: 18px; margin-right: 10px;">{{index+1}}.</span>
							<!-- <img :src="JSON.parse(item.avatar_larger).url_list[0]" alt="" width="70px"> -->
						</div>
					</el-col>
					<el-col :span='20'>
						<div>
							<p class="desc">标题：{{item.desc}}</p>
							<p class="desc">关键词：
								<a title="点击查看话题内视频" href="javascript:void(0);" @click='readDetails(item.douyin_challenge_list_id)'>#{{item.cha_name}}#</a>
							</p>
						</div>
					</el-col>
					<!-- <el-col :span='3'>
						<el-button @click='readDetails(item.douyin_challenge_list_id)'
						icon="md-arrow-round-forward"
						type='info'
						size='large'
						shape="circle"
						title='点击查看话题视频'
						style='width: 50px; height: 50px;'
						></el-button>
					</el-col> -->
				</el-row>
			</el-card>
		</div>
		<Details :height='height' :challengeId='challengeId' v-if='showDetails'></Details>
	</div>
</template>

<script>
	import hotTrack from '@/api/resource.js'
	import Details from './details'
    export default {
		components:{
			Details
		},
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
				challengeId:null,
				showDetails:false,
            }
        },
        methods: {
            handleReachBottom () {
				this.getList();
            },
			getList(){
				let postData = {
					page:this.pageNum,
				};
				hotTrack.getChallengeList(postData).then(res => {
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
			readDetails(id){
				this.challengeId = id;
				this.showDetails = true;
			}
        },
		created() {
			this.getList();
		}
    }
</script>

<style>
	.videoCard{
		padding: 10px;
	}
	.desc{
		margin: 10px 0;
		font-size: 16px;
	}
</style>
