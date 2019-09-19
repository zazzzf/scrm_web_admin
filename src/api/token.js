import request from '@/utils/request'
import qs from 'qs'

export function qiniuToken(data){
	return request({
	  url: 'manager/Inspiration/getQiniuToken',
	  method: 'POST',
	  data: qs.stringify(data)
	})
}

