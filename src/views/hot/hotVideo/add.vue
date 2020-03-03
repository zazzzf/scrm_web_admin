<template>
    <div>
        <el-card>
            <span slot="header" v-if="userRole == 'admin'">
				<el-page-header :title="$t('back')" @back="cancelSubimt" :content="hotVideoData.inspiration_id?$t('hotTrack.edit_video'):$t('hotTrack.add_video')"></el-page-header>
			</span>
            <div>
                <el-form  :rules='formRules' ref="videoInfoForm" style="padding:20px 5%" :model="hotVideoData" @submit.native.prevent>
                    <el-form-item label="">
                        <el-switch v-model="quickForward" active-text="快捷发布" inactive-text="正常发布" @change="quickForm"></el-switch>
                    </el-form-item>
                    <el-form-item :label='$t("hotTrack.video_title")' prop='video_title'>
                            <el-input v-model="hotVideoData.video_title"></el-input>
                        </el-form-item>
                        <el-form-item :label='$t("form.videolinks")' prop='videolinks'>
                            <el-input v-model="hotVideoData.videolinks"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('casemanage.tag')" prop="tags">
                            <el-select style="width: 100%;" clearable  v-model="hotVideoData.tags" multiple  :placeholder="$t('casemanage.tag_chose')">
                                <el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item :label='$t("hotTrack.reason")' prop='reason'>
                            <el-input v-model="hotVideoData.reason" type="textarea" :rows="4"></el-input>
                        </el-form-item> -->
                    <template v-if="!quickForward">
                        <el-form-item :label="$t('hotTrack.chose_plate')" prop="chose_plate">
                            <el-select style="width: 100%;" clearable  v-model="hotVideoData.chose_plate" :placeholder="$t('casemanage.tag_chose')">
                                <el-option label="抖音" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item :label='$t("hotTrack.attributes")' prop='attributes'>
                            <el-input v-model="hotVideoData.attributes"></el-input>
                        </el-form-item>
                        <el-form-item :label='$t("hotTrack.script_text")' prop='script_text'>
                            <el-input v-model="hotVideoData.script_text" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                        
                        <el-form-item :label='$t("hotTrack.bedding")' prop='bedding'>
                            <el-input v-model="hotVideoData.bedding" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                        <el-form-item :label='$t("hotTrack.normal_story")' prop='normal_story'>
                            <el-input v-model="hotVideoData.normal_story" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                        <el-form-item :label='$t("hotTrack.unexpected_story")' prop='unexpected_story'>
                            <el-input v-model="hotVideoData.unexpected_story" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                        <el-form-item :label='$t("hotTrack.scalable_scene")' prop='scalable_scene'>
                            <el-input v-model="hotVideoData.scalable_scene" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                        <el-form-item :label='$t("hotTrack.remarks")' prop='remarks'>
                            <el-input v-model="hotVideoData.remarks" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                        <el-form-item :label='$t("hotTrack.hot_review")' prop='hot_review'>
                            <el-input v-model="hotVideoData.hot_review" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                    </template>

                    <el-form-item :label='$t("hotTrack.video_url")' prop='video_url'>
                        <div>
                            <el-link type="primary" @click="reloadUP" v-if="hotVideoData.video_url" style="margin-left:50px">重新上传</el-link>
                        </div>
                        <video :src="'http://' + hotVideoData.video_url" v-show="hotVideoData.video_url" width="300px" controls height="300px"></video>
                        <div v-model="hotVideoData.video_url" v-show="!hotVideoData.video_url" >
                            <custom-upload
                                ref="videoUpload"
                                accept="video/*,.mp4"
                                qiniuNamePrefix ="HV_"
                                :qiniuVideoBaseUrl="'scrm-tiktok-video-qn.xaxhl.net/'"
                                :uploadType="4"
                                :uploadTip="'只能上传MP4文件，且大小不超过500MB'"
                                @on-upSuccess="uploadSuccess"
                            >
                            </custom-upload>
                        </div>
                        
                    </el-form-item>

                    <el-form-item>
                        <div style="padding:30px 0">
							<el-button type="primary"  @click="confirmSubimt">{{$t('hotTrack.submit')}}</el-button>
							<el-button   @click="cancelSubimt">{{$t('hotTrack.cancel')}}</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>

import HOT_VIDEO_API from '@/api/hotVideo.js'
import customUpload from '@/components/custom-upload'

export default {
    components:{customUpload},
    data(){
        return{
            quickForward: false,
            hotVideoData: {
                    chose_plate:null,
                    videolinks:'',
                    video_title:'',
                    attributes:'',
                    script_text:'',
                    bedding:'',
                    normal_story:'',
                    unexpected_story:'',
                    scalable_scene:'',
                    remarks:'',
                    hot_review:'',
                    video_url:'',
					tags:[],
                },
                formRules: {
                    videolinks: [{required: true,  message: '请填入视频链接', trigger: 'change' }],
                    chose_plate: [{required: true, message: '请填入选择平台',trigger: 'change' }],
                    tags: [{required: true, message: '请选择标签',trigger: 'change' }],
                    video_title: [{required: true, message: '请填入推荐理由',trigger: 'change' }],
                    attributes: [{required: true, message: '请填入属性方向',trigger: 'change' }],
                    script_text: [{required: true, message: '请填入脚本内容',trigger: 'change' }],
                    bedding: [{required: true, message: '请填入铺垫',trigger: 'change' }],
                    normal_story: [{required: true, message: '请填入正常故事',trigger: 'change' }],
                    unexpected_story: [{required: true, message: '请填入意外故事',trigger: 'change' }],
                    scalable_scene: [{required: true, message: '请填入可拓展场景',trigger: 'change' }],
                    remarks: [{required: true, message: '请填入备注',trigger: 'change' }],
                    hot_review: [{required: true, message: '请填入热评',trigger: 'change' }],
                    video_url:[{required: true, message: '请上传视频',trigger: 'change' }],
                },
                tikJson:{},
				isBtnLoad:false,
				isEditCase:false,
        }
    },
	computed:{
		tagsList(){
			return this.$store.getters.tagList
        },
        userRole(){
            return this.$store.getters.userRole
        }
	},
    methods:{
         //{{$t('cancel_text')}}
            cancelSubimt() {
                this.$refs['videoInfoForm'].resetFields();
                this.reloadUP()
                if(this.userRole == 'admin'){
                    this.$router.push('/hotTrack/hot-Video');
                }
            },
            //上传抖音灵感
            confirmSubimt() {
                var that = this;
                this.$refs['videoInfoForm'].validate((valid) => {
                    if (valid) {
						var tags='';
						if(this.hotVideoData.tags.length>0){
							this.hotVideoData.tags.forEach(item => {
								tags = tags.concat(`${item},`)
							})
							tags = tags.substr(0,tags.length-1);
						};
                        let postData = {
                            accountPlatformId:this.hotVideoData.chose_plate,
                            video_link:this.hotVideoData.videolinks,
                            title: this.hotVideoData.video_title,
                            attributes:this.hotVideoData.attributes,
                            script:this.hotVideoData.script_text,
                            bedding:this.hotVideoData.bedding,
                            normal_story:this.hotVideoData.normal_story,
                            unexpected_story:this.hotVideoData.unexpected_story,
                            scalable_scene:this.hotVideoData.scalable_scene,
                            remarks:this.hotVideoData.remarks,
                            hot_review:this.hotVideoData.hot_review,
                            video_url: this.hotVideoData.video_url,
                            tag:tags,
                            is_moblie: this.$store.state.app.isMobile?"1":"-1"
                        };
						if(this.hotVideoData.data_id){
							postData.id = this.hotVideoData.data_id
							HOT_VIDEO_API.editHotVideo(postData).then(data => {
							    that.$message.success('修改成功')
							    that.cancelSubimt();
							})
						}else{
							HOT_VIDEO_API.addHotVideo(postData).then(data => {
							    that.$message.success('添加成功')
							    that.cancelSubimt();
							})
						}
                        
                    }
                })

            },
            
			isEdit(data){
				if(data){
					this.tikJson.url = data.no_watermark_video;
					this.tikJson.name = data.tiktok_video_name;
					
					var tags = [];
					if(data.tag){
						data.tag.forEach(item => {
							tags.push(item.tag_id)
						})
					};
					this.hotVideoData = {
                        data_id: data.data_id,
						chose_plate: String(data.account_platform_id),
                        videolinks: data.video_link,
                        video_title: data.title,
                        attributes: data.attributes,
                        script_text: data.script,
                        bedding: data.bedding,
                        normal_story: data.normal_story,
                        unexpected_story: data.unexpected_story,
                        scalable_scene: data.scalable_scene,
                        remarks: data.remarks,
                        hot_review: data.hot_review,
                        video_url: data.video_url,
						tags:tags
					}
				}else{
					return
				}
            },
            uploadSuccess(val){
                this.hotVideoData.video_url = val
            },
            reloadUP(){
                this.$refs['videoUpload'].resetFields();
            },
            /**快捷发布 */
            quickForm(val){
                if(val == false){
                    this.hotVideoData.chose_plate=null
                    this.hotVideoData.videolinks=''
                    this.hotVideoData.video_title=''
                    this.hotVideoData.attributes=''
                    this.hotVideoData.script_text=''
                    this.hotVideoData.bedding=''
                    this.hotVideoData.normal_story=''
                    this.hotVideoData.unexpected_story=''
                    this.hotVideoData.scalable_scene=''
                    this.hotVideoData.remarks=''
                    this.hotVideoData.hot_review=''
                    this.hotVideoData.video_url=''
                    this.hotVideoData.tags=[]
                }else{
                    this.hotVideoData.chose_plate= "4"
                    this.hotVideoData.videolinks=''
                    this.hotVideoData.video_title=''
                    this.hotVideoData.attributes='无'
                    this.hotVideoData.script_text='无'
                    this.hotVideoData.bedding='无'
                    this.hotVideoData.normal_story='无'
                    this.hotVideoData.unexpected_story='无'
                    this.hotVideoData.scalable_scene='无'
                    this.hotVideoData.remarks='无'
                    this.hotVideoData.hot_review='无'
                    this.hotVideoData.video_url=''
                    this.hotVideoData.tags=[]
                }
            }
    },
	created() {
		this.isEdit(this.$route.params.data)
		if(this.$route.params.url)this.hotVideoData.videolinks = this.$route.params.url
		if(this.$route.params.quick){this.quickForm(this.$route.params.quick); this.quickForward = this.$route.params.quick}
	}
}
</script>