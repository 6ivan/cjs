<!--数据查看-客服-->
<template>
  <div class="build-container">
    <div class="p-dbox">
      <h3>近三十日客服工单统计</h3>
      <div id="build-stats" :style="{ width: '100%', height: '300px' }" />
    </div>
    <div>
      <div class="card">
        <h3>各部门完结率</h3>
        <div class="end-stats">
          <div id="build-1" class="end-stats-monitor"></div>
          <div id="build-2" class="end-stats-monitor"></div>
          <div id="build-3" class="end-stats-monitor"></div>
          <div id="build-4" class="end-stats-monitor"></div>
          <div id="build-5" class="end-stats-monitor"></div>
        </div>
      </div>

      <div class="card">
        <el-table
          class="p-table"
          :cell-class-name="pTableCell"
          :header-cell-class-name="pTableHead"
          :data="list"
          v-loading="tableLoading"
          ref="multipleTable"
          :row-key="(row) => row.id"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="orgName" label="部门名称"> </el-table-column>
          <el-table-column prop="urgCount" label="催办次数"> </el-table-column>
          <el-table-column prop="solvedRate" label="完单率"> </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="p-dbox">
      <el-tabs
        v-model="editableTabsValue"
        class="elTabsNav"
        @tab-click="changePlanTab"
      >
        <el-tab-pane
          v-for="(tab, index) in plan.tabs"
          :key="index"
          :label="tab"
          :name="tab.tabIdx"
        ></el-tab-pane>
      </el-tabs>
      <div
        id="build-column"
        class="p-chart"
        :style="{ width: '100%', height: '250px' }"
      />
    </div>
    <div class="p-dbox">
      <h3>工单类型分析</h3>
      <div id="build-row" :style="{ width: '100%', height: '500px' }" />
    </div>
  </div>
</template>

<script>
import "@/common/css/common.scss";
import FilterList from "@/mixins/FilterList";
import {
  server,
  timeForMat
} from "./mock.js";
import {
  getOrderStatisticApi,
  getFwPieApi,
  getOrderByOrgApi,
  getWorkOrderIssusesApi,
  getCityColumnGraphApi,
  getOrderColumnGraphApi
} from "@/api/lookData";
export default {
  mixins: [FilterList],
  data() {
    return {
      plan: {
        tabIndex: 0,
        tabs: [],
        tab: '',
        currentData: [],
        list: [
          [],
          []
        ],
      },
      orderColumnGraph: {},
      stationPie: [],
      stationLineGraph: {
        xData: [],
        yData: [
          [],
          [],
          []
        ]
      },
      workOrder: {
        tabIndex: 0,
        tabs: ["催办工单", "紧急工单", "延期工单"],
        currentData: [],
        list: [
          [{
            bu: "规划部",
            num: "4",
            time: "1.8小时",
            rate: "96.32%",
          },
          {
            bu: "建设部",
            num: "6",
            time: "4小时",
            rate: "96.32%",
          },
          {
            bu: "维护部",
            num: "12",
            time: "18小时",
            rate: "96.32%",
          },
          ],
          [{
            bu: "规划部",
            num: "4",
            time: "1.8小时",
            rate: "96.32%",
          },],
          [{
            bu: "规划部",
            num: "4",
            time: "1.8小时",
            rate: "96.32%",
          },],
        ],
      },
    };
  },
  created() {

  },
  mounted() {
    this.getList();
    this.changeWorkTab(0);
  },
  methods: {
    changePlanTab( tab) {
		console.log(tab);
      this.plan.tab = tab.label;
      getCityColumnGraphApi(this.plan.tab, 5).then(res => {
        this.cityColumnGraph = res.data
        this.drawColumn();
      })
    },
    changeWorkTab(index) {
      this.workOrder.tabIndex = index;
      this.workOrder.currentData = this.workOrder.list[index];
    },
    drawColumn(data) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(
        document.getElementById("build-column")
      );
      const defaultData = [
        [
          5, 20, 36, 10, 18, 20, 5, 20, 32, 10, 10, 20, 7, 20, 36, 10, 8,
        ],
        [
          5, 8, 36, 18, 10, 20, 20, 32, 10, 10, 20, 7, 20, 32, 10, 10, 20,
        ]
      ]
      data = data || defaultData
      // 绘制图表
      myChart.setOption({
        color: ["#2478F2", "#84B7F9"],
        legend: {
          show: true,
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "0",
          containLabel: true,
        },
        tooltip: {},
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          data: this.cityColumnGraph.xData,
        },
        yAxis: {},
        series: [
          {
            barGap: "0%",
            name: "本月",
            type: "bar",
            barWidth: 13,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "rgb(158,207,255)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgb(95,103,255)", // 100% 处的颜色
                  },
                ]),
              },
            },
            showBackground: true,
            data: this.cityColumnGraph.yData[0],
            backgroundStyle: {
              color: "rgba(217, 222, 245,0.2)",
            },
          },
          {
            barGap: "0%",
            name: "上月",
            type: "bar",
            barWidth: 13,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "rgb(254,214,162)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgb(253,166,199)", // 100% 处的颜色
                  },
                ]),
              },
            },
            showBackground: true,
            data: this.cityColumnGraph.yData[0],
            backgroundStyle: {
              color: "rgba(217, 222, 245,0.2)",
            },
          },
        ],
      });
        window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    buildRingParams({
      data,
      title,
      color
    }) {
      return {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let html = '';
            html = '<div style="color: #000;font-size: 14px;background:#fff;border:none;padding:10px;">' +
              '<div style="margin-bottom:4px;">' +
              '<span style="background:' + params.color + ';border-radius:50%;width:10px;height:10px;display:inline-block;line-height:14px;"></span>' +
              '<span style="display:line-block;margin-left:14px;line-height:14px;">' + params.name + '</span>' +
              '</div>' +
              '<div>' +
              '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">' + params.value + '</span>' +
              '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">' + params.percent + '%</span>' +
              '</div>' +
              '</div>';
            return html
          },
          extraCssText: 'background: #fff; border-radius: 5;color: #000;',
        },
        legend: {
          orient: "horizontal",
          right: "center",
          bottom: "0",
          itemWidth: 8,
          itemHeight: 8,
          icon: "circle",
        },
        series: [{
          name: "占比",
          type: "pie",
          radius: ["50%", '75%'],
          avoidLabelOverlap: false,
          color,
          data: [], //数据
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
            label: {
              show: false,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          data,
        },],
      }
    },
    drawRing1() {
      const buildEndChart = this.$echarts.init(
        document.getElementById("build-1")
      );
      let options = this.buildRingParams({
        color:["#666eff","#7b9dff"],
        title: '服务部',
        data: this.stationPie[0],
      })
      buildEndChart.setOption(options);
    },
    drawRing2() {
      const buildEndChart = this.$echarts.init(
        document.getElementById("build-2")
      );
      let options = this.buildRingParams({
        color:["#a6ccfb","#91dff5"],
        title: '规划部',
        data: this.stationPie[1],
      })
      buildEndChart.setOption(options);
    },
    drawRing3() {
      const buildEndChart = this.$echarts.init(
        document.getElementById("build-3")
      );
      let options = this.buildRingParams({
        color:["#ffa09a","#fbc27d"],
        title: '建设部',
        data: this.stationPie[2],
      })
      buildEndChart.setOption(options);
    },
    drawRing4() {
      const buildEndChart = this.$echarts.init(
        document.getElementById("build-4")
      );
      let options = this.buildRingParams({
        color:["#a6ccfb","#ffda8c"],
        title: "维护部",
        data: this.stationPie[3],
      })
      buildEndChart.setOption(options);
    },
    drawRing5() {
      const buildEndChart = this.$echarts.init(
        document.getElementById("build-5")
      );
      let options = this.buildRingParams({
        color:["#7b9dff","#fbc27d"],
        title: "优化部",
        data: this.stationPie[4],
      })
      buildEndChart.setOption(options);
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const buildStatsChart = this.$echarts.init(
        document.getElementById("build-stats")
      );
      // 绘制图表
      buildStatsChart.setOption({
          color: ['rgba(130,151,255,1)', 'rgba(255,154,192,1)', 'rgba(255,196,133,1)'
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["工单数", "完结数", "催办数"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [{
          type: "category",
          boundaryGap: false,
          data: this.stationLineGraph.xData,
        },],
        yAxis: [{
          type: "value",
        },],
        series: [{
          name: "工单数",
          type: "line",
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(130,151,255,1)'
            },
            {
              offset: 1,
              color: 'rgba(130,151,255,0.1)'
            }
            ])
          },
          emphasis: {
            focus: "series",
          },
          data: this.stationLineGraph.yData[0],
        },
        {
          name: "完结数",
          type: "line",
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(255,154,192,1)'
            },
            {
              offset: 1,
              color: 'rgba(255,154,192,0.1)'
            }
            ])
          },
          emphasis: {
            focus: "series",
          },
          data: this.stationLineGraph.yData[1],
        },
        {
          name: "催办数",
          type: "line",
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(255,196,133,1)'
            },
            {
              offset: 1,
              color: 'rgba(255,196,133,0.1)'
            }
            ])
          },
          emphasis: {
            focus: "series",
          },
          data: this.stationLineGraph.yData[2],
        },
        ],
      });
        window.addEventListener("resize", function () {
        buildStatsChart.resize();
      });
    },
    drawRow() {
      const buildStatsChart = this.$echarts.init(
        document.getElementById("build-row")
      );
      // 绘制图表
      buildStatsChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let html = '';
            html = '<div style="color: #000;font-size: 14px;background:#fff;border:none;padding:10px;">' +
              '<div style="margin-bottom:4px;">' +
              '<span style="background:' + params.color.colorStops[1].color + ';border-radius:50%;width:10px;height:10px;display:inline-block;line-height:14px;"></span>' +
              '<span style="display:line-block;margin-left:14px;line-height:14px;">' + params.seriesName + '</span>' +
              '</div>' +
              '<div>' +
              '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">' + params.name + '</span>' +
              '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">' + params.value + '</span>' +
              '</div>' +
              '</div>';
            return html
          },
          extraCssText: 'background: #fff; border-radius: 5;color: #000;',
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#f3f5f7"],
            },
          },
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: ["#f3f5f7"],
            },
          },
          data: this.orderColumnGraph.xData,
        },
        series: [{
          name: "近三十天工单类型",
          type: "bar",
          barWidth: 20,
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#a0cdff", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#656dff", // 100% 处的颜色
                },
              ]),
            },
          },
          data: this.orderColumnGraph.yData,
        },],
      });
      window.addEventListener("resize", function () {
        buildStatsChart.resize();
      });
    },
    getList() {
      getOrderStatisticApi(5).then((res) => {
        res.data.forEach(i => {
          this.stationLineGraph.xData.push(i.data)
          this.stationLineGraph.yData[0].push(i.orderCount)
          this.stationLineGraph.yData[1].push(i.urgeCount)
          this.stationLineGraph.yData[2].push(i.endCount)
        });
        this.drawLine();
      });
      getFwPieApi().then(res => {
        this.stationPie = res.data
        this.drawRing1()
        this.drawRing2()
        this.drawRing3()
        this.drawRing4()
        this.drawRing5()
      })
      getOrderByOrgApi().then(res => {
        this.list = res.data
      })
      getWorkOrderIssusesApi(5).then(res => {
        this.plan.tabs = res.data
        this.plan.tab = res.data[0]
        getCityColumnGraphApi(this.plan.tab, 5).then(res => {
          this.cityColumnGraph = res.data
          this.drawColumn();
        })
      })

      getOrderColumnGraphApi(5).then(res => {
        this.orderColumnGraph = res.data
        this.drawRow();
      })
    },
    onClose() {
      this.dialogFormVisible = false;
      this.$refs["elForm"].resetFields();
      this.formData = {};
    },
    close() {
      this.$emit("update:visible", false);
    },
    link(row) {
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.end-stats {
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 30px;
}

.end-stats-monitor {
  flex: 1;
  height: 210px;
}

.btn-group-full {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 64px;

  .tab-btn {
    padding: 0 47px;
    border: 1px solid #409eff;
    color: #409eff;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;

    // border-right: none;
    &:last-child {
      border-right: 1px solid #409eff;
    }

    &.active {
      color: #fff;
      background: #409eff;
    }
  }
}

.build-container {
  height: 100%;
  overflow-y: auto;
}

.mt--1 {
  margin-top: -1px;
}
</style>
