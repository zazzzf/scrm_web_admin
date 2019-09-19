import request from '@/utils/request'
import qs from 'qs'

let home = {};

home.weekStatistics = function(){
  return request({
    url: 'merchant/Statistics/weekStatistics',
    method: 'GET',
  })
}
export default home;