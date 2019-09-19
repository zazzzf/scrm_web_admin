<template>
	<div>
		<el-button @click="show = !show">查看PDF</el-button>
		<el-dialog :visible="show" top="5vh" width="50%">
			<pdf :src="url"></pdf>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="show = false">取 消</el-button>
			    <el-button type="primary" @click="show = false">确 定</el-button>
			  </span>
		</el-dialog>
	</div>
</template>

<script>
import pdf from '@/components/pdf/index.vue';

export default {
	components: {
		pdf
	},
	props: {
		src: String
	},
	data() {
		return {
			url:'http://scrm-report-qn.xaxhl.net/2019%E4%B8%8A%E5%8D%8A%E5%B9%B4%E4%B8%AD%E5%9B%BD%E5%A4%96%E5%8D%96%E8%A1%8C%E4%B8%9A%E5%8F%91%E5%B1%95%E5%88%86%E6%9E%90%E6%8A%A5%E5%91%8A.pdf',
			show: false
		};
	},
	methods: {}
};
</script>
