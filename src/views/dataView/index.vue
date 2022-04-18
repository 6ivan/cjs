<template>
  <div class="echart">
    <!-- <img src='../assets/images/2.png' /> -->
    <el-row>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>柱状图</span>
          </div>
          <div class="text item">
            <simpleExampleOfDataset
              :chartData="chartData"
              :idRef="'simpleExampleOfDataset'"
              :barColorsLg="chartColorLg"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>横排柱状图</span>
          </div>
          <div class="text item">
            <echartMap
              :idRef="'echartMap'"
              :chartData="chartDataRow"
              :barColorsLg="chartColorLg"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import stackedAreaChart from "@/components/echart/stackedAreaChart"; //折线图
import simpleExampleOfDataset from "@/components/echart/simpleExampleOfDataset"; //柱状图
// import simpleExampleOfDataset1 from "@/components/echart/simpleExampleOfDataset1"; //柱状图
import pieWithScrollableLegend from "@/components/echart/pieWithScrollableLegend"; //饼图
import effectScatterChart from "@/components/echart/effectScatterChart"; //散点图
import basicRadarChart from "@/components/echart/basicRadarChart"; //雷达图
import echartMap from "@/components/echart/echartMap"; //横排柱状图

export default {
  name: "echart",
  components: {
    //引入已配置好对echart图形组件
    stackedAreaChart, //折线图
    simpleExampleOfDataset, //柱状图
    // simpleExampleOfDataset1,
    pieWithScrollableLegend, //饼图
    effectScatterChart, //散点图
    basicRadarChart, //雷达图
    echartMap, //横排柱状图
  },
  data() {
    return {
      chartData: {},
      chartDataRow: {},
      chartColorLg: [
        {
          lgStart: "#a0cdff",
          lgEnd: "#656dff",
        },
        {
          lgStart: "#ffd7ab",
          lgEnd: "#ffaaca",
        },
      ],
    };
  },

  mounted() {
    this.getChartdata();
  },

  methods: {
    getChartdata() {
      this.chartData = {
        taskData: {
          name: "本月",
          data: [
            {
              x: "一月",
              y: 10,
            },
            {
              x: "二月",
              y: 20,
            },
            {
              x: "三月",
              y: 12,
            },
            {
              x: "四月",
              y: 24,
            },
            {
              x: "五月",
              y: 34,
            },
            {
              x: "六月",
              y: 13,
            },
          ],
        },
        taskData1: {
          name: "下月",
          data: [
            {
              x: "一月",
              y: 10,
            },
            {
              x: "二月",
              y: 20,
            },
            {
              x: "三月",
              y: 12,
            },
            {
              x: "四月",
              y: 24,
            },
            {
              x: "五月",
              y: 34,
            },
            {
              x: "六月",
              y: 13,
            },
          ],
        },
      };

      this.chartDataRow = {
        taskData: {
          name: "本月",
          data: [
            {
              x: "一月",
              y: 10,
            },
            {
              x: "二月",
              y: 20,
            },
            {
              x: "三月",
              y: 12,
            },
            {
              x: "四月",
              y: 24,
            },
            {
              x: "五月",
              y: 34,
            },
            {
              x: "六月",
              y: 13,
            },
          ],
        },
      };
    },
  },
};
</script>

<style scoped>
.box-card {
  margin: 10px;
}
</style>
