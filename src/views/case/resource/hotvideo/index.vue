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
		<div v-infinite-scroll="handleReachBottom"  class="infinite-list" :style="{height:`${height}px`,marginTop:'20px'}" v-show='!showDetails' infinite-scroll-immediate='false'>
			<waterfall :col='6' :data="hotVideoList">
				<el-card dis-hover v-for="(item, index) in hotVideoList" :key="index" class='videoCard' style="width:97%;display:inline-block;">
					<div>
						<!-- <svg-icon icon-class="fire" v-if="index<3" style="font-size:28px" />
						<div style="width: 28px;" v-else></div>
						<span style="font-size: 18px; margin-right: 10px;">{{index+1}}.</span> -->
						<p class="desc">
							<!-- 热点名称： -->
							<a title="点击查看热点内视频" href="javascript:void(0);"  @click='readDetails(item.douyin_hotspot_id)'>#{{item.name}}#</a>
							<el-image 
								style="margin-top:10px"
								:src="item.cover_list.url_list[0]"
								:preview-src-list="[item.cover_list.url_list[0]]">
							</el-image>
						</p>
					</div>
				</el-card>
			</waterfall>
		</div>
		<Details :height='height' :challengeId='challengeId' v-if='showDetails'></Details>
	</div>
</template>

<script>
	import hotTrack from '@/api/resource.js'
	import waterfall from '@/components/vue-waterfall2/waterfall'
	import Details from './details'
    export default {
		components:{
			Details,waterfall
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
					pageSize:50,
				};
				hotTrack.getHotSpot(postData).then(res => {
					var list = res.data.list;
					var oldList = this.hotVideoList;
					if(list.length>0){
						for(var i = 0 ;i<list.length;i++){
							list[i].cover_list = JSON.parse(list[i].cover_list);
						}
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
		padding: 0px !important;
	}
	.desc{
		margin: 10px 0;
		font-size: 16px;
	}
</style>
