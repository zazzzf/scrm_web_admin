<template>
<div>
    <el-upload
        ref="upload"
        action="http://up-z1.qiniup.com"
        :accept="accept"
        :data="uploadData"
        :limit="limit"
        list-type="picture-card"
        :before-upload="handleBeforeUpload"
        :file-list="defaultList"
        :on-success="handleSuccessUpload"
        :on-error="handleError"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
    >
        <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
    
    
</template>
<script>
import {qiniuToken} from '@/api/token.js'

export default {
    props:{
        limit:{
            type:Number,
            default:1
        },
        fileList:{
            type:Array,
            default: ()=>{return []},
        },
        type:{
            type:Number,
            default: null
        },
        qnlink:"",
        prefix:"",
        md5:{
            type: Boolean,
            default:true
        },
        accept:"",
    },
    data(){
        return{
            defaultList:[],
            uploadData:{},
            uploadLoading:false,
             dialogImageUrl: '',
        dialogVisible: false
        }
    },
    methods:{
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            console.log(file)
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleBeforeUpload(file) {
			var fileName = file.name.split('.');
            var suiji = Math.floor(Math.random() * (9999 - 1000)) + 1000;
            //获取七牛token  具体看项目本身上传逻辑
			return qiniuToken({
				type: this.type  //1图片 2视频 3
			}).then(data => {
                this.uploadData.token = data.data;
                this.uploadData.key =this.md5? this.prefix + this.$md5(fileName[0] + suiji) + '.' + fileName.pop(): this.prefix + fileName[0] + suiji + '.' + fileName.pop();
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
		},
		handleSuccessUpload(response, file, fileList) {
            // 上传成功后执行的操作
            this.defaultList = fileList
            var videoLink = this.qnlink + '/' + response.key
            console.log('2222')
            this.$emit('on-success', videoLink);
        },
        handleError(err){
            this.defaultList = []
        },
    },
    created(){
        setTimeout(()=> {
            this.defaultList = this.fileList
        },50)
    }
    
}
</script>