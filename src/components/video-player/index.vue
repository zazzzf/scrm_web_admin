<template>
    <div id="wrapper" :style="{height: `${height}px`}"></div>
</template>
<script>
/**
自定义视频播放器 支持Flv格式
videoUrl： 要播放到视频路径
height： 播放器高度， 默认宽度100% 高度 500px
autoplay: 是否自动播放
 */
import Chimee from 'chimee';
import flv from 'chimee-kernel-flv'
export default {
    name: 'videoPlayer',
    props:{
        videoUrl:String,
        height:{ 
            type:[String,Number], 
            default: 500
        },
        autoplay: {
            type: Boolean,
            default: true,
        }
    },
    methods:{
        createPlayer(){
            if(!this.videoUrl)return;
            let _this = this;
            const chimee = new Chimee({
                wrapper: '#wrapper',
                src: _this.videoUrl,
                controls: true,
                autoplay: _this.autoplay,
                kernels: {
                    flv
                }
            })
        }
    },
    mounted(){
        this.createPlayer();
    }
}
</script>>