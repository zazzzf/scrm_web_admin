<template>
	<div class="search-box">
		<el-form  ref="searchForm" :model="searchData" inline="">
			<el-form-item prop="title">
				<el-input v-model="searchData.title" style="width: 300px;" placeholder="标题搜索"></el-input>
			</el-form-item>
			<el-form-item prop="tag">
				<el-select clearable  v-model="searchData.tag" multiple collapse-tags  placeholder="标签筛选">
					<el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="status">
				<el-select clearable  v-model="searchData.status" placeholder="审核状态">
					<el-option label="通过" :value="1"></el-option>
					<el-option label="未通过" :value="-1"></el-option>
					<el-option label="待审核" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click='handleSearch'>搜索</el-button>
				<el-button type="text" @click='resetSearch'>重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
</script>

<style>
</style>
