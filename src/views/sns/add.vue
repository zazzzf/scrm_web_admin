<template>
	<el-card>
		<span slot="header">
			<el-page-header :title="$t('back')"
				@back="
					() => {
						this.$refs['konwledgeForm'].resetFields();
						this.$router.push('/sns');
					}
				"
				:content="addKonwledgeData.knowledge_id?$t('casemanage.edit_report'):$t('casemanage.add_report')"
			></el-page-header>
		</span>
		<div style="padding: 0 200px;">
			<el-form :rules="miaopaiRules" ref="konwledgeForm" :model="addKonwledgeData" label-width="100px">
				<el-form-item :label="$t('knowledge.type')" prop="type">
					<el-select v-model="addKonwledgeData.type">
						<el-option v-for="item in categoryList" :label="item.name" :value="item.category_id" :key="item.category_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('knowledge.title')" prop="title"><el-input v-model="addKonwledgeData.title"></el-input></el-form-item>
				<el-form-item :label="$t('knowledge.description')" prop="description"><el-input v-model="addKonwledgeData.description" type="textarea"></el-input></el-form-item>
				<el-form-item :label="$t('casemanage.tag')" prop="tags">
					<el-select style="width: 100%;" clearable  v-model="addKonwledgeData.tags" multiple  :placeholder="$t('casemanage.tag_chose')">
						<el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('knowledge.cover')" prop="cover">
						
						<image-upload :limit='1' 
						:accept="'image/*'" 
						:uploadType="1" 
						:qiniuBaseUrl="$config.QINIU_URL_TYPE_IMG" 
						:qiniuNamePrefix="'ZK_BG_'" 
						:isAppendDialog="true" 
						:propFileList="addKonwledgeData.cover?[{url:addKonwledgeData.cover+'?imageMogr2/auto-orient'}]:[]" 
						@on-upSuccess="getImgLinks"></image-upload>
						
				</el-form-item>
				<el-form-item :label="$t('knowledge.url')" prop="url">
					<el-upload
						ref="upload"
						:action="uploadApi"
						name="file"
						:max-size="512000"
						accept=".pdf"
						:file-list="uploadData.fileList"
						:data="uploadData.qiniu"
						:on-success="handleSuccessUpload"
						:on-exceeded-size="handleSizeOut"
						:before-upload="handleBeforeUpload"
						:on-progress="onFileProgress"
						:on-error="handleErrorUpload"
						:on-format-error="handleFormatError"
						drag
					>
						<i class="el-icon-upload" v-model="addKonwledgeData.url"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传pdf文件，且不超过500MB</div>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<div>
						<el-button @click="cancelAddSns">{{$t('cancel_text')}}</el-button>
						<el-button type="primary" @click="uploadMiaopai">{{$t('ok_text')}}</el-button>
					</div>
				</el-form-item>
			</el-form>
		</div>
	</el-card>
</template>
<script>
import mpJson from '@/static/mpCategory.json';
import Cookies from 'js-cookie';
import { qiniuToken } from '@/api/token';
import snsApi from '@/api/sns';
import imageUpload from '@/components/image-upload'


export default {
	components:{imageUpload},
	data() {
		const validatePass = (rule, value, callback) => {
			if (value.length == 0) {
				callback(rule.message);
			} else {
				callback();
			}
		};
		return {
			// uploadApi: 'http://scrm-api.xaxhl.net/index.php?s=merchant/material/upload',
			uploadApi: 'http://up-z1.qiniup.com',
			uploadSpeed: '0KB/s',
			uploadData: {
				fileList:[],
				type: 2, //类型 1图片2视频"
				name: '',
				teamId: '',
				qiniu: {
					key: '',
					token: ''
				}
			},
			playerOptions: {
				height: '360',
				autoplay: false,
				sources: [
					{
						// mp4
						// type: 'video/mp4',
						// src: 'http://vjs.zencdn.net/v/oceans.mp4',
						// flv
						type: 'video/x-flv',
						src: ''
					}
				],
				language: 'zh-CN',
				techOrder: ['flash']
				//   poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-6.jpg"
			},
			uploadNumber: 0,
			uploadLoading: false,
			mpCategory: mpJson,
			addKonwledgeData: {
				industry: '',
				type: '',
				title: '',
				description: '',
				fileType: '1',
				url: '',
				cover: '',
				tags: [],
				choseUrl: '',
				qiniu: {}
			},
			miaopaiRules: {
				industry: [{ required: true, message: '请填入所属行业', trigger: 'change', type: 'number' }],
				description: [{ required: true, message: '请填入描述', trigger: 'change' }],
				title: [{ required: true, message: '请填入账号标题', trigger: 'change' }],
				type: [{ required: true, message: '请填入账号标题', trigger: 'change', type: 'number' }],
				fileType: [{ required: true, message: '请选择灵感类型', trigger: 'change' }],
				url: [{ required: true, message: '请上传代表作品', trigger: 'blur' }],
				cover: [{ required: true, message: '请上传视频封面', trigger: 'blur' }]
			},
			selectMaterialVideo: '',
			materialList: [],
			pagePhoto: 1,
			showPhotoMaterial: false,
			progressData: {
				num: 0,
				start: false,
				speed: '0K/S',
				status: 'active'
			}
		};
	},
	computed:{
		tagsList(){
			return this.$store.getters.tagList
		},
		categoryList(){
			return this.$store.getters.categoryList
		}
	},
	methods: {
		handleScrollBottom() {
			this.pagePhoto++;
		},
		handleBeforeUpload(file) {
			var fileName = file.name.split('.');
			var suiji = Math.floor(Math.random() * (9999 - 1000)) + 1000;
			console.log('MD5文件名：' + fileName[0]);
			console.log('MD5随机数：' + suiji);
			return qiniuToken({
				type: 3
			}).then(data => {
				this.uploadData.qiniu.token = data.data;
				this.uploadData.qiniu.key = 'ZK_' + this.$md5(fileName[0] + suiji) + '.' + fileName.pop();
				this.uploadLoading = true;
			});
		},
		handleFormatError(file, fileList) {
			this.$message.error(file.name + this.$t('material.format_error'));
			this.uploadLoading = false;
		},
		handleErrorUpload(error, file, fileList) {
			this.uploadLoading = false;
			this.$message.error(this.$t('material.upload_error'));
		},
		handleSizeOut(file, fileList) {
			this.uploadLoading = false;
			this.$message.error(file.name + this.$t('material.size_out'));
		},
		handleSuccessUpload(response, file, fileList) {
			if(fileList.length>1){
				fileList.shift()
			}
			let that = this;
			if (response.hash && response.key) {
				that.uploadNumber--;
				this.addKonwledgeData.url = 'http://scrm-knowledge-qn.xaxhl.net/' + response.key;
				if (that.uploadNumber == 0) {
					this.$message.success(this.$t('material.upload_success'));
					this.uploadLoading = false;
				}
			} else {
				this.$message.error(response.message);
				this.uploadLoading = false;
			}
		},

		onFileProgress(event, file, fileList) {
			if (this.uploadNumber == 0) this.uploadNumber = fileList.length;
			var uploadTime = (event.timeStamp / 1000).toFixed(2);
			var uploadSize = (event.loaded / 1024).toFixed(2);
			var speed = (uploadSize / uploadTime).toFixed(2);
			if (speed > 1000) {
				speed = (speed / 1000).toFixed(2) + 'MB/s';
			} else {
				speed = speed + 'KB/s';
			}
			this.uploadSpeed = speed;
		},
		//封面上传
		coverSuccessUpload(response, file, fileList) {
			let that = this;
			if (response.hash && response.key) {
				this.progressData.num = 100;
				this.addKonwledgeData.cover = 'http://scrm-image-qn.xaxhl.net/' + response.key;
				this.progressData.num = 0;
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
				this.addKonwledgeData.qiniu.token = data.data;
				this.addKonwledgeData.qiniu.key = this.$md5(fileName[0] + suiji) + '.' + fileName.pop();
				this.progressData.num = 0;
				// this.uploadLoading = true;
			});
		},
		onCoverProgress(event, file, fileList) {
			this.progressData.start = true;
			//计算上传速度
			var uploadTime = (event.timeStamp / 1000).toFixed(2);
			var uploadSize = (event.loaded / 1024).toFixed(2);
			var speed = (uploadSize / uploadTime).toFixed(2);
			if (speed > 1000) {
				speed = (speed / 1000).toFixed(2) + 'MB/s';
			} else {
				speed = speed + 'KB/s';
			}
			this.progressData.speed = speed;
			// 计算上传进度
			var progress = event.loaded / event.total;
			this.progressData.num = parseInt(progress * 100) - 1;
		},
		uploadMiaopai() {
			var that = this;
			this.$refs['konwledgeForm'].validate(valid => {
				if (valid) {
					var tags='';
					if(this.addKonwledgeData.tags.length>0){
						this.addKonwledgeData.tags.forEach(item => {
							tags = tags.concat(`${item},`)
						})
						tags = tags.substr(0,tags.length-1);
					};
					let postData = {
						type: this.addKonwledgeData.type,
						title: this.addKonwledgeData.title,
						description: this.addKonwledgeData.description,
						url: this.addKonwledgeData.url,
						cover: this.addKonwledgeData.cover,
						tag:tags,
					};
					if(this.addKonwledgeData.knowledgeId){
						postData.knowledgeId = this.addKonwledgeData.knowledgeId
						snsApi.editKnowledge(postData).then(data => {
						    that.$message.success('修改成功')
						    that.cancelAddSns();
						})
					}else{
						snsApi.addKnowledge(postData).then(data => {
							that.$message.success('添加成功');
							that.cancelAddSns();
						});
					}
				}
			});
		},
		cancelAddSns() {
			// this.$refs['konwledgeForm'].resetFields();
			this.$router.push('/sns');
		},
		getImgLinks(val){
			this.addKonwledgeData.cover = val
		},
		isEdit(data){
			if(data){
				this.uploadData.fileList = [{
					name:data.url.split('/')[3].split('?')[0],
					url: data.url.split('?')[0],
				}]
				var tags = [];
				if(data.tag){
					data.tag.forEach(item => {
						tags.push(item.tag_id)
					})
				};
				this.addKonwledgeData = {
					knowledgeId:data.knowledge_id,
					type: data.type,
					title: data.title,
					description: data.description,
					url: data.url.split('?')[0],
					cover: data.cover,
					tags:tags,
				};
				
			}else{
				return
			}
		}
	},
	mounted() {
		this.isEdit(this.$route.params.data)
	}
};
</script>
