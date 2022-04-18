<!--数据查看-维护-->
<template>
  <div class="build-container">
    <div class="p-dbox">
      <h3>近三十日维护工单统计</h3>
      <div id="build-stats" :style="{ width: '100%', height: '300px' }" />
    </div>
    <div class="p-dbox">
      <h3>部门完结率</h3>
      <div class="end-stats">
        <div id="build-end" class="end-stats-monitor" />
        <div
          style="display: none"
          id="build-monitor"
          class="end-stats-monitor"
        />
        <div id="build-work" class="end-stats-monitor" />
      </div>
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
        <el-table-column prop="workOrderNumber" label="工单编号">
        </el-table-column>
        <el-table-column label="工单类型">
          <template slot-scope="scope">{{
            workOrderTypeList[scope.row.workOrderType]
          }}</template>
        </el-table-column>
        <el-table-column prop="region" label="所属区域"> </el-table-column>
        <el-table-column label="工单状态">
          <template slot-scope="scope">{{
            workOrderStateList[scope.row.workOrderState]
          }}</template>
        </el-table-column>
        <el-table-column prop="complaintTime" label="投诉时间">
        </el-table-column>
        <el-table-column label="预警对象">
          <template slot-scope="scope">{{ workOrderType(scope.row) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="text" size="small">接受</el-button>
            <el-button type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="page"
          :page-size="size"
          :page-sizes="[5, 10, 15, 20]"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div class="p-dbox">
      <div class="p-tab">
        <div
          class="p-tab-li"
          v-for="(tab, index) in plan.tabs"
          @click="changePlanTab(index, tab)"
          :key="index"
          :class="{ active: index === plan.tabIndex }"
        >
          {{ tab }}
        </div>
      </div>
      <div
        id="build-column"
        class="p-chart"
        :style="{ width: '100%', height: '250px' }"
      />
    </div>
    <div class="p-dbox">
      <h3>工单类型分析</h3>
      <div id="build-row" :style="{ width: '100%', height: '300px' }" />
    </div>
  </div>
</template>

<script>
import FilterList from "@/mixins/FilterList";
import {
  getOrderStatisticApi,
  getWhPieApi,
  getUrgeOrderPageApi,
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
      workOrderTypeList: ['疑难工单', '专项工单', '贬损工单', '重复基站', '重复用户'],
      workOrderStateList: ['待处理', '已接收', '已解决', '未解决'],
      stationLineGraph: {},
      stationLineGraph: {
        xData: [],
        yData: [
          [],
          [],
          []
        ]
      },
      stationPie: [],
      orderColumnGraph: {},
      workOrder: {
        tabIndex: 0,
        tabs: ["催办工单", "紧急工单", "延期工单"],
        currentData: [],
        list: [
          [{
            orderNo: "07102900002021062600158",
            area: "恩施土家族自治州",
            no: "扩容",
            isrep: false,
            time: "2021年12月13日 14:22:23",
          },
          {
            orderNo: "07102900002021062600158",
            area: "恩施土家族自治州",
            no: "邻区配漏",
            isrep: false,
            time: "2021年12月13日 14:22:23",
          },
          {
            orderNo: "07102900002021062600158",
            area: "恩施土家族自治州",
            no: "越区覆盖",
            isrep: false,
            time: "2021年12月13日 14:22:23",
          },
          ],
          [{
            orderNo: "07102900002021062600158",
            area: "恩施土家族自治州",
            no: "有规划已立项，室外宏站",
            isrep: false,
            time: "2021年12月13日 14:22:23",
          },],
          [{
            orderNo: "07102900002021062600158",
            area: "恩施土家族自治州",
            no: "有规划已立项，室外宏站",
            isrep: false,
            time: "2021年12月13日 14:22:23",
          },],
        ],
      },
    };
  },
  created() { },
  mounted() {
    this.getList();
    this.changeWorkTab(0);
  },
  methods: {
    changePlanTab(index, tab) {
      this.plan.tabIndex = index;
      this.plan.tab = tab;
      this.plan.currentData = this.plan.list[index];
      getCityColumnGraphApi(this.plan.tab, 3).then(res => {
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
    drawRing1() {
      const buildEndChart = this.$echarts.init(
        document.getElementById("build-end")
      );
      buildEndChart.setOption({
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
          radius: ["40%", '60%'],
          avoidLabelOverlap: false,
          color:["#666eff","#7b9dff"],
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
          data: this.stationPie[0],
        },
        ],
      });
    },
    drawRing3() {
      const buildMonitorChart = this.$echarts.init(
        document.getElementById("build-work")
      );
      buildMonitorChart.setOption({
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
          radius: ["40%", '60%'],
          avoidLabelOverlap: false,
          color:["#a6ccfb","#91dff5"],
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
          data: this.stationPie[1],
        },
        ],
      });
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
          name: "基站数",
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
    workOrderType(a) {
      console.log(a.workOrderType);
      if (a.workOrderType < 4) {
        return a.region
      } else if (a.workOrderType == 4) {
        return a.baseNumber
      } else if (a.workOrderType == 5) {
        return a.telephone
      }
    },
    getList() {
      getOrderStatisticApi(3).then((res) => {
        res.data.forEach(i => {
          this.stationLineGraph.xData.push(i.data)
          this.stationLineGraph.yData[0].push(i.orderCount)
          this.stationLineGraph.yData[1].push(i.urgeCount)
          this.stationLineGraph.yData[2].push(i.endCount)
        });
        this.drawLine();
      });
      getWhPieApi().then(res => {
        this.stationPie = res.data
        this.drawRing1()
        this.drawRing3()
      })
      getUrgeOrderPageApi(this.page, this.size, 3).then(res => {
        this.total = res.data.total;
        this.size = res.data.size;
        this.page = res.data.current;
        this.list = res.data.records
        this.list.forEach(i => {
          i.complaintTime = i.complaintTime.substring(0, 10);
        })
      })
      getWorkOrderIssusesApi(3).then(res => {
        this.plan.tabs = res.data
        this.plan.tab = res.data[0]
        getCityColumnGraphApi(this.plan.tab, 3).then(res => {
          this.cityColumnGraph = res.data
          this.drawColumn();
        })
      })

      getOrderColumnGraphApi(3).then(res => {
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
}

.end-stats-monitor {
  width: 240px;
  height: 270px;
}

.btn-group-full {
  width: 100%;
  display: flex;
  height: 32px;

  .tab-btn {
    flex: 1;
    border: 1px solid #409eff;
    color: #409eff;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    border-right: none;

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
</style>
