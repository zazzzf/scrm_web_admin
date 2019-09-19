import request from '@/utils/request'
import qs from 'qs'

let tagsApi = {};
tagsApi.addTags = function(data) {
	return request({
		url: 'manager/tag/add',
		method: 'POST',
		data: qs.stringify(data),
	})
};

tagsApi.editTags = function(data) {
	return request({
		url: 'manager/tag/edit',
		method: 'POST',
		data: qs.stringify(data),
	})
};
tagsApi.delTags = function(data) {
	return request({
		url: 'manager/tag/del',
		method: 'POST',
		data: qs.stringify(data),
	})
};
tagsApi.tagList = function(data) {
	return request({
		url: 'manager/tag/tagList',
		method: 'POST',
		data: qs.stringify(data),
	})
};


export default tagsApi;
