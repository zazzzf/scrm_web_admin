<template>
    <div class="el-upload">
        <el-upload
            ref="uploadbox"
            :action="$config.QINIU_BASE_URL"
            :accept="accept"
            :data="uploadData"
            :class="{hide:hideUpload}"
            :limit="limit"
			:max-size="5120"
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="handleBeforeUpload"
            :on-progress="onFileProgress"
            :on-success="handleSuccessUpload"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :append-to-body='isAppendDialog'>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import { qiniuToken } from '@/api/token';

export default {
    name:"image-upload",
    /**
     * @param limit：最大允许上传个数， 默认1
     * @param accept: 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
     * @param uploadType: 必传；  上传到的七牛地址 后台根据这个来计算token
     * @param qiniuBaseUrl: 必传  上传的七牛云空间地址  根据这个bi拼接七牛返回的key得到完整地址
     * @param qiniuNamePrefix: 自定义七牛文件名前缀，  文件名生成方式为 前缀 + MD5 + 文件类型；
     * @param isAppendDialog 是否为dialog嵌套使用
     */
    props:{
        isAppendDialog:{
            type:Boolean,
            default: ()=> false,
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
        qiniuBaseUrl:{
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
            hideUpload:false,
            dialogVisible:false,
            dialogImageUrl: '',
        }
    },
    methods:{
        handleBeforeUpload(file) {
			return qiniuToken({
                type: this.uploadType,  //1图片 2视频 
			}).then(data => {
                this.uploadData.token = data.data;
                var fileName = file.name.split('.');
			    var suiji = Math.floor(Math.random() * (9999 - 1000)) + 1000;
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
				var fileQiniuLink =  this.qiniuBaseUrl + response.key;
				that.$emit('on-upSuccess', fileQiniuLink);
				this.$message.success(this.$t('material.upload_success'));
				this.uploadLoading = false;
			} else {
                this.$message.error(response.message);
			    this.$emit('on-error', response.message);
				this.uploadLoading = false;
            }
        },
        handleRemove(file, fileList){
            this.hideUpload = fileList.length >= this.limit;
            this.$emit('on-upSuccess', '');
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        /**主动设置激活 list刷新 @param val => Array */
        setFileList(val){
            this.fileList = val
        }
        
    },
    watch:{
        fileList(val){
            this.hideUpload = (val.length >= this.limit)
        },
        // propFileList(val){
        //     this.fileList = val
        // }
    },
    mounted(){
        setTimeout(()=>{
            if(this.propFileList){
                this.fileList = this.propFileList
            }
        },100)
    },
    
}
</script>
<style>
    .hide .el-upload--picture-card {
        display: none !important;
    }
</style>
