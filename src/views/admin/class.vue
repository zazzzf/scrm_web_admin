<template>
	<el-card>
		<div slot="header">
			<span>分类管理</span>
		</div>
		<div style="min-height: 500px;">
			<el-tag style="cursor: pointer; margin:5px" @click='editThisTag(tag)' type="success"
			:key="tag.tag_id" v-for="tag in classList" closable :disable-transitions="false" @close="handleDel(tag.category_id)">{{ tag.name }}</el-tag>
			<el-input
				placeholder="回车确认"
				class="input-new-tag"
				v-if="inputVisible"
				v-model="inputValue"
				ref="saveTagInput"
				size="small"
				@keyup.enter.native="handleInputConfirm"
				@blur="handleInputConfirm"
			></el-input>
			<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加分类</el-button>
		</div>
	</el-card>
</template>

<script>
import { categoryList,addcategory,editcategory,delcategory } from '@/api/admin.js';
export default {
	data() {
		return {
			classList: [],
			inputVisible: false,
			inputValue: ''
		};
	},
	methods: {
		getTagList() {
			categoryList().then(res => {
				this.classList = res.data;
			});
		},
		handleDel(categoryId) {
			this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
			  confirmButtonText: '确认删除',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
			  delcategory({ categoryId }).then(res => {
			  	this.$message.success('删除成功');
			  	this.getTagList();
			  });
			}).catch(() => {
			           
			});
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				addcategory({name:this.inputValue}).then(res => {
					this.$message.success('添加成功');
					this.inputVisible = false;
					this.inputValue = '';
					this.getTagList();
				})
			}else{
				this.inputVisible = false;
			}
			
		},
		editThisTag(data){
			this.$prompt('请输入分类名', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  inputValue:data.name,
			  inputPattern: /\S/,
			  closeOnClickModal:false,
			  inputErrorMessage: '分类名不能为空'
			}).then(({ value }) => {
			  editcategory({categoryId: data.category_id,name:value}).then(res => {
				  this.$message.success('修改成功');
				  this.getTagList();
			  })
			}).catch(() => {
			  this.$message({
				type: 'info',
				message: '取消修改'
			  });       
			});
		}
	},
	created() {
		this.getTagList();
	}
};
</script>

<style>
.el-tag + .el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
