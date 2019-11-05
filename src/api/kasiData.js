import request from '@/utils/kasiRequest'
import qs from 'qs'

let kasi = {};
kasi.getTags = function(data) {
	return request({
		url: 'merchant/resource/getKSTag',
        method: 'post',
        data: qs.stringify(data),
	})
}

kasi.getDates = function() {
	return request({
		url: 'merchant/resource/getKSPlatform',
        method: 'get',
	})
}

kasi.getData = function(data) {
	return request({
		url: 'merchant/resource/getKSRank',
        method: 'post',
        data: qs.stringify(data),
	})
}

export default kasi;
