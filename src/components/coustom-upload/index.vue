<template>
    <el-upload
    ref="upload"
        :action="action"
        :accept="accept"
        :data="uploadData"
        :limit="limit"
        drag
        :multiple="multiple"
        :show-file-list="true"
        :before-upload="handleBeforeUpload"
        :on-progress="onFileProgress"
        :file-list="defaultList"
        :on-success="handleSuccessUpload"
        :on-error="handleError"
        :on-remove="handleRemove"
    >
         <i class="el-icon-upload" ></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip" v-if="tips">{{tips}}</div>

    </el-upload>

</template>
<script>
import {qiniuToken} from '@/api/token.js'

export default {
    props:{
        action: {
          type: String,
          default: () => {return "http://up-z1.qiniup.com"},
        },
        upSize:{
          type:Number,
          default:300,
        },
        multiple: false,
        tips:"",
        fileList:{
            type:Array,
            default: ()=>{return []},
        },
        limit:{
          type:Number,
          default: 1,
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
        }
    },
    methods:{
      handleRemove(file, fileList){
        if(fileList.length === 0){
          this.$emit('on-success', '')
        }
      },
        handleBeforeUpload(file) {
			      var fileName = file.name.split('.');
            var suiji = Math.floor(Math.random() * (9999 - 1000)) + 1000;

            const isLtSize = file.size / 1024 / 1024 < this.upSize;
            if(isLtSize){
              //获取七牛token  具体看项目本身上传逻辑
              return qiniuToken({
                type: this.type  //1图片 2视频 3
              }).then(data => {
                this.uploadData.token = data.data;
                this.uploadData.key =this.md5? this.prefix + this.$md5(fileName[0] + suiji) + '.' + fileName.pop(): this.prefix + fileName[0] + suiji + '.' + fileName.pop();
                this.uploadLoading = true;
                this.$emit('on-upload', this.uploadLoading)
              });
            }else{
              this.$message.error('上传大小不能超过'+ this.upSize +'MB!');
              return false
            }

		},
		onFileProgress(event, file, fileList) {
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
        this.uploadLoading = false;
        this.$emit('on-upload', this.uploadLoading)

            if(this.limit == 1){
              if(this.qnlink ==="" || this.qnlink!== undefined){
                var videoLink = this.qnlink + '/' + response.key
              }else{
                var videoLink = response.key
              }
              this.$emit('on-success', videoLink);
            }else{
              this.$emit('on-success', fileList);
            }
        },
        handleError(err){
            this.defaultList = []
        },

    },

    created(){
      setTimeout(() => {
        this.defaultList = this.fileList
      },50)
    },


}
</script>
<style scoped>
  .el-upload__text{
    font-size: 12px !important;
  }
</style>
