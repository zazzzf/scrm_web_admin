<style>
	.annotationLayer{
		transform:none !important;
	}
</style>
<template>
	<div class="pdf-box" v-loading="!isLoadover">
		<pdf :src="src" v-for="i in numpages" :page="i" :key='i'
		@num-pages="getPage" 
		@page-loaded="currentPage = $event"
		style="width:100%"
		></pdf>
		<div style="text-align: center; z-index: 2; margin-top: 40px;">
			<el-button v-if="hasMore" @click='loadmore' type="text">加载更多</el-button>
		</div>
	</div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  props:{
	src: String,
  },
  
  data(){
	  return{
		  pageCount: 0,
		  currentPage: 0,
		  progress: 0,
		  numpages:1,
		  isLoadover:false,
		  hasMore:true,
	  }
  },
  methods:{
	  format(percentage) {
		  return this.numpages + '/' + this.pageCount +  '页';
		},
	 loadmore(){
		if((this.pageCount- this.numpages) > 5){
			this.numpages+=5;
		}else{
			this.numpages+= (this.pageCount- this.numpages);
			this.hasMore = false;
		}
	 },
	 getPage(pageCount){
		 if(this.isLoadover){
			 return
		}else if(pageCount>0){
			 this.pageCount = pageCount;
			 this.isLoadover = true;
			 this.loadmore();
		 }
	 },
	 clearData(){
		 this.pageCount = 0;
		  this. currentPage= 0;
		   this.progress= 0;
		   this.numpages=1;
		   this.isLoadover=false;
		   this.hasMore=true;
	 }
  },
  created() {
	  this.clearData();
  }
}
</script>