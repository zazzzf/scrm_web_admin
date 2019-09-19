import request from '@/utils/request'
import qs from 'qs'

let caseApi = {};
caseApi.addInspiration = function(data){
  return request({
    url: 'manager/Inspiration/add',
    method: 'POST',
    data: qs.stringify(data),
  })
};
caseApi.getList = function(data){
    return request({
      url: 'manager/Inspiration/tikTokList',
      method: 'POST',
      data: qs.stringify(data),
    })
  }

  caseApi.changeReadCount = function(data){
    return request({
      url: 'manager/Inspiration/changeReadCount&inspirationId=' + data.inspirationId,
      method: 'GET',
    })
  }
  
  caseApi.addTiktok = function(data){
    return request({
      url: 'manager/Inspiration/addTiktok',
      method: 'POST',
      data: qs.stringify(data),
    })
  }

  caseApi.getTikTokUrl = function(data){
    return request({
      url: 'manager/Inspiration/getTikTokUrl',
      method: 'POST',
      data: qs.stringify(data),
    })
  }

  caseApi.tikTokList = function(data){
    return request({
      url: 'manager/Inspiration/tikTokList',
      method: 'POST',
      data: qs.stringify(data),
    })
  }
  
  
  caseApi.delTikTok = function(data){
    return request({
      url: 'manager/Inspiration/delTikTok',
      method: 'POST',
      data: qs.stringify(data),
    })
  }
  

  caseApi.editTikTok = function(data){
    return request({
      url: 'manager/Inspiration/editTikTok',
      method: 'POST',
      data: qs.stringify(data),
    })
  }
  
  
export default caseApi;