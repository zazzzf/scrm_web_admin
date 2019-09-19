<template>
  <div class="dashboard-container">
    <el-row :gutter="15" class="panel-group">
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <inforCard :id-name="'粉丝数'" :end-val="weekData.fans_number||0" fontColor='#4ba9ab' iconClass='fans' :progress='weekData.fansIncreaseRation'>
        </inforCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <inforCard :id-name="'阅读数'" :end-val="weekData.fans_number||0" fontColor='#488fdc' iconClass='read' :progress='weekData.readingsIncreaseNumber'>
        </inforCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <inforCard :id-name="'播放数'" :end-val="weekData.plays_number||0" fontColor='#737db2' iconClass='play' :progress='weekData.playsIncreaseNumber'>
        </inforCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <inforCard :id-name="'互动数'" :end-val="weekData.interactions_number||0" fontColor='#FF5B57' iconClass='good' :progress='weekData.interactionsIncreaseNumber'>
        </inforCard>
      </el-col>
    </el-row>
    <div id="chart1" style="height: 600px;" class="chart-group"></div>
    <el-row :gutter="15" style="height:400px;">
      <el-col :sm="24" :lg="8">
        <el-card class="box-card chart-group" shadow='hover'>
          <div id="chart4" style="height: 400px;" class="chart-group"></div>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="8">
        <el-card class="box-card chart-group" shadow='hover'>
          <div id="chart3" style="height: 400px;" class="chart-group"></div>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="8">
        <div id="chart2" style="height: 400px;" class="chart-group"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import inforCard from './components/inforCard'
  import echarts from 'echarts';
  import Home from '@/api/home';
  import Cookies from 'js-cookie';
  import 'echarts-wordcloud'

  export default {
    name: 'Dashboard',
    components: {
      inforCard
    },
    data() {
      return {
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        table: false,
        weekData: {
          "fansIncreaseRation": 20,
          "readingsIncreaseNumber": 30,
          "playsIncreaseNumber": 40,
          "interactionsIncreaseNumber": 50,
          fans_number: 21917568,
          interactions_number: 3813845,
          plays_number: 214617011,
          readings_number: 49904305,
          halfYearFans: [
            {fans_number: 73805227, date_time: "2018-12"},
            {fans_number: 73986597, date_time: "2019-01"},
            {fans_number: 67256378, date_time: "2019-02"},
            {fans_number: 78857992, date_time: "2019-03"},
            {fans_number: 83802638, date_time: "2019-04"},
            {fans_number: 93364017, date_time: "2019-05"},
            {fans_number: 93782008, date_time: "2019-06"},
          ]
        },
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ]),
      listenshowpage: function () {
        return this.$store.state.app.language
      },
    },
    methods: {
      getWeekStatistics() {
        Home.weekStatistics().then(data => {
          data.data.fansIncreaseRation = parseFloat(data.data.fansIncreaseRation);
          data.data.readingsIncreaseNumber = parseFloat(data.data.readingsIncreaseNumber);
          data.data.playsIncreaseNumber = parseFloat(data.data.playsIncreaseNumber);
          data.data.interactionsIncreaseNumber = parseFloat(data.data.interactionsIncreaseNumber);
          this.weekData = data.data;
          this.drawChart();
        })
      },
      posttest() {
        var xTitle = [];
        var yData = [];
        var list = this.weekData.halfYearFans;
        list.forEach(item => {
          xTitle.push(item.date_time);
          yData.push(item.fans_number);
        });
        this.charts1 = echarts.init(document.getElementById("chart1"));
        this.charts1.setOption({
          title: {
            text: '半年度粉丝增长走势',
            textStyle: {
              align: 'center',
              color: '#000',
              fontSize: 20,
            },
            top: '5%',
            right: '10%',
          },
          grid: {
            top: "15%",
            bottom: "10%"
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: [{
            type: 'category',
            data: xTitle,
            axisLine: {
              lineStyle: {
                color: "#999"
              }
            }
          }],
          yAxis: [{
            type: 'value',
            name: '粉丝数',
            splitNumber: 4,
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#DDD'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#333"
              },
            },
            nameTextStyle: {
              color: "#999"
            },
            splitArea: {
              show: false
            }
          }],
          series: [{
            name: '粉丝数',
            type: 'line',
            data: yData,
            lineStyle: {
              normal: {
                width: 8,
                color: {
                  type: 'linear',

                  colorStops: [{
                    offset: 0,
                    color: '#A9F387' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#48D8BF' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: 'rgba(72,216,191, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20
              }
            },
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 10,
                /*shadowColor: 'rgba(72,216,191, 0.3)',
                shadowBlur: 100,*/
                borderColor: "#A9F387"
              }
            },
            smooth: true
          }]
        });
      },
      posttest2() {
        this.charts2 = echarts.init(document.getElementById("chart2"));
        var symbols = [
          'path://M18.2629891,11.7131596 L6.8091608,11.7131596 C1.6685112,11.7131596 0,13.032145 0,18.6237673 L0,34.9928467 C0,38.1719847 4.28388932,38.1719847 4.28388932,34.9928467 L4.65591984,20.0216948 L5.74941883,20.0216948 L5.74941883,61.000787 C5.74941883,65.2508314 11.5891201,65.1268798 11.5891201,61.000787 L11.9611506,37.2137775 L13.1110872,37.2137775 L13.4831177,61.000787 C13.4831177,65.1268798 19.3114787,65.2508314 19.3114787,61.000787 L19.3114787,20.0216948 L20.4162301,20.0216948 L20.7882606,34.9928467 C20.7882606,38.1719847 25.0721499,38.1719847 25.0721499,34.9928467 L25.0721499,18.6237673 C25.0721499,13.032145 23.4038145,11.7131596 18.2629891,11.7131596 M12.5361629,1.11022302e-13 C15.4784742,1.11022302e-13 17.8684539,2.38997966 17.8684539,5.33237894 C17.8684539,8.27469031 15.4784742,10.66467 12.5361629,10.66467 C9.59376358,10.66467 7.20378392,8.27469031 7.20378392,5.33237894 C7.20378392,2.38997966 9.59376358,1.11022302e-13 12.5361629,1.11022302e-13',
          'path://M28.9624207,31.5315864 L24.4142575,16.4793596 C23.5227152,13.8063773 20.8817445,11.7111088 17.0107398,11.7111088 L12.112691,11.7111088 C8.24168636,11.7111088 5.60080331,13.8064652 4.70917331,16.4793596 L0.149791395,31.5315864 C-0.786976655,34.7595013 2.9373074,35.9147532 3.9192135,32.890727 L8.72689855,19.1296485 L9.2799493,19.1296485 C9.2799493,19.1296485 2.95992025,43.7750224 2.70031069,44.6924335 C2.56498417,45.1567684 2.74553639,45.4852068 3.24205501,45.4852068 L8.704461,45.4852068 L8.704461,61.6700801 C8.704461,64.9659872 13.625035,64.9659872 13.625035,61.6700801 L13.625035,45.360657 L15.5097899,45.360657 L15.4984835,61.6700801 C15.4984835,64.9659872 20.4191451,64.9659872 20.4191451,61.6700801 L20.4191451,45.4852068 L25.8814635,45.4852068 C26.3667633,45.4852068 26.5586219,45.1567684 26.4345142,44.6924335 C26.1636859,43.7750224 19.8436568,19.1296485 19.8436568,19.1296485 L20.3966199,19.1296485 L25.2043926,32.890727 C26.1862111,35.9147532 29.9105828,34.7595013 28.9625083,31.5315864 L28.9624207,31.5315864 Z M14.5617154,0 C17.4960397,0 19.8773132,2.3898427 19.8773132,5.33453001 C19.8773132,8.27930527 17.4960397,10.66906 14.5617154,10.66906 C11.6274788,10.66906 9.24611767,8.27930527 9.24611767,5.33453001 C9.24611767,2.3898427 11.6274788,0 14.5617154,0 L14.5617154,0 Z',
          'path://M512 292.205897c80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 65.503248 592.855572 0 512 0 431.144428 0 365.641179 65.503248 365.641179 146.358821 365.641179 227.214393 431.144428 292.205897 512 292.205897zM512 731.282359c-80.855572 0-146.358821 65.503248-146.358821 146.358821 0 80.855572 65.503248 146.358821 146.358821 146.358821 80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 796.273863 592.855572 731.282359 512 731.282359z'
        ];
        var bodyMax = 100; //指定图形界限的值
        var labelSetting = {
          normal: {
            show: true,
            position: 'bottom',
            offset: [0, 10],
            formatter: function (param) {
              return (param.value / bodyMax * 100).toFixed(0) + '%';
            },
            textStyle: {
              fontSize: 18,
              fontFamily: 'Arial',
              color: '#686868'
            }
          }
        };

        var markLineSetting = { //设置标线
          symbol: 'none',
          lineStyle: {
            normal: {
              opacity: 0.3
            }
          },
          data: [{
            type: 'max',
            label: {
              normal: {
                formatter: 'max: {c}'
              }
            }
          }, {
            type: 'min',
            label: {
              normal: {
                formatter: 'min: {c}'
              }
            }
          }]
        };

        var option = {
          title: {
            text: '粉丝性别',
            left: 'center',
            top: 20,

          },
          tooltip: {
            show: false, //鼠标放上去显示悬浮数据
          },
          grid: {
            // left: '20%',
            // right: '20%',
            top: '20%',
            bottom: '20%',
            containLabel: true
          },
          xAxis: {
            data: ['a', 'x', 'b'],
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          yAxis: {
            max: bodyMax,
            splitLine: {
              show: false
            },
            axisTick: {
              // 刻度线
              show: false
            },
            axisLine: {
              // 轴线
              show: false
            },
            axisLabel: {
              // 轴坐标文字
              show: false
            }
          },
          series: [{
              name: 'Men',
              type: 'pictorialBar',
              symbolClip: true,
              symbolBoundingData: bodyMax,
              label: labelSetting,
              data: [{
                  value: 35,
                  symbol: symbols[0],
                  itemStyle: {
                    normal: {
                      color: 'rgba(105,204,230)' //单独控制颜色
                    }
                  },
                },
                {

                },
                {
                  value: 65,
                  symbol: symbols[1],
                  itemStyle: {
                    normal: {
                      color: 'rgba(255,130,130)' //单独控制颜色
                    }
                  },
                }
              ],
              // markLine: markLineSetting,
              z: 10
            },
            {
              // 设置背景底色，不同的情况用这个
              name: 'full',
              type: 'pictorialBar', //异型柱状图 图片、SVG PathData
              symbolBoundingData: bodyMax,
              animationDuration: 0,
              itemStyle: {
                normal: {
                  color: '#ccc' //设置全部颜色，统一设置
                }
              },
              z: 10,
              data: [{
                  itemStyle: {
                    normal: {
                      color: 'rgba(105,204,230,0.40)' //单独控制颜色
                    }
                  },
                  value: 100,
                  symbol: symbols[0]
                },
                {
                  // 设置中间冒号
                  itemStyle: {
                    normal: {
                      color: '#1DA1F2' //单独控制颜色
                    }
                  },
                  value: 100,
                  symbol: symbols[2],
                  symbolSize: [8, '18%'],
                  symbolOffset: [0, '-200%']
                },
                {
                  itemStyle: {
                    normal: {
                      color: 'rgba(255,130,130,0.40)' //单独控制颜色
                    }
                  },
                  value: 100,
                  symbol: symbols[1]
                }
              ]
            }
          ]
        };
        let _this = this;
        this.charts2.setOption(option);
        this.charts2.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          // 使用 dataIndex 来定位节点。
          dataIndex: 1,
        });
        this.charts2.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          // 使用 dataIndex 来定位节点。
          dataIndex: 1,
        });
      },
      posttest3() {
        this.charts3 = echarts.init(document.getElementById("chart3"));
        var option = {
          title: {
            text: '热点分析',
            link: 'https://www.baidu.com/s?wd=' + encodeURIComponent('ECharts'),
            x: 'center',
            textStyle: {
              fontSize: 23
            }

          },
          backgroundColor: '#fff',
          tooltip: {
            show: true
          },
          toolbox: {
            feature: {
              saveAsImage: {
                iconStyle: {
                  normal: {
                    color: '#FFFFFF'
                  }
                }
              }
            }
          },
          series: [{
            name: '热点分析',
            type: 'wordCloud',
            //size: ['9%', '99%'],
            sizeRange: [6, 66],
            //textRotation: [0, 45, 90, -45],
            rotationRange: [-45, 90],
            //shape: 'circle',
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6
            },
            textStyle: {
              normal: {
                color: function () {
                  return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') + ')';
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            data: [{
              name: "Jayfee",
              value: 666
            }, {
              name: "Nancy",
              value: 520
            }]
          }]
        };
        var JosnList = [];
        JosnList.push({
          name: "Jayfee",
          value: 666
        }, {
          name: "Nancy",
          value: 520
        }, {
          name: "生活资源",
          value: "999"
        }, {
          name: "供热管理",
          value: "888"
        }, {
          name: "供气质量",
          value: "777"
        }, {
          name: "生活用水管理",
          value: "688"
        }, {
          name: "一次供水问题",
          value: "588"
        }, {
          name: "交通运输",
          value: "516"
        }, {
          name: "城市交通",
          value: "515"
        }, {
          name: "环境保护",
          value: "483"
        }, {
          name: "房地产管理",
          value: "462"
        }, {
          name: "城乡建设",
          value: "449"
        }, {
          name: "社会保障与福利",
          value: "429"
        }, {
          name: "社会保障",
          value: "407"
        }, {
          name: "文体与教育管理",
          value: "406"
        }, {
          name: "公共安全",
          value: "406"
        }, {
          name: "公交运输管理",
          value: "386"
        }, {
          name: "出租车运营管理",
          value: "385"
        }, {
          name: "供热管理",
          value: "375"
        }, {
          name: "市容环卫",
          value: "355"
        }, {
          name: "自然资源管理",
          value: "355"
        }, {
          name: "粉尘污染",
          value: "335"
        }, {
          name: "噪声污染",
          value: "324"
        }, {
          name: "土地资源管理",
          value: "304"
        }, {
          name: "物业服务与管理",
          value: "304"
        }, {
          name: "医疗卫生",
          value: "284"
        }, {
          name: "粉煤灰污染",
          value: "284"
        }, {
          name: "占道",
          value: "284"
        }, {
          name: "供热发展",
          value: "254"
        }, {
          name: "农村土地规划管理",
          value: "254"
        }, {
          name: "生活噪音",
          value: "253"
        }, {
          name: "供热单位影响",
          value: "253"
        }, {
          name: "城市供电",
          value: "223"
        }, {
          name: "房屋质量与安全",
          value: "223"
        }, {
          name: "大气污染",
          value: "223"
        }, {
          name: "房屋安全",
          value: "223"
        }, {
          name: "文化活动",
          value: "223"
        }, {
          name: "拆迁管理",
          value: "223"
        }, {
          name: "公共设施",
          value: "223"
        }, {
          name: "供气质量",
          value: "223"
        }, {
          name: "供电管理",
          value: "223"
        }, {
          name: "燃气管理",
          value: "152"
        }, {
          name: "教育管理",
          value: "152"
        }, {
          name: "医疗纠纷",
          value: "152"
        }, {
          name: "执法监督",
          value: "152"
        }, {
          name: "设备安全",
          value: "152"
        }, {
          name: "政务建设",
          value: "152"
        }, {
          name: "县区、开发区",
          value: "152"
        }, {
          name: "宏观经济",
          value: "152"
        }, {
          name: "教育管理",
          value: "112"
        }, {
          name: "社会保障",
          value: "112"
        }, {
          name: "生活用水管理",
          value: "112"
        }, {
          name: "物业服务与管理",
          value: "112"
        }, {
          name: "分类列表",
          value: "112"
        }, {
          name: "农业生产",
          value: "112"
        }, {
          name: "二次供水问题",
          value: "112"
        }, {
          name: "城市公共设施",
          value: "92"
        }, {
          name: "拆迁政策咨询",
          value: "92"
        }, {
          name: "物业服务",
          value: "92"
        }, {
          name: "物业管理",
          value: "92"
        }, {
          name: "社会保障保险管理",
          value: "92"
        }, {
          name: "低保管理",
          value: "92"
        }, {
          name: "文娱市场管理",
          value: "72"
        }, {
          name: "城市交通秩序管理",
          value: "72"
        }, {
          name: "执法争议",
          value: "72"
        }, {
          name: "商业烟尘污染",
          value: "72"
        }, {
          name: "占道堆放",
          value: "71"
        }, {
          name: "地上设施",
          value: "71"
        }, {
          name: "水质",
          value: "71"
        }, {
          name: "无水",
          value: "71"
        }, {
          name: "供热单位影响",
          value: "71"
        }, {
          name: "人行道管理",
          value: "71"
        }, {
          name: "主网原因",
          value: "71"
        }, {
          name: "集中供热",
          value: "71"
        }, {
          name: "客运管理",
          value: "71"
        }, {
          name: "国有公交（大巴）管理",
          value: "71"
        }, {
          name: "工业粉尘污染",
          value: "71"
        }, {
          name: "治安案件",
          value: "71"
        }, {
          name: "压力容器安全",
          value: "71"
        }, {
          name: "身份证管理",
          value: "71"
        }, {
          name: "群众健身",
          value: "41"
        }, {
          name: "工业排放污染",
          value: "41"
        }, {
          name: "破坏森林资源",
          value: "41"
        }, {
          name: "市场收费",
          value: "41"
        }, {
          name: "生产资金",
          value: "41"
        }, {
          name: "生产噪声",
          value: "41"
        }, {
          name: "农村低保",
          value: "41"
        }, {
          name: "劳动争议",
          value: "41"
        }, {
          name: "劳动合同争议",
          value: "41"
        }, {
          name: "劳动报酬与福利",
          value: "41"
        }, {
          name: "医疗事故",
          value: "21"
        }, {
          name: "停供",
          value: "21"
        }, {
          name: "基础教育",
          value: "21"
        }, {
          name: "职业教育",
          value: "21"
        }, {
          name: "物业资质管理",
          value: "21"
        }, {
          name: "拆迁补偿",
          value: "21"
        }, {
          name: "设施维护",
          value: "21"
        }, {
          name: "市场外溢",
          value: "11"
        }, {
          name: "占道经营",
          value: "11"
        }, {
          name: "树木管理",
          value: "11"
        }, {
          name: "农村基础设施",
          value: "11"
        }, {
          name: "无水",
          value: "11"
        }, {
          name: "供气质量",
          value: "11"
        }, {
          name: "停气",
          value: "11"
        }, {
          name: "市政府工作部门（含部门管理机构、直属单位）",
          value: "11"
        }, {
          name: "燃气管理",
          value: "11"
        }, {
          name: "市容环卫",
          value: "11"
        }, {
          name: "新闻传媒",
          value: "11"
        }, {
          name: "人才招聘",
          value: "11"
        }, {
          name: "市场环境",
          value: "11"
        }, {
          name: "行政事业收费",
          value: "11"
        }, {
          name: "食品安全与卫生",
          value: "11"
        }, {
          name: "城市交通",
          value: "11"
        }, {
          name: "房地产开发",
          value: "11"
        }, {
          name: "房屋配套问题",
          value: "11"
        }, {
          name: "物业服务",
          value: "11"
        }, {
          name: "物业管理",
          value: "11"
        }, {
          name: "占道",
          value: "11"
        }, {
          name: "园林绿化",
          value: "11"
        }, {
          name: "户籍管理及身份证",
          value: "11"
        }, {
          name: "公交运输管理",
          value: "11"
        }, {
          name: "公路（水路）交通",
          value: "11"
        }, {
          name: "房屋与图纸不符",
          value: "11"
        }, {
          name: "有线电视",
          value: "11"
        }, {
          name: "社会治安",
          value: "11"
        }, {
          name: "林业资源",
          value: "11"
        }, {
          name: "其他行政事业收费",
          value: "11"
        }, {
          name: "经营性收费",
          value: "11"
        }, {
          name: "食品安全与卫生",
          value: "11"
        }, {
          name: "体育活动",
          value: "11"
        }, {
          name: "有线电视安装及调试维护",
          value: "11"
        }, {
          name: "低保管理",
          value: "11"
        }, {
          name: "劳动争议",
          value: "11"
        }, {
          name: "社会福利及事务",
          value: "11"
        }, {
          name: "一次供水问题",
          value: "11"
        });

        option.series[0].data = JosnList;
        this.charts3.setOption(option)
      },
      posttest4() {
        this.charts4 = echarts.init(document.getElementById("chart4"));
        var scale = 1;
        var echartData = [{
          value: 54,
          name: '剖腹产'
        }, {
          value: 52,
          name: '顺产'
        }, {
          value: 33,
          name: '绝望'
        }, {
          value: 30,
          name: '法律'
        }, {
          value: 30,
          name: '家人'
        }, {
          value: 27,
          name: '抑郁症'
        }]
        var rich = {
          yellow: {
            color: "#ffc72b",
            fontSize: 30 * scale,
            padding: [5, 4],
            align: 'center'
          },
          total: {
            color: "#ffc72b",
            fontSize: 40 * scale,
            align: 'center'
          },
          white: {
            color: "#fff",
            align: 'center',
            fontSize: 14 * scale,
            padding: [21, 0]
          },
          blue: {
            color: '#49dff0',
            fontSize: 16 * scale,
            align: 'center'
          },
          hr: {
            borderColor: '#0b5263',
            width: '100%',
            borderWidth: 1,
            height: 0,
          }
        }
        var option = {
          backgroundColor: '#fff',
          title: {
            text: '词频统计',
            left: 'center',
            top: '53%',
            padding: [24, 0],
            textStyle: {
              color: '#000',
              fontSize: 18 * scale,
              align: 'center'
            }
          },
          legend: {
            selectedMode: false,
            formatter: function (name) {
              var total = 0; //各科正确率总和
              var averagePercent; //综合正确率
              echartData.forEach(function (value, index, array) {
                total += value.value;
              });
              return '{total|' + total + '}';
            },
            data: [echartData[0].name],
            // data: ['高等教育学'],
            // itemGap: 50,
            left: 'center',
            top: 'center',
            icon: 'none',
            align: 'center',
            textStyle: {
              color: "#000",
              fontSize: 16 * scale,
              rich: rich
            },
          },
          series: [{
            name: '总考生数量',
            type: 'pie',
            radius: ['42%', '50%'],
            hoverAnimation: false,
            color: ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4'],
            label: {
              normal: {
                formatter: function (params, ticket, callback) {
                  var total = 0; //考生总数量
                  var percent = 0; //考生占比
                  echartData.forEach(function (value, index, array) {
                    total += value.value;
                  });
                  percent = ((params.value / total) * 100).toFixed(1);
                  return '{green|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '}\n{blue|' + percent +
                    '%}';
                },
                rich: rich
              },
            },
            labelLine: {
              normal: {
                length: 55 * scale,
                length2: 0,
                lineStyle: {
                  color: '#0b5263'
                }
              }
            },
            data: echartData
          }]
        };
        this.charts4.setOption(option);
      },
      drawChart() {
        var that = this;
        setTimeout(function () {
          that.posttest()
          that.posttest2()
          that.posttest3()
          that.posttest4()
        }, 100)
      },
      initEcharts() {
        let _this = this;
        _this.charts1.resize();
        _this.charts2.resize();
        _this.charts3.resize();
      },
      initEchart() {
        let _this = this; //页面有多个echarts表，多个图表自适应
        window.addEventListener('resize', _this.initEcharts)
      },
    },
    created() {
      // this.getWeekStatistics();
    },
    mounted() {
      this.drawChart();
      this.initEchart();
    },
    watch: {
      listenshowpage(old, newd) {
        if (old == 'ja') {
          this.charts1.setOption({
            title: {
              text: 'half_year_fans_up_chart',
            },
          })
        } else {
          this.charts1.setOption({
            title: {
              text: '半年度粉丝增长走势',
            },
          })
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  .chart-group {
    margin: 10px 0 !important;
    background: #fff;
    height: 400px
  }

  .dashboard {
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

</style>
