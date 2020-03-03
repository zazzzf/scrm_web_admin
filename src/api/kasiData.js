import request from '@/utils/kasiRequest'
import qs from 'qs'

let kasi = {};
kasi.getTags = function(data) {
	return request({
		url: 'manager/resource/getKSTag',
        method: 'post',
        data: qs.stringify(data),
	})
}

kasi.getDates = function() {
	return request({
		url: 'manager/resource/getKSPlatform',
        method: 'get',
	})
}

kasi.getData = function(data) {
	return request({
		url: 'manager/resource/getKSRank',
        method: 'post',
        data: qs.stringify(data),
	})
}

export default kasi;
