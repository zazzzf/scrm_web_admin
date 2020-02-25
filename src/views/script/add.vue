<template>
	<div>
		<el-card>
			<span slot="header">
				<el-page-header :title="$t('back')" @back="cancelScript" :content="scriptData.script_id?$t('casemanage.edit_script'):$t('casemanage.add_script')"></el-page-header>
			</span>
			<div style="max-width: 1000px;">
			    <el-form  :rules='lgRules' ref="lgForm" style="padding:20px 50px" :model="scriptData" label-position="top" @submit.native.prevent>
			        <el-form-item :label="$t('profile.title')" prop='title'>
			            <el-input v-model="scriptData.title"></el-input>
			        </el-form-item>
					<el-form-item :label="$t('casemanage.cover')" prop='cover'>
						<el-upload
						  class="avatar-uploader"
						  action="http://up-z1.qiniup.com"
						  accept="image/png, image/jpeg, image/jpg"
						  name="file"
						  :max-size="5120"
						  drag
						  :before-upload="coverBeforeUpload"
						  :data="qiniuData"
						  :on-success="coverSuccessUpload"
						  >
						  <img v-if="scriptData.cover" :src="scriptData.cover" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
			        <el-form-item :label="$t('form.content')" prop='content'>
						<textEditor :content='scriptData.content' @on-change='getText'></textEditor>
			        </el-form-item>
					<el-form-item :label="$t('casemanage.tag')" prop="tags">
						<el-select style="width: 100%;" clearable  v-model="scriptData.tags" multiple  :placeholder="$t('casemanage.tag_chose')">
							<el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div>
							<el-button @click="cancelScript">{{$t('cancel_text')}}</el-button>
							<el-button type="primary" @click="confirmCommit">{{$t('ok_text')}}</el-button>
						</div>
					</el-form-item>
			    </el-form>
			</div>
		</el-card>
	</div>
</template>
<script>
	import textEditor from '@/components/wangeditor/index.vue'
	import {qiniuToken} from '@/api/token'
	import scriptApi from '@/api/script.js';
	export default{
		components:{
			textEditor
		},
		data(){
			return{
				text:'',
				scriptData: {
					title: '',
					tags:[],
					cover:'',
					content:'',
				},
				qiniuData:{},
				lgRules: {
				    title: [{required: true, message: '请输入台本标题',trigger: 'change' }],
				    cover: [{required: true,message: '请上传台本封面',trigger: 'change' }],
				    content: [{required: true,message: '请填入台本内容',trigger: 'change' }],
				},
			}
		},
		computed:{
			tagsList(){
				return this.$store.getters.tagList
			}
		},
		methods:{
			getText(val){
				this.scriptData.content = val;
			},
         //{{$t('cancel_text')}}
            cancelScript() {
                this.$refs['lgForm'].resetFields();
                this.$router.push('/case/script-manage');
            },
			//封面上传
			coverSuccessUpload(response, file, fileList) {
				let that = this;
				if (response.hash && response.key) {
					this.scriptData.cover = 'http://scrm-image-qn.xaxhl.net/' + response.key;
				} else {
					this.$message.error(response.error);
				}
			},
			coverBeforeUpload(file) {
				var fileName = file.name.split('.');
				var suiji = Math.floor(Math.random() * (9999 - 1000)) + 1000;
				console.log('MD5文件名：' + fileName[0]);
				console.log('MD5随机数：' + suiji);
				return qiniuToken({
					type: 1
				}).then(data => {
					this.qiniuData.token = data.data;
					this.qiniuData.key = this.$md5(fileName[0] + suiji) + '.' + fileName.pop();
					// this.uploadLoading = true;
				});
			},
			
            //上传抖音灵感
            confirmCommit() {
                var that = this;
                this.$refs['lgForm'].validate((valid) => {
                    if (valid) {
						var tags='';
						if(this.scriptData.tags.length>0){
							this.scriptData.tags.forEach(item => {
								tags = tags.concat(`${item},`)
							})
							tags = tags.substr(0,tags.length-1);
						};
                        let postData = {
                            title: this.scriptData.title,
                            content: this.scriptData.content,
                            cover: this.scriptData.cover,
							tag: tags,
                        };
						if(this.scriptData.script_id){
							postData.scriptId = this.scriptData.script_id
							scriptApi.editScript(postData).then(data => {
							    that.$message.success('修改成功')
							    that.cancelScript();
							})
						}else{
							scriptApi.addScript(postData).then(data => {
							    that.$message.success('添加成功')
							    that.cancelScript();
							})
						}
                        
                    }
                })

            },
            getTikTokUrl(){
                this.isBtnLoad = true;
                if(this.scriptData.videolinks.indexOf('http://v.douyin.com')>=0){
                    var tikdata = this.scriptData.videolinks.replace(/\s*/g,"")
                    var a  = tikdata.substring(tikdata.indexOf('http'));
                    var b = a.split('复制'); //  b[0] 为抖音链接
                    scriptApi.getTikTokUrl({url: b[0]}).then(data => {
                        this.tikJson = data.data;
                        this.scriptData.douyinUrl = data.data.url;
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
					var tags = [];
					if(data.tag){
						data.tag.forEach(item => {
							tags.push(item.tag_id)
						})
					};
					this.scriptData = {
						script_id: data.script_id,
						title: data.title,
						tags:tags,
						cover: data.cover,
						content: data.content,
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>