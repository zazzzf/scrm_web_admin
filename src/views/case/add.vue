<template>
    <div>
        <el-card>
            <span slot="header">
				<el-page-header @back="cancelTik" :content="addDyData.inspiration_id?'编辑案例':'添加案例'"></el-page-header>
			</span>
            <div>
                <el-form  :rules='lgRules' ref="lgForm" style="padding:20px 50px" :model="addDyData" @submit.native.prevent>
                    <el-form-item :label='$t("form.videolinks")' prop='videolinks'>
                        <el-input v-model="addDyData.videolinks" :disabled='addDyData.inspiration_id?true:false'>
							<el-button :disabled='addDyData.inspiration_id?true:false' :loading="isBtnLoad" style="background:#409EFF;color:#fff" slot="append" icon="el-icon-search" @click='getTikTokUrl'>校验地址</el-button>
						</el-input>
                        <div v-if="tikJson.url">
							<p>
								<i class="el-icon-success" style="color:#19be6b" />
								<el-link type='success' :href="tikJson.url" target="_blank">已校验成功！若无法播放可点我跳转播放</el-link>
							</p>
							<video :src="tikJson.url" controls style="height:300px"></video>
						</div>
                        <!-- <a :href="tikJson.url">{{tikJson.url}}</a> -->
                    </el-form-item>
                    <el-form-item :label='$t("form.accountlinks")' prop='accountLink'>
                        <el-input v-model="addDyData.accountLink"></el-input>
                    </el-form-item>
                    <el-form-item :label='$t("form.reason")' prop='reason'>
                        <el-input v-model="addDyData.reason" type="textarea" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item :label='$t("form.learn")' prop='learn'>
                        <el-input v-model="addDyData.learn" type="textarea" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item :label='$t("form.inspiration")' prop='inspiration'>
                        <el-input v-model="addDyData.inspiration" type="textarea" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div style="padding:30px">
							<el-button type="primary"  @click="addTikLg">{{tikJson.name?'确定':'请效验视频地址'}}</el-button>
							<!-- <el-button type="default"  @click="cancelTik">取消</el-button> -->
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>

import caseApi from '@/api/case.js'

export default {
    data(){
        const validatePassVideo = (rule, value, callback) => {
            if(!value){
                callback(new Error('请输入抖音视频地址'));
            }else{
                if (value.indexOf('http://v.douyin.com') < 0) {
                    callback(new Error('请输入正确的抖音视频地址'));
                } else {
                    callback();
                }
            }
            
        };
        return{
            addDyData: {
                    videolinks: '',
                    reason: '',
                    learn: '',
                    inspiration: '',
                    douyinUrl: '',
                    accountLink:'',
                },
                lgRules: {
                    videolinks: [{required: true, validator: validatePassVideo, trigger: 'change' }],
                    accountLink: [{required: true,message: '请填入账号链接',trigger: 'change' }],
                    reason: [{required: true,message: '请填入走红原因',trigger: 'change' }],
                    learn: [{required: true,message: '请填入借鉴意义',trigger: 'change' }],
                    inspiration: [{required: true,message: '请填入灵感内容',trigger: 'change' }],
                },
                tikJson:{},
				isBtnLoad:false,
				isEditCase:false,
        }
    },
    methods:{
         //取消上传
            cancelTik() {
                this.$refs['lgForm'].resetFields();
                this.$router.push('/case');
            },
            //上传抖音灵感
            addTikLg() {
                var that = this;
                this.$refs['lgForm'].validate((valid) => {
                    if (valid && that.addDyData.douyinUrl) {
                        let postData = {
                            videoUrl: this.addDyData.videolinks,
                            accountLink: this.addDyData.accountLink,
                            reason: this.addDyData.reason,
                            learn: this.addDyData.learn,
                            inspiration: this.addDyData.inspiration,
                            noWatermarkVideo: this.addDyData.douyinUrl,
                            tikTokVideoName: this.tikJson.name
                        };
						if(this.addDyData.inspiration_id){
							postData.inspirationId = this.addDyData.inspiration_id
							caseApi.editTikTok(postData).then(data => {
							    that.$message.success('修改成功')
							    that.cancelTik();
							})
						}else{
							caseApi.addTiktok(postData).then(data => {
							    that.$message.success('添加成功')
							    that.cancelTik();
							})
						}
                        
                    }
                })

            },
            getTikTokUrl(){
                this.isBtnLoad = true;
                if(this.addDyData.videolinks.indexOf('http://v.douyin.com')>=0){
                    var tikdata = this.addDyData.videolinks.replace(/\s*/g,"")
                    var a  = tikdata.substring(tikdata.indexOf('http'));
                    var b = a.split('复制'); //  b[0] 为抖音链接
                    caseApi.getTikTokUrl({url: b[0]}).then(data => {
                        this.tikJson = data.data;
                        this.addDyData.douyinUrl = data.data.url;
                        this.isBtnLoad = false;
                    }).catch(err => {
                        this.isBtnLoad = false;
                    })
                }else{
                    this.isBtnLoad = false;
                    return;
                }
            },
			isEdit(data){
				if(data){
					this.tikJson.url = data.no_watermark_video;
					this.tikJson.name = data.tiktok_video_name;
					this.addDyData = {
						inspiration_id:data.inspiration_id,
						videolinks: data.video_url,
						reason: data.reason,
						learn: data.learn,
						inspiration: data.inspiration,
						douyinUrl: data.no_watermark_video ,
						accountLink: data.account_links,
					}
				}else{
					return
				}
			}
    },
	created() {
		this.isEdit(this.$route.params.data)
	}
}
</script>