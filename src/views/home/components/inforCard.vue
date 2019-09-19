<template>
  <div :gutter="40" class="panel-group" :progress="progress">
    <div class="card-panel">
      <div class="card-panel-icon-wrapper " :style="{color: fontColor}">
        <svg-icon :icon-class="iconClass" class-name="card-panel-icon" />
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">
          {{ idName }}
        </div>
        <count-to :start-val="startVal" :end-val="endVal" :duration="2600" class="card-panel-num" />
      </div>
      <div class="card-panel-progress">
        <el-progress :percentage="Math.abs(progress)" :status="progress>0?'success':'exception'" :text-inside="true" :stroke-width="12" />
      </div>
    </div>
  </div>

</template>
<script>

import CountTo from 'vue-count-to'

export default {
  name: 'InforCard',
  components: {
    CountTo
  },
  filters: {
    transformValue: function(val) {
      let endVal = 0
      let unit = ''
      // if (val < 1000) {
      //     endVal = val;
      // } else if (val >= 1000 && val < 1000000) {
      //     endVal = parseInt(val / 1000);
      //     unit = 'K+';
      // } else if (val >= 1000000 && val < 10000000000) {
      //     endVal = parseInt(val / 1000000);
      //     unit = 'M+';
      // } else {
      //     endVal = parseInt(val / 1000000000);
      //     unit = 'B+';
      // }
      if (val < 10000) {
        endVal = val
      } else {
        endVal = parseInt(val / 10000)
        unit = 'W+'
      }
      return endVal + unit
    },
    methods: {
	  
	}
  },
  props: {
    endVal: Number,
    startVal: Number,
    idName: String,
    fontColor: String,
    iconClass: String,
    progress: Number
  }
}

</script>
<style lang="scss" scoped>
  .panel-group {
    // margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 130px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

    //   &:hover {
    //     .card-panel-icon-wrapper {
    //       color: #fff;
    //     }

    //     .icon-people {
    //       background: #40c9c6;
    //     }

    //     .icon-message {
    //       background: #36a3f7;
    //     }

    //     .icon-money {
    //       background: #f4516c;
    //     }

    //     .icon-shopping {
    //       background: #34bfa3
    //     }
    //   }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
        .card-panel-progress{
            padding: 0 5px;
        }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

</style>
