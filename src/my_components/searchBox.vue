<template>
	<div class="search-box">
		<el-form  ref="searchForm" :model="searchData" inline="">
			<el-form-item prop="title">
				<el-input v-model="searchData.title" style="width: 300px;" :placeholder="$t('search.title')"></el-input>
			</el-form-item>
			<el-form-item prop="tag">
				<el-select clearable  v-model="searchData.tag" multiple collapse-tags  :placeholder="$t('search.tag')">
					<el-option v-for="item in tagsList" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="status">
				<el-select clearable  v-model="searchData.status" :placeholder="$t('search.check_status')">
					<el-option :label="$t('search.pass')" :value="1"></el-option>
					<el-option :label="$t('search.nopass')" :value="-1"></el-option>
					<el-option :label="$t('home.wait_pass')" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click='handleSearch'>{{$t('table.search')}}</el-button>
				<el-button type="text" @click='resetSearch'>{{$t('search.reset')}}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
</script>

<style>
</style>
