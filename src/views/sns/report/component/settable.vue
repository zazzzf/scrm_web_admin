<template>
    <div>
        <el-alert
            :title="tableTitle"
            :type="titleType"
            :closable="false"
            description="点击列表左边箭头编辑内容，编辑后需点击页面最下方保存方可设置完成报告"
            effect="dark">
        </el-alert>
            <el-table :data="tableData" :show-header="false"  row-key="daily_assistant_id" :expand-row-keys="expandStatus">
                <el-table-column   type="expand" >
                    <template  slot-scope="s">
                        <el-form  label-position="left" :model="s.row" :ref="formRefName + s.$index" :rules="tableRules">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="s.row.title" type="textarea" style="width:80%"></el-input>
                            </el-form-item>
                            <el-form-item label="头像" prop="author_img">
                                <image-upload 
                                :limit='1' 
                                :accept="'image/*'"
                                :uploadType="1" 
                                :qiniuBaseUrl="$config.QINIU_URL_TYPE_IMG" 
                                :qiniuNamePrefix="'SET_BG_'" 
                                :isAppendDialog="true" 
                                :propFileList="s.row.author_img?[{url:s.row.author_img}]:[]" 
                                @on-upSuccess="(val)=>{s.row.author_img = val}"></image-upload>
                            </el-form-item>
                            <el-form-item label="播主" prop="author">
                                <el-input v-model="s.row.author"  style="width:80%"></el-input>
                            </el-form-item>
                            <el-form-item label="粉丝数" prop="author_fans">
                                <el-input v-model="s.row.author_fans"  style="width:80%"></el-input>
                            </el-form-item>
                            <el-form-item label="点赞数" prop="like_num">
                                <el-input v-model="s.row.like_num"  style="width:80%"></el-input>
                            </el-form-item>
                            <el-form-item label="评论数" prop="comment_num">
                                <el-input v-model="s.row.comment_num"  style="width:80%"></el-input>
                            </el-form-item>
                            <el-form-item :label="type==1?'转发数':'浏览数'" prop="share_num">
                                <el-input v-model="s.row.share_num"  style="width:80%"></el-input>
                            </el-form-item>
                            <el-form-item label="分析" prop="analyze">
                                <el-input v-model="s.row.analyze"  style="width:80%" :maxlength="50"></el-input>
                            </el-form-item>
                            <el-form-item label="链接" prop="link">
                                <el-input v-model="s.row.link"  style="width:80%"></el-input>
                            </el-form-item>
                            <el-form-item label="封面">
                                    <image-upload 
                                    :limit='1' 
                                    :accept="'image/*'"
                                    :uploadType="1" 
                                    :qiniuBaseUrl="$config.QINIU_URL_TYPE_IMG" 
                                    :qiniuNamePrefix="'SET_FM_'" 
                                    :isAppendDialog="true" 
                                    :propFileList="s.row.img?[{url:s.row.img}]:[]" 
                                    @on-upSuccess="(val)=>{s.row.img = val}"></image-upload>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="title" :label="tableTitle" min-width="150px"></el-table-column>
                <el-table-column prop="author_img">
                    <template slot-scope="s">
                        <el-avatar :src='s.row.author_img' />
                    </template>
                </el-table-column>
                <el-table-column prop="author"></el-table-column>
                <el-table-column prop="like_num"></el-table-column>
                <el-table-column prop="comment_num"></el-table-column>
                <el-table-column prop="share_num"></el-table-column>
                <el-table-column prop="analyze"></el-table-column>
                <el-table-column prop="link" ></el-table-column>
            </el-table>
        </div>
</template>
<script>
import imageUpload from '@/components/image-upload'
import { reject } from 'q'
// import { StringExchangeEmoji } from '@/utils/util'

export default {
    components:{
        imageUpload
    },
    props:{
        tableData:{},
        tableTitle:"",
        titleType: {
            type: String,
            default: () => 'success',
        },
        tableFormRef:{
            type: String,
            default: () => '',
        },
        type:{
            type: Number,
            default: () => 1,  // 1抖音 2快手
        }
    },
    data(){
        return{
            formRefName:'',
            tableRules:{
                title: [{ required: true, message: '请输入标题', trigger: 'change' }],
                author_img: [{ required: true, message: '请上传头像', trigger: 'change' }],
                author: [{ required: true, message: '请输入播主名', trigger: 'change' }],
                author_fans: [{ required: true, message: '请输入粉丝数', trigger: 'change' }],
                like_num: [{ required: true, message: '请输入点赞数', trigger: 'change' }],
                comment_num: [{ required: true, message: '请输入评论数', trigger: 'change' }],
                share_num: [{ required: true, message: `请输入${this.type==1?'分享':'浏览'}数`, trigger: 'change' }],
                analyze: [{ required: true, message: '请输入分析', trigger: 'change' }],
                link: [{ required: true, message: '请输入链接', trigger: 'change' }],
            },
            expandStatus: [],
        }
    },
    methods:{
        validForm(){
            let _this = this
            this.tableData.map(item => {
                this.expandStatus.push(item.daily_assistant_id)
            })
            return new Promise( (resolve,reject) => {
                setTimeout(function(){
                    var valid_step = 0;
                    _this.$refs[_this.formRefName + '0'].validate( valid => {
                        if(valid)valid_step++
                    })
                    _this.$refs[_this.formRefName + '1'].validate( valid => {
                        if(valid)valid_step++
                    })
                    _this.$refs[_this.formRefName + '2'].validate( valid => {
                        if(valid)valid_step++
                    })
                    if(valid_step < 3){
                        _this.$message.error(`${_this.tableTitle}数据不完整`)
                        reject(`${_this.tableTitle}数据不完整`)
                    }else{
                        _this.expandStatus = []
                        resolve(true)
                    }
                },10)
            })

        },
        
    },
    created(){
        this.formRefName = this.tableFormRef
    }
}
</script>
