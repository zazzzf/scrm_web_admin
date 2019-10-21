<template>
	<div>
		<div v-infinite-scroll="handleReachBottom"  class="infinite-list" :style="{height:`${height}px`,marginTop:'20px'}">
			<el-card dis-hover v-for="(item, index) in hotVideoList" :key="index" class='videoCard' style="margin-bottom: 20px;">
				<el-row type='flex' align='middle'>
					<el-col :span='3'>
						<div style="display:inline-flex; align-items: center;">
							<svg-icon icon-class="fire" v-if="index<3" style="font-size:28px" />
							<div style="width: 28px;" v-else></div>
							<span style="font-size: 18px; margin-right: 10px;">{{index+1}}.</span>
							<img :src="JSON.parse(item.origin_cover_list).url_list[0]" alt="" width="70px">
						</div>
					</el-col>
					<el-col :span='15'>
						<div>
							<p class="desc">{{$t('profile.title')}}：<a :href="item.share_url" target="_blank" title="点击此处浏览视频">{{item.desc}}</a></p>
							<p class="desc">{{$t('profile.anchor')}}：{{item.nickname}}</p>
						</div>
					</el-col>
					<el-col :span='6'>
						<div>
							<p class="desc">
								<svg-icon icon-class="fire" :size='20' style='color:#FF7530' />{{$t('profile.download_count')}}：{{item.download_count|formatNumberRgx}}
								<svg-icon icon-class="fire" :size='18' style='color:#FF7530' />{{$t('profile.digg_count')}}：{{item.digg_count|formatNumberRgx}}
							</p>
							<p class="desc">
								<svg-icon icon-class="fire" :size='18' style='color:#FF7530' />{{$t('profile.comment_count')}}：{{item.comment_count|formatNumberRgx}}
								<svg-icon icon-class="fire" :size='18' style='color:#FF7530' />{{$t('profile.forward_count')}}：{{item.forward_count|formatNumberRgx}}
							</p>
							<el-button type="primary" @click='toForward(item.share_url)'>{{$t('profile.forward_case')}}</el-button>
							<el-button type="success" @click=""><a :href="item.share_url" target="_blank" title="点击此处浏览视频" style="color:#fff">{{$t('play')}}</a></el-button>
							<el-button :type="item.collection==1?'warning':'default'" @click='toCollection(item)'>{{item.collection==1?$t('casemanage.is_collection'):$t('casemanage.collection')}}</el-button>
						</div>
					</el-col>
				</el-row>
			</el-card>
		</div>
	</div>
</template>

<script>
	import Resource from '@/api/resource.js'
    export default {
		props:{
			height:{type:Number,default:800},
			challengeId:null,
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
					challengeId:this.challengeId,
				};
				Resource.getChallengeVideos(postData).then(res => {
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
			},
			toCollection(item){
				let postData = {
					type: 1, //1热点话题视频 2热门视频 3热点视频
					contentId: item.douyin_challenge_videos_id
				};
				if(item.collection == 1){
					Resource.cancelCollection(postData).then(res => {
						this.$message.info('已取消收藏')
						this.resetGitList();
					})
				}else{
					Resource.addCollection(postData).then(res => {
						this.$message.success('收藏成功')
						this.resetGitList();
					})
				}
			},
			resetGitList(){
				this.pageNum = 1;
				this.hotVideoList = [];
				this.getList();
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
