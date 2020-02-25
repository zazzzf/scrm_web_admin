import request from '@/utils/request'
import qs from 'qs'

let categoryApi = {};

//其他分类接口
categoryApi.addCategory = function(data) {
	return request({
		url: 'manager/category/add',
		method: 'POST',
		data: qs.stringify(data),
	})
};

categoryApi.editCategory = function(data) {
	return request({
		url: 'manager/category/edit',
		method: 'POST',
		data: qs.stringify(data),
	})
};
categoryApi.delCategory = function(data) {
	return request({
		url: 'manager/category/del',
		method: 'POST',
		data: qs.stringify(data),
	})
};
categoryApi.categoryList = function(data) {
	return request({
		url: 'manager/category/categoryList',
		method: 'POST',
		data: qs.stringify(data),
	})
};

let conCategory = {}

conCategory.addCategory = function(data) {
  return request({
    url: 'manager/content_category/add',
    method: 'POST',
    data: qs.stringify(data),
  })
};

conCategory.editCategory = function(data) {
  return request({
    url: 'manager/content_category/edit',
    method: 'POST',
    data: qs.stringify(data),
  })
};
conCategory.delCategory = function(data) {
  return request({
    url: 'manager/content_category/del',
    method: 'POST',
    data: qs.stringify(data),
  })
};
conCategory.categoryList = function(data) {
  return request({
    url: 'manager/content_category/categoryList',
    method: 'POST',
    data: qs.stringify(data),
  })
};

export {categoryApi,conCategory};
