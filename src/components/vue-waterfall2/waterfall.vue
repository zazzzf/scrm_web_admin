<style>
  .vue-waterfall {
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .vue-waterfall .slot-box {
    position: absolute;
    top: 100%;
    left: 100%;
  }

  .vue-waterfall .vue-waterfall-column {
    float: left;
  }

  /* .vue-waterfall.is-transition img {
    opacity: 0;
  } */

  .vue-waterfall.is-transition img.animation {
    animation: 0.4s lazy-animation linear;
    animation-fill-mode: forwards;
  }

  @keyframes lazy-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

</style>
<template>
  <div class="vue-waterfall" ref="vueWaterfall" :class="isTransition&&'is-transition'">
    <div class="slot-box">
      <slot></slot>
    </div>
  </div>
</template>

<script>
//   global.regeneratorRuntime = require("babel-runtime/regenerator");
  import bus from './bus'

  export default {
    props: {
      col: {
        type: Number,
        default: 2
      },
      width: Number,
      data: {
        type: Array,
        default: []
      },
      gutterWidth: {
        type: Number,
        default: 10
      },
      isTransition: {
        type: Boolean,
        default: true
      },
      lazyDistance: {
        type: Number,
        default: 300
      },
      loadDistance: {
        type: Number,
        default: 300
      }

    },
    data() {
      return {
        root: null,
        columns: [],
        loadmore: true,
        timeout: null,
        lazyTimeout: null,
        lastScrollTop: 0,
        timer: null,
        loadedIndex: 0,
        columnWidth: 0,
        isresizing: false,
        clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
        clientWidth: document.documentElement.clientWidth || document.body.clientWidth,
      }
    },
    computed: {
      trueLazyDistance() {
        return this.clientWidth / 375 * this.lazyDistance
      },
      max() {
        return this.clientWidth / 375 * this.loadDistance
      }
    },
    watch: {
      col(val) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.init()
          }, 300)
        })
      },
      data(newVal, oldVal) {

        this.$nextTick(() => {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            if (this.isresizing) {
              return
            }
            if (newVal.length < this.loadedIndex) {
              this.loadedIndex = 0
            }
            // console.log(newVal.length,oldVal.length,newVal.length,this.loadedIndex)
            if (newVal.length > oldVal.length || newVal.length > this.loadedIndex) {

              if (newVal.length === oldVal.length) {
                // console.log(this.loadedIndex)
                this.resize(this.loadedIndex > 0 ? this.loadedIndex : null)
                return
              }
              this.resize(oldVal.length > 0 ? oldVal.length : null)
            }
          }, 300)
        })
      }
    },
    methods: {
      init() { //initialize
        this.root = this.$refs.vueWaterfall
        this.clearColumn()
        var col = parseInt(this.col)
        for (var i = 0; i < col; i++) {
          let odiv = document.createElement('div')
          odiv.className = 'vue-waterfall-column'
          if (this.width) {
            odiv.style.width = this.width + 'px'
            if (i != 0) {
              odiv.style.marginLeft = this.gutterWidth + 'px'
            }
            this.columnWidth = this.width
          } else {
            odiv.style.width = 100 / parseInt(col) + '%'
            this.columnWidth = 100 / parseInt(col) / 100 * document.documentElement.clientWidth
          }
          if (!this.root) {
            this.root = this.$refs.vueWaterfall
          }
          this.root && this.root.appendChild(odiv)
          this.columns.push(odiv)
        }
        this.resize()
      },
      async setDomImageHeight(dom) {
        var imgs = dom.querySelectorAll('img')
        for (var i = 0; i < imgs.length; i++) {
          var lazySrc = imgs[i].getAttribute('lazy-src')
          // console.log(lazySrc)
          if (!imgs[i].getAttribute('src') && lazySrc) {
            var newImg = new Image()
            newImg.src = lazySrc
            if (newImg.complete) {
              var trueWidth = imgs[i].offsetWidth || this.columnWidth
              var imgColumnHeight = newImg.height * trueWidth / newImg.width

              if (imgs[i].offsetWidth) {
                imgs[i].style.height = imgColumnHeight + 'px'
              }
            } else {
              await new Promise((resolve, reject) => {
                newImg.onload = function () {
                  var trueWidth = imgs[i].offsetWidth || this.columnWidth
                  var imgColumnHeight = newImg.height * trueWidth / newImg.width

                  if (imgs[i].offsetWidth) {
                    imgs[i].style.height = imgColumnHeight + 'px'
                  }
                  resolve()
                }
                newImg.onerror = function () {
                  resolve()
                }
              })
            }
          }
        }
      },
      async append(dom) { //append dom element

        var self = this
        if (this.columns.length > 0) {
          let min = this.columns[0]
          // await new Promise(async (resolve,reject)=>{
          for (var i = 1; i < this.columns.length; i++) {
            // console.log('---')
            if (await self.getHeight(min) > await self.getHeight(self.columns[i])) {
              min = self.columns[i]
            }
          }
          min && min.appendChild(dom)
          await this.setDomImageHeight(dom)
        }
      },
      checkImg(dom) { //check has image
        if (!dom) {
          return false
        }
        if (dom.getElementsByTagName && dom.getElementsByTagName("img").length) {
          return true
        } else {
          return false
        }
      },
      async resize(index, elements) { //resize and render
        this.isresizing = true
        var self = this
        if (!this.$slots.default) {
          this.isresizing = false
          return
        }
        if (!index && index != 0 && !elements) {
          elements = this.$slots.default
          this.loadedIndex = 0
          this.clear()
        } else if (!elements) {
          this.loadedIndex = index
          elements = this.$slots.default.splice(index)
        }

        // console.log('resize',elements.length)
        for (var j = 0; j < elements.length; j++) {
          // (async function(j){
          // console.log(j)
          if (elements[j].elm && self.checkImg(elements[j].elm)) {
            // console.log(elements[j].elm)
            var imgs = elements[j].elm.getElementsByTagName('img')
            var newImg = new Image()
            newImg.src = imgs[0].src
            // self.lazyLoad(imgs)

            if (newImg.complete) {
              // self.computedPx(imgs[0],newImg)
              await self.append(elements[j].elm)
              self.lazyLoad(imgs)
            } else {
              await new Promise((resolve, reject) => {
                newImg.onload = async function () {
                  await self.append(elements[j].elm)
                  self.lazyLoad(imgs)
                  //  console.log('loaded')
                  resolve()
                }
                newImg.onerror = async function () {
                  await self.append(elements[j].elm)
                  self.lazyLoad(imgs)
                  resolve()
                }
              })
              // console.log(j)
            }

          } else {
            await self.append(elements[j].elm)
            // console.log('append')
          }
          self.loadedIndex++
          // })(i)
        }
        this.isresizing = false

      },
      computedPx(img, imgApi) {

        img.style.width = imgApi.width / this.columnWidth
      },
      lazyLoad(imgs) { // 
        // console.log(123)
        // console.log('lazy-load')
        if (!imgs) {
          if (!this.root) {
            this.root = this.$refs.vueWaterfall
          }
          imgs = this.root && this.root.getElementsByTagName('img')
        }



        if (!imgs || imgs.length < 0) {
          return
        }
        for (var index = 0; index < imgs.length; index++) {
          // if(imgs[index].className.match('animation')&&imgs[index].getAttribute('src'))
          // {
          // 	continue
          // }
          // if(!imgs[index].getAttribute('src')&&imgs[index].getBoundingClientRect().top<this.clientHeight+this.trueLazyDistance)
          // {
          // 	imgs[index].src = imgs[index].getAttribute('lazy-src')
          // 	imgs[index].className = imgs[index].className + ' animation'
          // 	// imgs[index].removeAttribute('lazy-src')
          // }
          // else if(imgs[index].getAttribute('src')&&!imgs[index].className.match('animation')){
          // 	imgs[index].className = imgs[index].className + ' animation'
          // }

          if (imgs[index].className.match('animation') && imgs[index].getAttribute('src')) {
            continue
          } else if (imgs[index].className.match('animation') && !imgs[index].getAttribute('src')) {
            imgs[index].src = imgs[index].getAttribute('lazy-src')
            imgs[index].removeAttribute('lazy-src')
          } else if (imgs[index].getAttribute('src') && !imgs[index].className.match('animation')) {
            imgs[index].className = imgs[index].className + ' animation'
          } else if (!imgs[index].getAttribute('src') && imgs[index].getBoundingClientRect().top < this.clientHeight +
            this.trueLazyDistance) {
            imgs[index].src = imgs[index].getAttribute('lazy-src')
            imgs[index].className = imgs[index].className + ' animation'
            imgs[index].removeAttribute('lazy-src')
          }


        }

      },
      clearColumn() {
        this.columns.forEach((item) => {
          item.remove()
        })
        this.columns = []
      },
      clear() {
        this.columns.forEach((item) => {
          item.innerHTML = ''
        })
      },
      mix() {
        var elements = this.$slots.default
        elements.sort(() => {
          return Math.random() - 0.5
        })
        this.resize(0, elements)
      },
      async getHeight(dom) {
        // var flag = false
        //  var imgs = dom.querySelectorAll('img')
        // var imgHeight = 0
        // 	for(var i=0;i<imgs.length;i++)
        // 	{
        // 		var lazySrc = imgs[i].getAttribute('lazy-src')
        // 		if(!imgs[i].getAttribute('src')&&lazySrc)
        // 		{
        // 		 flag = true
        // 		 var newImg = new Image()
        // 		 newImg.src = lazySrc
        // 		 if(newImg.complete)
        // 		 {
        // 		 	var trueWidth = imgs[i].offsetWidth || this.columnWidth
        // 			var imgColumnHeight = newImg.height*trueWidth/newImg.width
        // 			imgHeight += newImg.height
        // 			if(imgs[i].offsetWidth)
        // 			{
        // 				imgs[i].style.height = imgColumnHeight+'px'
        // 			}
        // 		 }
        // 		 else{
        // 			 await new Promise((resolve,reject)=>{
        // 				 newImg.onload =  function(){
        // 				 	var trueWidth = imgs[i].offsetWidth || this.columnWidth
        // 				 	var imgColumnHeight = newImg.height*trueWidth/newImg.width
        // 					imgHeight += newImg.height
        // 					if(imgs[i].offsetWidth)
        // 					{
        // 						imgs[i].style.height = imgColumnHeight+'px'
        // 					}
        // 					resolve()
        // 				}
        // 				newImg.onerror=  function(){
        // 					imgHeight += 100
        // 					resolve()
        // 				}
        // 			 })
        // 		 }
        // 		}
        // 	}
        return dom.offsetHeight
      },
      emitLoadMore() {
        var self = this
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        const scrollHeight = document.documentElement.offsetHeight
        var diff = scrollHeight - scrollTop - self.clientHeight
        self.$emit('scroll', {
          scrollHeight: scrollHeight,
          scrollTop: scrollTop,
          clientHeight: self.clientHeight,
          diff: diff,
          time: Date.now()
        })
        // console.log(diff,self.max)
        if (diff < self.max && self.loadmore && scrollHeight > self.clientHeight) {
          self.lastScrollTop = scrollTop
          self.loadmore = false
          self.$emit('loadmore')
        } else if (diff >= self.max) {
          self.loadmore = true
        }
        clearTimeout(self.lazyTimeout)
        self.lazyTimeout = setTimeout(function () {
          self.lazyLoad()
        }, 14)
      }
    },
    destroyed() {
      window.onscroll = null
      window.onresize = null
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.init()
        }, 100)
        var self = this;
        window.onscroll = function (e) {
          self.emitLoadMore()
        }
        document.addEventListener('touchmove', function () {
          self.emitLoadMore()
        })
      })
    },
    created() {
      bus.$on('forceUpdate', () => {
        this.resize()
      })
      bus.$on('mix', () => {
        this.mix()
      })
    },
  }

</script>
