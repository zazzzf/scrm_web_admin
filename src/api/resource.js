import request from '@/utils/request'
import qs from 'qs'

let resource = {};

resource.getHotVideo = function(data){
  return request({
    url: 'manager/Hot_Track/getHotVideo',
    method: 'POST',
    data: qs.stringify(data)
  })
}

resource.getChallengeList = function(data){
  return request({
    url: 'manager/Hot_Track/getChallengeList',
    method: 'POST',
    data: qs.stringify(data)
  })
}

resource.getChallengeVideos = function(data){
  return request({
    url: 'manager/Hot_Track/getChallengeVideos',
    method: 'POST',
    data: qs.stringify(data)
  })
}

resource.getHotStar = function(data){
  return request({
    url: 'manager/Hot_Track/getHotStar',
    method: 'POST',
    data: qs.stringify(data)
  })
}

resource.getMaxPeriods = function(data){
  return request({
    url: 'manager/Hot_Track/getMaxPeriods',
    method: 'POST',
    data: qs.stringify(data)
  })
}

resource.getStarUserInfo = function(data){
  return request({
    url: 'manager/Hot_Track/getStarUserInfo',
    method: 'POST',
    data: qs.stringify(data)
  })
}
export default resource;