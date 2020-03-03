import request from '@/utils/request'
import qs from 'qs'

let reportApi = {};

reportApi.lists = function(data){
    return request({
      url: 'manager/Report/lists',
      method: 'POST',
      data: qs.stringify(data),
    })
  };

reportApi.add = function(data){
      return request({
        url: 'manager/Report/add',
        method: 'POST',
        data: qs.stringify(data),
      })
    }
  

export default reportApi;
