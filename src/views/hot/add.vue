<template>
	<div>
		<el-card>
            <span slot="header">
				<el-page-header :title="$t('back')" @back="cancel" :content="formData.script_id?'编辑视频':'添加视频'" ></el-page-header>
			</span>
            <div style="max-width:1000px">
                <el-form ref="form" :model="formData" label-width="150px" :rules="rules" label-position="top">
                    <div>
                        <el-switch v-model="quickStatus" active-text="快捷发布" inactive-text="正常发布"></el-switch>
                    </div>
                    <el-divider />
                    
                    <el-form-item label="推荐理由" prop="title">
                        <el-input v-model="formData.title"></el-input>
                    </el-form-item>
                    <el-form-item label="视频链接" prop="video_link">
                        <el-input v-model="formData.video_link"></el-input>
                    </el-form-item>
                    <el-form-item label="标签" prop="tag">
                        <el-select clearable  v-model="formData.tag" multiple collapse-tags  placeholder="分类筛选">
                            <el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="视频上传" prop="video_url">
                        <el-row>
                            <el-col :md="12">
                                <Upload :fileList="formData.data_id?[{url:formData.video_url,name:formData.video_url}]:[]" :data="formData.video_url" :type="4" :prefix="'HV_'" :accept="'.mp4'" :qnlink="'http://scrm-tiktok-video-qn.xaxhl.net'" :md5="true" @on-success="getLink"></Upload>
                            </el-col>
                            <el-col :md="12">
                                 <video :src="formData.video_url" v-if="formData.video_url" controls style="max-height:250px"></video>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <template v-if="quickStatus==false">
                        <el-form-item label="平台" prop="accountPlatformId">
                            <el-select v-model="formData.accountPlatformId">
                                <el-option :value="4" label="抖音"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="脚本" prop="script">
                            <el-input v-model="formData.script" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="属性" prop="attributes">
                            <el-input v-model="formData.attributes" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="走红原因" prop="reason">
                            <el-input v-model="formData.reason" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="铺垫" prop="bedding">
                            <el-input v-model="formData.bedding" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="正常故事" prop="normal_story">
                            <el-input v-model="formData.normal_story" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="意外故事" prop="unexpected_story">
                            <el-input v-model="formData.unexpected_story" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="可扩展场景" prop="scalable_scene">
                            <el-input v-model="formData.scalable_scene" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remarks">
                            <el-input v-model="formData.remarks" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="热评" prop="hot_review">
                            <el-input v-model="formData.hot_review" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </template>
                    
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="submit" >确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </span>
            </div>
        </el-card>
	</div>
</template>
<script>
import Upload from '@/components/coustom-upload'
import hotApi from '@/api/hot.js'
export default {
    components:{
        Upload
    },
	data(){
        return{
            quickStatus: false,
            formData:{
                accountPlatformId:'',
                title:'',
                script:'',
                attributes:'',
                reason:'',
                bedding:'',
                normal_story:'',
                unexpected_story:'',
                scalable_scene:'',
                remarks:'',
                hot_review:'',
                video_link:'',
                tag:[],
                video_url:'',
                is_moblie:'',
            },
            rules:{
                accountPlatformId: [{ required: true, message: '请填入平台', trigger: 'change', type:"number" }],
                title: [{ required: true, message: '请填入标题', trigger: 'change' }],
                script: [{ required: true, message: '请输入脚本', trigger: 'change' }],
                attributes: [{ required: true, message: '请输入属性', trigger: 'change' }],
                reason: [{ required: true, message: '请输入走红原因', trigger: 'change' }],
                bedding: [{ required: true, message: '请输入铺垫', trigger: 'change' }],
                normal_story: [{ required: true, message: '请输入正常故事', trigger: 'change' }],
                unexpected_story: [{ required: true, message: '请输入意外故事', trigger: 'change' }],
                scalable_scene: [{ required: true, message: '请输入可扩展场景', trigger: 'change' }],
                remarks: [{ required: true, message: '请输入备注', trigger: 'change' }],
                hot_review: [{ required: true, message: '请输入热评', trigger: 'change' }],
                video_link: [{ required: true, message: '请输入视频链接', trigger: 'change' }],
                tag: [{ required: true, message: '请输入标签', trigger: 'change' }],
                video_url: [{ required: true, message: '请输入视频地址', trigger: 'change' }],
            },
        }
    },
    computed:{
        tagsList(){
				return this.$store.getters.tagList
			}
    },
    methods:{
        cancel(){
            this.$router.push('videos')
        },
        getData(){
            var data = this.$route.params.data
            if(this.$route.params.quick == true){
                this.quickStatus = true
            }
            if(data){
                this.formData = data
                this.formData.video_url = data.video_url.indexOf('http://')==-1?"http://"+data.video_url:data.video_url
                this.formData.accountPlatformId = data.account_platform_id
                var tag = []
                data.tag.forEach(item => {
                    tag.push(item.tag_id)
                })
                this.formData.tag = tag
            }

        },
        getLink(link){
            this.formData.video_url = link
        },
        
        submit(){
            let postData = {
                    accountPlatformId: this.formData.accountPlatformId||4,
                    title: this.formData.title,
                    script: this.formData.script==""?"无":this.formData.script,
                    attributes: this.formData.attributes==""?"无":this.formData.attributes,
                    reason: this.formData.reason==""?"无":this.formData.reason,
                    bedding: this.formData.bedding==""?"无":this.formData.bedding,
                    normal_story: this.formData.normal_story==""?"无":this.formData.normal_story,
                    unexpected_story: this.formData.unexpected_story==""?"无":this.formData.unexpected_story,
                    scalable_scene: this.formData.scalable_scene==""?"无":this.formData.scalable_scene,
                    remarks: this.formData.remarks==""?"无":this.formData.remarks,
                    hot_review: this.formData.hot_review==""?"无":this.formData.hot_review,
                    video_link: this.formData.video_link,
                    video_url: this.formData.video_url,
                    // is_moblie: this.formData.is_moblie||"无",
            };
            if(this.quickStatus == true) postData.is_moblie = 1
            if(this.formData.tag.length>0){
                var tags = '';
                this.formData.tag.forEach(item => {
                    tags = tags.concat(`${item},`)
                })
                postData.tag = tags.substr(0,tags.length-1);
            }
            this.$refs.form.validate(valid => {
                if(valid){
                    if(this.formData.data_id){
                        postData.id = this.formData.data_id
                        hotApi.editHotVideo(postData).then(res => {
                            this.$message.success('提交成功')
                            this.cancel();
                        })
                    }else{
                        hotApi.addHotVideo(postData).then(res => {
                            this.$message.success('提交成功')
                            this.cancel();
                        })
                    }
                }
            })
        },
    },
    mounted(){
        this.getData();
    }
}
</script>