<template>
	<div class="dashboard-container">
		<!-- :xs="24" :sm="12" :lg="6" -->
		<el-row :gutter="20">
			<el-col :xs="24" :sm="12" :lg="18">
				<el-card :body-style="{ height: '400px' }">
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="待审核案例" name="case">
							<div style="height:300px; overflow: auto"><case-table></case-table></div>
						</el-tab-pane>
						<el-tab-pane label="待审核台本" name="script">
							<div style="height:300px; overflow: auto"><scriptTable></scriptTable></div>
						</el-tab-pane>
						<el-tab-pane label="待审核报告" name="report">
							<div style="height:300px; overflow: auto"><report-table></report-table></div>
						</el-tab-pane>
						<el-tab-pane label="待审核课程" name="fourth">待审核课程</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="12" :lg="6">
				<el-card :body-style="{ height: '400px' }"><Calendar></Calendar></el-card>
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
import caseTable from './components/caseTable';
import courseTable from './components/courseTable';
import reportTable from './components/reportTable';
import scriptTable from './components/scriptTable';

export default {
	name: 'Dashboard',
	components: {
		Calendar,
		caseTable,
		courseTable,
		reportTable,
		scriptTable
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
		}
	},
	methods: {
		handleClick(tab) {},
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
