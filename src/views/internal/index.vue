<template>
  <el-card>

    <div slot="header">
      <span>内部报告</span>
      <el-button type="text" style="float: right;padding: 3px 0" @click="showDialog = true">
        添加报告
      </el-button>
    </div>
    <div class="search-box">
      <el-form ref="searchForm" :model="searchData" inline="">
        <el-form-item prop="title">
          <el-input v-model="searchData.title" style="width: 300px;" :placeholder="$t('search.title')"></el-input>
        </el-form-item>
        <el-form-item prop="category">
          <el-select clearable v-model="searchData.category" collapse-tags placeholder="分类筛选">
            <el-option v-for="item in categoryList" :key="item.category_id" :label="item.name"
              :value="item.category_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tag">
          <el-select clearable v-model="searchData.tag" multiple :placeholder="$t('search.tag')">
            <el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='handleSearch'>{{$t('table.search')}}</el-button>
          <el-button type="text" @click='resetSearch'>{{$t('search.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="min-height: 700px;">
      <el-table :data="caseList">
        <el-table-column label="报告名" prop="report_name"></el-table-column>
        <el-table-column :label="$t('home.creat_time')" prop="date_added"></el-table-column>
        <el-table-column :label="$t('operation')" min-width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="info" @click='readSns(scope.row)' round>{{$t('search.read')}}</el-button>
            <!--						<el-button size="mini" round type="primary" @click='editSns(scope.row)'>{{$t('edit')}}</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination background v-if='pageData.count>10' layout="prev, pager, next" :total="pageData.count"
      @current-change='pageChange'>
    </el-pagination>

    <el-dialog :visible.sync="showDialog">
      <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="报告文件" prop="reportFileName">
          <Upload ref="pdfUpload" accept=".pdf" qiniuNamePrefix="NB_" :qiniuVideoBaseUrl="''" :uploadType="5"
            :uploadTip="'只能上传PDF文件'" @on-upSuccess="getLink">
          </Upload>
        </el-form-item>
        <el-form-item label="报告名称" prop="reportName">
          <el-input v-model="formData.reportName"></el-input>
        </el-form-item>
        <el-form-item label="报告分类" prop="categoryId">
          <el-select clearable v-model="formData.categoryId" collapse-tags placeholder="分类筛选">
            <el-option v-for="item in categoryList" :key="item.category_id" :label="item.name"
              :value="item.category_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <vue-tags-input v-model="formData.tag" :tags="formData.tags" placeholder="添加标签"
            @tags-changed="newTags => formData.tags = newTags" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import reportApi from '@/api/report.js'
  import Upload from '@/components/custom-upload'
  import VueTagsInput from '@johmun/vue-tags-input';
  export default {
    components: {
      Upload,
      VueTagsInput
    },
    data() {
      return {
        showDialog: false,
        formData: {
          reportName: "",
          reportFileName: "",
          categoryId: "",
          // tag:[],
          tag: '',
          tags: [],
        },
        rules: {
          reportFileName: [{
            required: true,
            message: '请上传报告',
            trigger: 'change'
          }],
          reportName: [{
            required: true,
            message: '请填入报告名',
            trigger: 'change'
          }],
          categoryId: [{
            required: true,
            message: '请选择分类',
            trigger: 'change',
            type: "number"
          }],
          tags: [{
            required: true,
            message: '请输入标签',
            trigger: 'change'
          }],
        },
        caseList: [],
        readSnsShow: false,
        readSnsData: {},
        nocheckedreason: "",
        doWhat: '',
        pageData: {
          page: 1,
          count: null,
        },
        searchData: {
          title: '',
          tag: [],
          status: '',
          category: "",
        }
      }
    },
    computed: {

      categoryList() {
        return this.$store.getters.categoryList
      },
      tagsList() {
        return this.$store.getters.tagList
      }
    },
    methods: {
      getLink(e) {
        this.formData.reportFileName = e
      },
      submit() {
        let postData = {
          reportName: this.formData.reportName,
          reportFileName: this.formData.reportFileName,
          categoryId: this.formData.categoryId
        };
        if (this.formData.tags.length > 0) {
          var tags = '';
          this.formData.tags.forEach(item => {
            tags = tags.concat(`${item.text},`)
          })
          postData.tag = tags.substr(0, tags.length - 1);
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            reportApi.add(postData).then(res => {
              this.$message.success('提交成功')
              this.$refs.form.resetFields()
              this.showDialog = false
              this.getList()
            })
          }
        })

      },
      cancel() {
        this.$refs.form.resetFields();
        this.formData.reportFileName = ''
        this.showDialog = false
      },
      getList() {
        let postData = {
          page: this.pageData.page,
          pageSize: 10,
          keywords: this.searchData.title,
        };
        if (this.searchData.tag.length > 0) {
          var tags = '';
          this.searchData.tag.forEach(item => {
            tags = tags.concat(`${item},`)
          })
          postData.tag = tags.substr(0, tags.length - 1);
        }
        if (this.searchData.category) postData.categoryId = this.searchData.category
        reportApi.lists(postData).then(res => {
          this.caseList = res.data.list
          this.pageData.count = res.data.count;
        })
      },
      editSns(data) {
        if (data) {
          this.formData.reportName = data.report_name
          this.formData.reportFileName = data.report_file_name
          this.formData.categoryId = data.category_id
          this.formData.internal_report_id = data.internal_report_id

          data.tag.forEach(item => {
            this.formData.tags.push({
              text: item.name,
            })
          })
          this.showDialog = true
        }
      },

      checkedSnsStatus(status) {
        if (status) {
          let postData = {
            id: this.readSnsData.inspiration_id,
            status
          };
          if (status == -1 && !this.nocheckedreason) {
            this.$message.warning('请输入审核不通过原因');
            return
          }
          if (status == -1 && this.nocheckedreason) {
            postData.reason = this.nocheckedreason
          }
          reportApi.checkTikTok(postData).then(res => {
            this.$message.success('审核完成');
            this.readSnsShow = false;
            this.getList();
          })
        } else {
          this.readSnsShow = false;
        }
      },
      deleteSns(inspirationId) {
        this.$confirm('此操作将永久删除该案例, 是否继续?', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reportApi.delTikTok({
            inspirationId
          }).then(res => {
            this.$message.success('删除成功');
            this.getList();
          })
        }).catch(() => {

        });

      },
      readSns(data) {
        window.open(data.report_file_name)
        // this.readSnsData = data;
        // this.readSnsShow = true;
      },
      pageChange(page) {
        this.pageData.page = page;
        this.getList();
      },
      handleSearch() {
        this.pageData.page = 1;
        this.getList();
      },
      resetSearch() {
        this.pageData.page = 1;
        this.$refs.searchForm.resetFields();
        this.getList();
      }
    },
    created() {
      this.getList()
    }
  }

</script>

<style lang="less" scoped>
  video:focus {
    outline: none;
  }

  .video-number {
    margin-bottom: 20px;
    border-top: 1px solid #BFCBD9;
    border-bottom: 1px solid #BFCBD9;

    p {
      text-align: center;
    }
  }

</style>
