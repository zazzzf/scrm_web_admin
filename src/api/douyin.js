import request from '@/utils/tikRequest'

let Tiktok = {};
Tiktok.getData = function() {
	return request({
		url: 'word',
        method: 'get',
	})
}



export default Tiktok;
