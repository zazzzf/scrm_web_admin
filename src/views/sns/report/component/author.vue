<template>
    <el-card>
        <CellGroup>
            <Cell>
                <el-row type="flex" align="middle">
                    <el-avatar :src="authorData[0].author_img" /> <span style="margin-left:10px">{{authorData[0].author}}</span>
                </el-row>
                <template slot="extra">
                    {{type==0?'点赞数：'+ authorData[0].like_num:type==1?'评论数：'+ authorData[0].comment_num:`${plateType==1? '转发数：':'浏览数：'}`+ authorData[0].share_num}}
                </template>
            </Cell>
        </CellGroup>
    </el-card>
</template>
<script>
import {Cell ,CellGroup} from 'view-design'
export default {
    components:{
        Cell,CellGroup
    },
    props:{
        authorData:{},
        type: {
            type:Number,
            default:()=>0
        },
        plateType:{
            type:Number,
            default:()=>1
        }
        
    },
    data(){
        return{
            labelList:["点赞数","评论数","转发数"],
            labelKeyName:["like_num","comment_num","share_num"],
        }
    }
}
</script>