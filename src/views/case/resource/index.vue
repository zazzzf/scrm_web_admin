<template>
	<div>
		<el-card  dis-hover>
		    <p slot="title">{{$t('hotRank')}} </p>
		    <div class="search-box">
		        <div class="header">
					<el-button type='primary' @click='componentsIndex = 1'>{{$t('casemanage.hot_video')}}</el-button>
					<el-button type='success' @click='componentsIndex = 2'>{{$t('casemanage.hot_challenge')}}</el-button>
					<el-button type='info' @click='componentsIndex = 3'>{{$t('casemanage.hot_star')}}</el-button>
					<el-button type='danger' @click='componentsIndex = 4'>{{$t('casemanage.hot_spot_video')}}</el-button>
					<el-select v-model='selectVal' style="width: 200px;">
						<el-option :value='1' label="抖音"></el-option>
					</el-select>
		        </div>
		    </div>
		</el-card>
		<div>
			<component :is='currentTabComponent' :height='scheight'></component>
		</div>
	</div>
</template>

<script>
	import HotVideo from './video'
	import HotStar from './star'
	import HotChallenge from './challenge'
	import HotSpotVideo from './hotvideo'
    export default {
		components:{
			HotVideo,HotChallenge,HotStar,HotSpotVideo
		},
        data () {
            return {
				componentsArr:[HotVideo,HotChallenge,HotStar,HotSpotVideo],
				componentsIndex:1,
				selectVal:1,
				scheight:0,
            }
        },
		computed:{
			currentTabComponent(){
				return this.componentsArr[this.componentsIndex-1]
			}
		},
		mounted(){
		    var height = document.body.clientHeight; 
		    this.scheight = height - 50-52-70;
		},
    }
</script>

<style>
	
</style>
