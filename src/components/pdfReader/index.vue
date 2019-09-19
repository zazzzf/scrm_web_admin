<template>
    <!-- numPages: 要加载的页数； -->
  <div :numPages='numPages'>
    <pdfvuer :src="pdfUrl" :scale.sync="scale"  v-for="i in numPages" :key="i" :id="i" :page="i">
      <template slot="loading" v-if="allPages>0">
        <p style="text-align:center; color:#bbb">正在加载第{{i}} / {{allPages}}页...</p>
      </template>
    </pdfvuer>
  </div>
</template>
<script>
  import pdfvuer from 'pdfvuer'
  export default {
    name: "pdfReader",
    components: {
      pdfvuer
    },
    props: {
      pdfUrl: {
          type: String,
          default:'',
      },
    numPages:Number,
    },
    data() {
      return {
        scale: 'page-width',
        loading: false,
        allPages:0,
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          lineHeight: '45px', // 请保持与高度一致以垂直居中
          background: '#e7eaf1' // 按钮的背景颜色
        }
      }
    },
    methods: {
      getPdf(url) {
          if(!url){
              return
          }
		  
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        var self = this;
        self.pdfdata = pdfvuer.createLoadingTask(url);
        self.pdfdata.then(pdf => {
          loading.close();
          self.allPages =  pdf.numPages
          self.childClick();
        })
      },
      //向父组件传递总页数
      childClick(){
          this.$emit('allpages',this.allPages)
        }
    },
    mounted() {
      this.getPdf(this.pdfUrl)
    },
    watch: {
        numPages(val){
            if(val >= this.allPages){
                this.numPages = this.allPages;
                // this.childClick();
            }
        }
    }

  }

</script>
