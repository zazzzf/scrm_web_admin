<template>
    <div class="el-upload">
        <el-upload
            :action="$config.QINIU_BASE_URL"
            :accept="accept"
            :data="uploadData"
			:max-size="512000"
            :file-list="fileList"
            :disabled='fileList.length >= limit'
            v-loading="uploadLoading"
            :element-loading-text="uploadProgress + '%'"
            :before-upload="handleBeforeUpload"
            :on-progress="onFileProgress"
            :on-success="handleSuccessUpload"
            :show-file-list="true"
            drag
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">{{uploadTip}}</div>
        </el-upload>
    </div>
</template>
<script>
import { qiniuToken } from '@/api/token';

export default {
    name:"costom-upload",
    /**
     * limit：最大允许上传个数， 默认1
     * accept: 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
     * uploadType: 必传；  上传到的七牛地址 后台根据这个来计算token
     * qiniuVideoBaseUrl: 必传  上传的七牛云空间地址  根据这个bi拼接七牛返回的key得到完整地址
     * qiniuNamePrefix: 自定义七牛文件名前缀，  文件名生成方式为 前缀 + MD5 + 文件类型；
     * uploadTip 上传提示消息  默认“只能上传jpg/png文件，且不超过500kb”  请根据传入accept自行填入
     */
    props:{
        uploadTip:{
            type: String,
            default: ()=> "只能上传jpg/png文件，且不超过500kb"
        },
        accept:{
            type: String,
            default: ()=> "",    //     video/*,.mp4
        },
        limit:{
            type: Number,
            default: 1
        },
        qiniuNamePrefix:{
            type: String,
            default: ()=> "",    //     video/*,.mp4
        },
        uploadType:{
            type: Number,
            default: ()=>1
        },
        qiniuVideoBaseUrl:{
            type: String,
            default: ()=> "",    //     video/*,.mp4
        },
        propFileList: {
            type: Array,
            default: ()=> [],
        }
    },
    data(){
        return{
            uploadLoading: false,
            uploadSpeed:'0KB/s',
            uploadData:{},
            fileList:[],
            uploadProgress:0,
        }
    },
    methods:{
        handleBeforeUpload(file) {
			var fileName = file.name.split('.');
			var suiji = Math.floor(Math.random() * (9999 - 1000)) + 1000;
			// console.log('MD5文件名：' + fileName[0]);
			// console.log('MD5随机数：' + suiji);
			return qiniuToken({
				type: this.uploadType  //1图片 2视频 
			}).then(data => {
				this.uploadData.token = data.data;
				this.uploadData.key = this.qiniuNamePrefix + this.$md5(fileName[0] + suiji) + '.' + fileName.pop();
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
			if (speed > 1000) {
				speed = (speed / 1000).toFixed(2) + 'MB/s';
			} else {
				speed = speed + 'KB/s';
            }
            this.uploadProgress = progress;
			this.uploadSpeed = speed;
		},
		handleSuccessUpload(response, file, fileList) {
            let that = this;
			that.$emit('on-end', response);
			if (response.hash && response.key) {
				var fileQiniuLink =  this.qiniuVideoBaseUrl +response.key;
				that.$emit('on-upSuccess', fileQiniuLink);
				this.$message.success(this.$t('material.upload_success'));
				this.uploadLoading = false;
			} else {
                this.$message.error(response.message);
			    this.$emit('on-error', response.message);
				this.uploadLoading = false;
			}
        },
        resetFields(){
            this.fileList = [];
            this.uploadLoading = false;
            this.uploadProgress = 0;
            this.$emit('on-upSuccess','');
        }
    }
}
</script>
