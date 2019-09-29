<template>
	<!-- content 编辑器内容  menus 编辑器工具栏  默认全部 -->
	<div class="editor">
		<div class="header">
			<div id="div1" class="toolbar"></div>
			<el-upload
				class="upload-demo"
				action="http://up-z1.qiniup.com"
				:limit="1"
				accept="video/*,.mp4"
				:data="uploadData"
				:disabled='uploadLoading'
				v-if='fileList.length == 0'
				:show-file-list="false"
				:before-upload="handleBeforeUpload"
				:on-progress="onFileProgress"
				:on-success="handleSuccessUpload"
			>
				<el-button  size="small" type="primary">上传视频</el-button>
			</el-upload>
			<span v-if="uploadLoading">{{ uploadSpeed }}</span>
			<el-progress v-if="uploadLoading" :percentage="progressNum"></el-progress>
		</div>
		<div id="div2" class="text"></div>
		<div ref="editor" style="text-align:left;"></div>
	</div>
</template>

<script>
import E from 'wangeditor';
var editor;
import emojiArr from './emoji.js';
import { qiniuToken,uploadImg } from '@/api/token';

export default {
	props: {
		content: { type: String, default: '' },
		menus: {
			type: Array,
			default: () => {
				return [
					'head', // 标题
					'bold', // 粗体
					'fontSize', // 字号
					'fontName', // 字体
					'italic', // 斜体
					'underline', // 下划线
					'strikeThrough', // 删除线
					'foreColor', // 文字颜色
					'backColor', // 背景颜色
					'link', // 插入链接
					'list', // 列表
					'justify', // 对齐方式
					'quote', // 引用
					'emoticon', // 表情
					'image', // 插入图片
					'table', // 表格
					'video', // 插入视频
					'code', // 插入代码
					'undo', // 撤销
					'redo' // 重复
				];
			}
		}
	},
	data() {
		return {
			currentValue: '',
			uploadSpeed: '0KB/s',
			uploadData:{
				token:'',key:''
			},
			fileList:[],
			progressNum:0,
			uploadLoading:false,
		};
	},
	methods: {
		createEditor() {
			var that = this;
			var qiniutoken = '';
			editor = new E('#div1', '#div2');
			editor.customConfig = {
				zIndex: 100,
				onchange: function(html) {
					that.currentValue = html;
					that.$emit('on-change', that.currentValue);
				},
				
				menus: that.menus,
				emotions: [
					{
						// emoji
						title: '😀',
						// type -> 'emoji' / 'image'
						type: 'emoji',
						// content -> 数组
						content: emojiArr.Smileys
					},
					{
						// 人和幻想
						title: '👶',
						// type -> 'emoji' / 'image'
						type: 'emoji',
						// content -> 数组
						content: emojiArr.PeopleAndFantasy
					},
					{
						// 衣服及配饰
						title: '👚',
						// type -> 'emoji' / 'image'
						type: 'emoji',
						// content -> 数组
						content: emojiArr.ClothingAndAccessories
					}
				],
				//---------配置上传图片---------
				uploadImgServer:"http://up-z1.qiniup.com",
				customUploadImg :function (files, insert) {
				    new Promise((resolve,reject) => {
						qiniuToken({type:1}).then(res => {
							resolve(res.data)
						})
					}).then(token => {
						var formData = new FormData();
						var fileName = files[0].name.split('.');
						var key = 'TB_photo_' + that.$md5(fileName[0] + Math.floor(Math.random() * (9999 - 1000)) + 1000) + '.' + fileName.pop();
						formData.append('file',files[0])
						formData.append('token',token)
						formData.append('key',key)
						uploadImg(formData).then(res=> {
							insert('http://scrm-image-qn.shifuhui.net/' + res.key) 
						})
					})
				
				    // 上传代码返回结果之后，将图片插入到编辑器中
				}
			};
			editor.create();
			if (this.content) {
				editor.txt.html(`<p>${this.content}</p>`);
			}
		},
		
		handleBeforeUpload(file) {
			var fileName = file.name.split('.');
			var suiji = Math.floor(Math.random() * (9999 - 1000)) + 1000;
			console.log('MD5文件名：' + fileName[0]);
			console.log('MD5随机数：' + suiji);
			return qiniuToken({
				type: 2  //1图片 2视频 
			}).then(data => {
				this.uploadData.token = data.data;
				this.uploadData.key = 'TB_' + this.$md5(fileName[0] + suiji) + '.' + fileName.pop();
				this.uploadLoading = true;
			});
		},
		onFileProgress(event, file, fileList) {
			this.fileList = fileList
			var self = this
			var uploadTime = (event.timeStamp / 1000).toFixed(2);
			var uploadSize = (event.loaded / 1024).toFixed(2);
			var speed = (uploadSize / uploadTime).toFixed(2);
			var progress = Number.parseInt((event.loaded / event.total).toFixed(2) * 100);
			self.progressNum = progress;
			if (speed > 1000) {
				speed = (speed / 1000).toFixed(2) + 'MB/s';
			} else {
				speed = speed + 'KB/s';
			}
			this.uploadSpeed = speed;
		},
		handleSuccessUpload(response, file, fileList) {
			if(fileList.length>1){
				fileList.shift()
			}
			let that = this;
			if (response.hash && response.key) {
				var videoLink =  'http://scrm-video-qn.shifuhui.net/' + response.key;
				var video = '<video src='+videoLink + 'controls="controls" width="100%"></video>'
				
				editor.txt.append(`<p><video src=${videoLink} controls="controls" style='width:100%;height:400px'></video><br></p>`);
				that.$emit('on-change', editor.txt.html());
				this.$message.success(this.$t('material.upload_success'));
				this.uploadLoading = false;
			} else {
				this.$message.error(response.message);
				this.uploadLoading = false;
			}
		},
		setCurrentValue(value) {
			if (value === this.currentValue) return;
			editor.txt.html(`<p>${value}</p>`);
		}
	},
	mounted() {
		this.createEditor();
	},
	watch: {
		content(val) {
			this.setCurrentValue(val);
		}
	}
};
</script>
<style>
.header{
	position: relative;
}
.upload-demo{
	position: absolute;
	right: 20px;
	top: 10px;
}
.w-e-text-container {
	height: 300px !important;
}
.w-e-toolbar {
	background: transparent !important;
	padding: 10px;
}
.editor {
	border: 1px #ccc solid;
}

#div2 {
	min-height: 500px;
}

</style>
