import request from '@/utils/request'
import qs from 'qs'

let hotApi = {};
hotApi.videoList = function(data) {
	return request({
		url: 'manager/Resource/getHotVideoList',
		method: 'POST',
		data: qs.stringify(data),
	})
};

hotApi.addHotVideo = function(data) {
	return request({
		url: 'manager/Resource/addHotVideo',
		method: 'POST',
		data: qs.stringify(data),
	})
};

hotApi.checkHotVideo = function(data) {
	return request({
		url: 'manager/Resource/checkHotVideo',
		method: 'POST',
		data: qs.stringify(data),
	})
};

hotApi.editHotVideo = function(data) {
	return request({
		url: 'manager/Resource/editHotVideo',
		method: 'POST',
		data: qs.stringify(data),
	})
};

hotApi.delHotVideo = function(data) {
	return request({
		url: 'manager/Resource/delHotVideo',
		method: 'POST',
		data: qs.stringify(data),
	})
};

export default hotApi;
