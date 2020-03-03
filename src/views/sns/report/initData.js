import {StringExchangeEmoji} from '@/utils/util'
export function initData(data){
    data.dy.like.map((item,index) => {
        item.daily_assistant_id = index
        item.link = item.share_link
        item.analyze = item.analyze?item.analyze:""
        item.author_fans = item.author_fans?item.author_fans:""
        item.share_num = item.share_num?item.share_num:""
        item.author_img= item.author_img?item.author_img:"http://scrm-image-qn.xaxhl.net/3ea6beec64369c2642b92c6726f1epng.png"
    })
    data.dy.share.map((item,index) => {
        item.daily_assistant_id = index
        item.link = item.share_link
        item.analyze = item.analyze?item.analyze:""
        item.author_fans = item.author_fans?item.author_fans:""

        item.share_num = item.share_num?item.share_num:""
        item.author_img= item.author_img?item.author_img:"http://scrm-image-qn.xaxhl.net/3ea6beec64369c2642b92c6726f1epng.png"
    })
    data.dy.comment.map((item,index) => {
        item.daily_assistant_id = index
        item.link = item.share_link
        item.analyze = item.analyze?item.analyze:""
        item.author_fans = item.author_fans?item.author_fans:""

        item.share_num = item.share_num?item.share_num:""
        item.author_img= item.author_img?item.author_img:"http://scrm-image-qn.xaxhl.net/3ea6beec64369c2642b92c6726f1epng.png"
    })
    data.ks.like.map((item,index) => {
        
        item.daily_assistant_id = index
        item.link = item.share_link
        item.analyze = item.analyze?item.analyze:""
        item.author_fans = item.author_fans?item.author_fans:""

        item.share_num = item.share_num?item.share_num:""
        item.author_img= item.author_img?item.author_img:"http://scrm-image-qn.xaxhl.net/3ea6beec64369c2642b92c6726f1epng.png"
    })
    data.ks.share.map((item,index) => {
        
        item.daily_assistant_id = index
        item.link = item.share_link
        item.analyze = item.analyze?item.analyze:""
        item.author_fans = item.author_fans?item.author_fans:""

        item.share_num = item.share_num?item.share_num:""
        item.author_img= item.author_img?item.author_img:"http://scrm-image-qn.xaxhl.net/3ea6beec64369c2642b92c6726f1epng.png"
    })
    data.ks.comment.map((item,index) => {
        
        item.daily_assistant_id = index
        item.link = item.share_link
        item.analyze = item.analyze?item.analyze:""
        item.author_fans = item.author_fans?item.author_fans:""
        item.share_num = item.share_num?item.share_num:""
        item.author_img= item.author_img?item.author_img:"http://scrm-image-qn.xaxhl.net/3ea6beec64369c2642b92c6726f1epng.png"
    })
    return data
}
