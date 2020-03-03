<style>
	.annotationLayer{
		transform:none !important;
	}
</style>
<template>
	<div class="pdf-box" >
		<el-progress :percentage="progress" v-if="progress<100"></el-progress>
		<pdf :src="src" v-for="i in numpages" :page="i" :key='i'
		@num-pages="getPage(i,$event)" 
		@page-loaded="currentPage = $event"
		@progress="getProgress(i,$event)"
		@error='getError($event)'
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
	 loadmore(){
		if((this.pageCount- this.numpages) > 5){
			this.numpages+=5;
		}else{
			this.numpages+= (this.pageCount- this.numpages);
			this.hasMore = false;
		}
	 },
	 getProgress(i ,e){
		 if(i == 1){
			 this.progress = parseInt(e.toFixed(2) * 100);
		 }
	 },
	 getPage(i,pageCount){
		 if(this.isLoadover == true){
			 return false;
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
	 },
	 getError(error){
		if(error)this.$notify({ title: 'Error',  message: "加载PDF文件失败,请重试", type: 'error'});
	 },
  },
  created() {
	  this.clearData();
  }
}
</script>