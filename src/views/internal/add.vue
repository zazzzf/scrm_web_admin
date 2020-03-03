<template>
    <div>
        <el-card>
            <span slot="header">
				<el-page-header :title="$t('back')" @back="cancelAdd" content="添加报告"></el-page-header>
			</span>
            <div>
                <el-form  :rules='lgRules' ref="ruleForm" style="padding:20px 50px" :model="formData" label-width="200px">
                    <el-form-item label="报告名称" prop="reportName">
                        <el-input v-model="formData.reportName"></el-input>
                    </el-form-item>
                    <el-form-item label="报告文件" prop="reportFileName">
                        <custom-upload
                            ref="pdfUpload"
                            accept=".pdf"
                            qiniuNamePrefix ="NB_"
                            :qiniuVideoBaseUrl="''"
                            :uploadType="5"
                            :uploadTip="'只能上传PDF文件'"
                            @on-upSuccess="uploadSuccess"
                        ></custom-upload>
                        <div>
                            <el-link type="primary" target="_blank" v-if="formData.reportFileName" :href="$config.QINIU_URL_TYPE_REPORT + formData.reportFileName">查看</el-link>
                            <el-link type="info" 
                            v-if="formData.reportFileName" 
                            style="margin-left:50px" 
                            @click="resetUpload"
                            >重新上传</el-link>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="confirm">提交</el-button>
                        <el-button @click="cancelAdd">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>

import customUpload from '@/components/custom-upload'
import {addInternal} from '@/api/internal'

export default {
    components:{customUpload},
    data(){
        return{
            formData:{
                reportName:"",
                reportFileName:"",
            },
            lgRules:{
                reportName: [{required: true,  message: '请填入报告名', trigger: 'change' }],
                reportFileName: [{required: true,  message: '请上传报告', trigger: 'change' }],
            }
        }
    },
    methods:{
        cancelAdd(){
            this.$refs["ruleForm"].resetFields();
            this.$router.push('/internal/internal')
        },
        confirm(){
            this.$refs["ruleForm"].validate( valid => {
                if(valid){
                    let postData = {
                        reportName: this.formData.reportName,
                        reportFileName: this.formData.reportFileName,
                    }
                    addInternal(postData).then(res => {
                        this.$message.success('添加成功')
                        this.cancelAdd();
                    })
                }
            })
        },
        resetUpload(){
            this.$refs["pdfUpload"].resetFields();
        },
        uploadSuccess(val){
            this.formData.reportFileName = val
        }
    }
}
</script>