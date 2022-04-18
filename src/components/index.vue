<template>
  <div class="echart">
    <!-- <img src='../assets/images/2.png' /> -->
    <el-row>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <span>折线图</span>
          </div>
          <div class="text item">
            <stackedAreaChart :data="stackedData" style="height: 300px" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
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
          <div slot="header" class="clearfix boxCardTitle">
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
    <el-row>
      <el-col :span="10">
        <div class="item">
          <pieWithScrollableLegend
            :alarmData="alarmData"
            :labelData="labelData"
            :defaultData="{ num: 1, width: '100%' }"
          />
          <pieWithScrollableLegend
            :alarmData="alarmData1"
            :labelData="labelData1"
            :defaultData="{ num: 2, width: '100%' }"
          />
        </div>
      </el-col>
      <el-col :span="14">
        <div class="items">
          <pieWithScrollableLegend
            :alarmData="alarmData2"
            :labelData="labelData2"
            :defaultData="{ num: 3, width: '33%' }"
          />
          <pieWithScrollableLegend
            :alarmData="alarmData3"
            :labelData="labelData3"
            :defaultData="{ num: 4, width: '33%' }"
          />
          <pieWithScrollableLegend
            :alarmData="alarmData4"
            :labelData="labelData4"
            :defaultData="{ num: 5, width: '33%' }"
          />
          <pieWithScrollableLegend
            :alarmData="alarmData5"
            :labelData="labelData5"
            :defaultData="{ num: 6, width: '33%' }"
          />
          <pieWithScrollableLegend
            :alarmData="alarmData6"
            :labelData="labelData6"
            :defaultData="{ num: 7, width: '33%' }"
          />
          <pieWithScrollableLegend
            :alarmData="alarmData7"
            :labelData="labelData7"
            :defaultData="{ num: 8, width: '33%' }"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <!-- tab标签页切换 start -->
        <el-card class="box-card elTabsNavDiv">
          <div slot="header">
            <el-tabs
              v-model="editableTabsValue"
              class="elTabsNav"
              @tab-click="tabsHandleClick"
            >
              <el-tab-pane label="用户管理" name="0"></el-tab-pane>
              <el-tab-pane label="配置管理" name="1"></el-tab-pane>
              <el-tab-pane label="角色管理" name="2"></el-tab-pane>
              <el-tab-pane label="定时任务补偿" name="3"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="text item">
            <div v-if="editableTabsValue == '0'">0</div>
            <div v-else-if="editableTabsValue == '1'">1</div>
          </div>
        </el-card>
        <!-- tab标签页切换 end -->
      </el-col>
      <el-col :span="24">
        <!-- 表格组件 start -->
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <span>近三十日规划工单统计</span>
          </div>
          <div class="text item">
            <listTable
              :listTableModule="listTableModule"
              @clickListTable="clickListTable($event)"
            />
          </div>
        </el-card>
      </el-col>
      <!-- 表格组件 end -->
    </el-row>
  </div>
</template>
<script>
import "../common/css/common.scss";
import stackedAreaChart from "./echart/stackedAreaChart"; //折线图
import simpleExampleOfDataset from "./echart/simpleExampleOfDataset"; //柱状图
import pieWithScrollableLegend from "./echart/pieWithScrollableLegend"; //饼图
import effectScatterChart from "./echart/effectScatterChart"; //散点图
import basicRadarChart from "./echart/basicRadarChart"; //雷达图
import echartMap from "./echart/echartMap"; //横排柱状图
import listTable from "./echart/listTable"; //表格组件

export default {
  name: "echart",
  components: {
    //引入已配置好对echart图形组件
    stackedAreaChart, //折线图
    simpleExampleOfDataset, //柱状图
    pieWithScrollableLegend, //饼图
    effectScatterChart, //散点图
    basicRadarChart, //雷达图
    echartMap, //横排柱状图
    listTable, //表格组件
  },
  data() {
    return {
      //tab标签页切换 start
      editableTabsValue: 0,
      //tab标签页切换 end

      // 表格数据 start
      listTableModule: {
        moduletype: {
          operation: "操作",
          operation1: true,
          operation2: true,
        },
        moduleName: [
          { name: "工单号", code: "text1", type: "text" },
          { name: "工单所属区域", code: "text2", type: "text" },
          { name: "事故分析", code: "text3", type: "text" },
          { name: "是否重复工单", code: "text4", type: "text" },
          { name: "投诉时间", code: "text5", type: "text" },
        ],
        moduleValue: [
          {
            text1: "07102900002021062600158",
            text2: "恩施土家族自治州",
            text3: "有规划已立项，室外宏站",
            text4: "否",
            text5: "2021年12月13日 14：00：00",
          },
        ],
      },
      // 表格数据 end

      //饼图数据  start
      alarmData: [
        {
          x: "本月",
          y: 80,
        },
        {
          x: "上月",
          y: 20,
        },
      ],
      alarmData1: [
        {
          x: "武汉",
          y: 40,
        },
        {
          x: "黄石",
          y: 5,
        },
        {
          x: "宜昌",
          y: 6,
        },
        {
          x: "襄阳",
          y: 6,
        },
        {
          x: "十堰",
          y: 3,
        },
        {
          x: "荆门",
          y: 10,
        },
        {
          x: "其他",
          y: 30,
        },
      ],
      alarmData2: [
        {
          x: "本月",
          y: 70,
        },
        {
          x: "上月",
          y: 30,
        },
      ],
      alarmData3: [
        {
          x: "本月",
          y: 70,
        },
        {
          x: "上月",
          y: 30,
        },
      ],
      alarmData4: [
        {
          x: "本月",
          y: 70,
        },
        {
          x: "上月",
          y: 30,
        },
      ],
      alarmData5: [
        {
          x: "郊区",
          y: 5,
        },
        {
          x: "农村",
          y: 20,
        },
        {
          x: "市区",
          y: 45,
        },
        {
          x: "城镇",
          y: 20,
        },
        {
          x: "乡镇",
          y: 10,
        },
      ],
      alarmData6: [
        {
          x: "风景区",
          y: 55,
        },
        {
          x: "高流量商务区",
          y: 15,
        },
        {
          x: "高流量住宅区",
          y: 10,
        },
        {
          x: "高校",
          y: 10,
        },
        {
          x: "其他",
          y: 10,
        },
      ],
      alarmData7: [
        {
          x: "室内分布",
          y: 40,
        },
        {
          x: "室外宏站",
          y: 35,
        },
        {
          x: "综合覆盖",
          y: 25,
        },
      ],
      //饼图数据  end

      //饼图配置项  start
      labelData: {
        radius: "60%", //饼图大小 数组形式为环形饼图
        avoidLabelOverlap: true, //是否启用防止标签重叠策略,环形图需要设置为true
        title: "本月投诉需求", //标题
        legend: ["horizontal", "center", "5%"], //图例样式 horizonta/vertical(横排/竖排)  center/right(居左/居右)  距离底部
        color: ["#fade9d", "#f5a79d"], //数据颜色
      },
      labelData1: {
        radius: ["34%", "60%"],
        avoidLabelOverlap: false,
        title: "本地网需求",
        legend: ["horizontal", "center", "0"],
        color: [
          "#666eff",
          "#7b9dff",
          "#a6ccfb",
          "#91dff5",
          "#ffa09a",
          "#fbc27d",
          "#ffda8c",
        ],
      },
      labelData2: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "网络覆盖需求",
        legend: ["vertical", "right", "25%"],
        color: ["#ff9d97", "#8298fe"],
      },
      labelData3: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "市场发展需求",
        legend: ["vertical", "right", "25%"],
        color: ["#ffc17e", "#666eff"],
      },
      labelData4: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "客户投诉需求",
        legend: ["vertical", "right", "25%"],
        color: ["#ffdc8e", "#a1cfff"],
      },
      labelData5: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "网络覆盖需求",
        legend: ["vertical", "right", "25%"],
        color: ["#6b6eff", "#8198ff", "#9dd3ff", "#70deff", "#ffd892"],
      },
      labelData6: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "市场发展需求",
        legend: ["vertical", "right", "25%"],
        color: ["#788ff7", "#a1d0ff", "#80d9fb", "#fd9b98", "#ffc083"],
      },
      labelData7: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "客户投诉需求",
        legend: ["vertical", "right", "25%"],
        color: ["#797ce7", "#7991eb", "#ff998f"],
      },
      //饼图配置项  end

      taskData: [
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
      //折线图
      stackedData: {
        name: "stackedAreaChart",
        data_x: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        data_y: [
          {
            name: "工单数",
            data: [0, 2, 4, 20, 6, 8, 10, 14, 18, 12, 16],
          },
          {
            name: "完结数",
            data: [3, 12, 5, 18, 8, 16, 12, 14, 16, 18, 10],
          },
          {
            name: "催办数",
            data: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
          },
        ],
      },

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
    //表格操作点击 sart
    clickListTable(pois) {
      //组件表格查看、编辑、删除按钮点击
      if (pois.num == "1") {
        console.log(pois.num);
      } else if (pois.num == "2") {
        console.log(pois.num);
      }
    },
    //表格操作点击 end

    //tabs标签页切换 sart
    tabsHandleClick(tab, event) {
      console.log(tab, event);
    },
    //tabs标签页切换 end
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
.item {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.items {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
