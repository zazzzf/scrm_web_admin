<template>
	<div class="infinite-list" v-infinite-scroll="handleReachBottom"   :style="{height:`${height}px`,marginTop:'20px'}">
		<el-card dis-hover v-for="(item, index) in hotVideoList" :key="index" class='videoCard' style="margin-bottom: 20px;">
			<el-row>
				<el-col :xs="24" :sm="8" :md="6" :lg="3">
					<div style="display:inline-flex; align-items: center;">
						<svg-icon icon-class="fire" v-if="index<3" style="font-size:28px" />
						<div style="width: 28px;" v-else></div>
						<span style="font-size: 18px; margin-right: 10px;">{{index+1}}.</span>
						<img :src="JSON.parse(item.avatar_larger).url_list[0]" alt="" width="70px">
					</div>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="15">
					<div>
						<p class="desc">标题：<a :href="item.share_url" target="_blank" title="点击此处浏览视频">{{item.desc}}</a></p>
						<p class="desc">播主：{{item.nickname}}</p>
					</div>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="6">
					<div>
						<p class="desc">
							<svg-icon icon-class="fire" :size='20' style='color:#FF7530' />下载数：{{item.download_count|formatNumberRgx}}
							<svg-icon icon-class="fire" :size='18' style='color:#FF7530' />点赞数：{{item.digg_count|formatNumberRgx}}
						</p>
						<p class="desc">
							<svg-icon icon-class="fire" :size='18' style='color:#FF7530' />评论数：{{item.comment_count|formatNumberRgx}}
							<svg-icon icon-class="fire" :size='18' style='color:#FF7530' />转发数：{{item.forward_count|formatNumberRgx}}
						</p>
						<el-button type="primary" @click='toForward(item.share_url)'>发布案例</el-button>
						<el-button type="success" @click=""><a :href="item.share_url" target="_blank" title="点击此处浏览视频" style="color:#fff">播放</a></el-button>
					</div>
				</el-col>
			</el-row>
		</el-card>
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
				hotTrack.getHotVideo(postData).then(res => {
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
			toForward(url){
				this.$router.push({
					name:'caseAdd',
					params:{url}
				})
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
