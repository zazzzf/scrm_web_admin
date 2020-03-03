import request from '@/utils/request'
import qs from 'qs'

let hotVideo = {};
hotVideo.addHotVideo = function(data) {
	return request({
		url: 'manager/Resource/addHotVideo',
        method: 'post',
        data: qs.stringify(data),
	})
}

hotVideo.HotVideoList = function(data) {
	return request({
		url: 'manager/Resource/getHotVideoList',
        method: 'post',
        data: qs.stringify(data),
	})
}

hotVideo.checkHotVideo = function(data) {
	return request({
		url: 'manager/Resource/checkHotVideo',
        method: 'post',
        data: qs.stringify(data),
	})
}

hotVideo.editHotVideo = function(data) {
	return request({
		url: 'manager/Resource/editHotVideo',
        method: 'post',
        data: qs.stringify(data),
	})
}

hotVideo.delHotVideo = function(data) {
	return request({
		url: 'manager/Resource/delHotVideo',
        method: 'post',
        data: qs.stringify(data),
	})
}
export default hotVideo;
