<template>
	<div class="dashboard-container">
		<!-- :xs="24" :sm="12" :lg="6" -->
		<el-row :gutter="20">
			<el-col :xs="24" :sm="12" :lg="18">
				<el-card :body-style="{ height: '460px' }">
					<el-button style="width: 100%" type="primary" @click="handleClick">快捷发布(热点视频)</el-button>
					<div style="height:360px; overflow: auto"><hot-video-table></hot-video-table></div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="12" :lg="6">
				<el-card :body-style="{ height: '400px' }" header="日历">
					<Calendar  :markDate="['2019-07-01','2019-07-06']"
					:textTop="weekName" :topDateName='topDateName'></Calendar>
				</el-card>
			</el-col>
		</el-row>
		<el-card style='margin-top:20px'>
			<div id="chart1" style="height: 600px;" class="chart-group"></div>
		</el-card>
	</div>
</template>

<script>
import echarts from 'echarts';
import 'echarts-wordcloud';
import {storeIncrease} from '@/api/home';
import Calendar from '@/components/vue-calendar/calendar.vue';
import hotVideoTable from './components/hotVideoTable';

export default {
	name: 'Dashboard',
	components: {
		Calendar,
		hotVideoTable,
	},
	data() {
		return {
			activeName: 'case',
			value: new Date(),
			storeData:[]
		};
	},
	computed: {
		listenshowpage: function() {
			return this.$store.state.app.language;
		},
		weekName:function(){
			return [this.$t('w7'),this.$t('w1'),this.$t('w2'),this.$t('w3'),this.$t('w4'),this.$t('w5'),this.$t('w6')]
		},
		topDateName:function(){
			return [this.$t('year'),this.$t('month')]
		}
	},
	methods: {
		handleClick() {
			this.$router.push({
				name:"hotVideoAdd",
				params:{
					quick:true
				}
			})
		},
		drawstorerease() {
			var xTitle = [];
			var yData = [];
			var list = this.storeData;
			list.forEach(item => {
				xTitle.push(item.time);
				yData.push(item.value);
			});
			this.charts1 = echarts.init(document.getElementById('chart1'));
			this.charts1.setOption({
				title: {
					text: '用户增长情况',
					textStyle: {
						align: 'center',
						color: '#000',
						fontSize: 20
					},
					top: '5%',
					right: '10%'
				},
				grid: {
					top: '15%',
					bottom: '10%'
				},
				tooltip: {
					trigger: 'axis'
				},
				xAxis: [
					{
						type: 'category',
						data: xTitle,
						axisLine: {
							lineStyle: {
								color: '#999'
							}
						}
					}
				],
				yAxis: [
					{
						type: 'value',
						name: '增长用户数',
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
								color: '#333'
							}
						},
						nameTextStyle: {
							color: '#999'
						},
						splitArea: {
							show: false
						}
					}
				],
				series: [
					{
						name: '增长用户数',
						type: 'line',
						data: yData,
						lineStyle: {
							normal: {
								width: 8,
								color: {
									type: 'linear',

									colorStops: [
										{
											offset: 0,
											color: '#A9F387' // 0% 处的颜色
										},
										{
											offset: 1,
											color: '#48D8BF' // 100% 处的颜色
										}
									],
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
								borderColor: '#A9F387'
							}
						},
						smooth: true
					}
				]
			});
		},
		//////////////////
		drawChart() {
			var that = this;
			that.drawstorerease();
			
		},
		initEcharts() {
			let _this = this;
			_this.charts1.resize();
		},
		initEchart() {
			let _this = this; //页面有多个echarts表，多个图表自适应
			window.addEventListener('resize', _this.initEcharts);
		},
		getStore(){
			storeIncrease().then(res=> {
				this.storeData = res.data.reverse();
				this.$nextTick(()=>{
					this.drawChart();
				})
			})
		}
	},
	created() {
		this.getStore();
	},
	mounted() {},
	watch: {}
};
</script>

<style lang="scss" scoped>
.chart-group {
	margin: 10px 0 !important;
	background: #fff;
	height: 400px;
}

.dashboard {
	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
.el-calendar-day {
	height: 38px !important;
}
</style>
