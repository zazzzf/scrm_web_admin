<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
		  {
		    timestamp: '2019/8/20',
		    title: '修改密码',
		    content: '修改密码'
		  },
		  {
		    timestamp: '2019/7/21',
		    title: '修改密码',
		    content: '阿斯顿发斯蒂芬阿斯蒂芬阿萨德发顺丰阿斯蒂芬阿斯蒂芬  2019/4/21 20:46'
		  },
        {
          timestamp: '2019/4/20',
          title: '修改密码',
          content: '大师傅阿斯蒂芬阿斯蒂芬阿斯蒂芬打算发送到阿萨德发送到打算打算发送到阿斯蒂芬阿萨德阿斯蒂芬收到  2019/4/20 20:46'
        },
        {
          timestamp: '2019/4/21',
          title: '修改密码',
          content: 'PanJiaChen committed 2019/4/21 20:46'
        },
        {
          timestamp: '2019/4/22',
          title: 'Build Template',
          content: 'PanJiaChen committed 2019/4/22 20:46'
        },
        {
          timestamp: '2019/4/23',
          title: 'Release New Version',
          content: 'PanJiaChen committed 2019/4/23 20:46'
        }
      ]
    }
  }
}
</script>
