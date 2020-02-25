<template>
  <el-card>
    <div slot="header">
      <span>分类管理</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="其他分类" name="other">
        <other></other>
      </el-tab-pane>
      <el-tab-pane label="内容分类" name="content">
        <content-manage></content-manage>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
  import other from './components/other'
  import contentManage from './components/content'
  export default {
    components:{other,contentManage},
    data(){
      return{
        activeName: 'other',
      }
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>
