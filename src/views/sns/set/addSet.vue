<template>
  <el-card>
    <span slot="header">
        <el-page-header :title="$t('back')" @back="cancelSubimt"
          :content="jhFormData.id?'修改集合':'添加集合'"></el-page-header>
      </span>
    <div>
      <el-form label-position="top" ref="tableForm" :model="jhFormData" :rules="rules">
        <el-form-item label="选择分类" prop="categoryId">
          <el-select v-model="jhFormData.categoryId">
            <el-option v-for="item in category_list" :label="item.name" :value="item.category_id" :key="item.category_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入集合名称" prop="title">
          <el-input v-model="jhFormData.title" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="集合封面" prop="img">
          <image-upload :limit='1' :accept="'image/*'" :uploadType="1" :qiniuBaseUrl="$config.QINIU_URL_TYPE_IMG" :qiniuNamePrefix="'SET_BG_'" :isAppendDialog="true" :propFileList="fileList" @on-upSuccess="getImgLinks"></image-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancelSubimt">取消</el-button>
        </span>
    </div>
  </el-card>
</template>
<script>
  import imageUpload from '@/components/image-upload'
  import { GET_SETLIST, CHANGE_SET_STATUS, THE_SET_EDIT, THE_SET_ADD} from '@/api/sns'
  export default {
    components: {
      imageUpload
    },
    data() {
      return {
        jhFormData: {
          categoryId: null,
          title: "",
          img: "",
        },
        rules: {
          title: [{
            required: true,
            message: '请填入标题',
            trigger: 'change'
          }],
          categoryId: [{
            required: true,
            message: '请选择分类',
            trigger: 'change'
          }],
          img: [{
            required: true,
            message: '请上传封面',
            trigger: 'blur'
          }],
        },
        fileList: []
      }
    },
    computed:{
      category_list(){
        return this.$store.getters.categoryList
      }
    },
    methods: {
      getImgLinks(link) {
        this.jhFormData.img = link;
      },
      submitForm() {
        this.$refs['tableForm'].validate(valid => {
          if (valid) {
            let postData = {
              categoryId: this.jhFormData.categoryId,
              img: this.jhFormData.img,
              title: this.jhFormData.title
            }
            if (!this.jhFormData.id) {
              THE_SET_ADD(postData).then(res => {
                this.$message.success('添加成功')
                this.$router.push('/sns/sns-set')
              })
            } else {
              postData.id = this.jhFormData.id
              THE_SET_EDIT(postData).then(res => {
                this.$message.success('修改成功')
                this.$router.push('/sns/sns-set')
              })
            }
          }
        })
      },
      editSet(data) {
        if (!data) return
        this.jhFormData = {
          categoryId:data.category_id,
          id:data.id,
          title:data.title,
          img:data.img,
        }
        
        this.fileList[0] = {name: '已上传的封面',  url: data.img }
      },
      cancelSubimt() {
        this.$refs['tableForm'].resetFields();
        this.$router.push('/sns/sns-set')
      },
    },
    mounted() {
      this.editSet(this.$route.params.data)
    }
  }
</script>
