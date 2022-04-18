<template>
  <div class="echart">
    <!-- <img src='../assets/images/2.png' /> -->
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <div class="card_title">
              <span class="fw" style="font-size:800">近三十日规划工单统计</span>
              <div><el-button type="small" class="fontsmall">下载</el-button></div>
            </div>
          </div>
          <div class="text item">
            <stackedAreaChart :data="stackedData" style="height: 300px" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <span>部门完结率</span>
          </div>
          <div class="text item">
            <el-row>
              <el-col :span="10">
                <el-row>
                  <el-col :span="12">
                    <pieWithScrollableLegend
                      :alarmData="alarmData"
                      :labelData="labelData"
                      :defaultData="{ num: 1, width: '100%' }"
                    />
                  </el-col>
                  <el-col :span="12">
                    <pieWithScrollableLegend
                      :alarmData="alarmData1"
                      :labelData="labelData1"
                      :defaultData="{ num: 2, width: '100%' }"
                    />
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="14">
                <el-row>
                  <el-col :span="8">
                    <pieWithScrollableLegend
                      :alarmData="alarmData2"
                      :labelData="labelData2"
                      :defaultData="{ num: 3, width: '100%' }"
                    />
                  </el-col>
                  <el-col :span="8">
                    <pieWithScrollableLegend
                      :alarmData="alarmData3"
                      :labelData="labelData3"
                      :defaultData="{ num: 4, width: '100%' }"
                    />
                  </el-col>
                  <el-col :span="8">
                    <pieWithScrollableLegend
                      :alarmData="alarmData4"
                      :labelData="labelData4"
                      :defaultData="{ num: 5, width: '100%' }"
                    />
                  </el-col>
                  <el-col :span="8">
                    <pieWithScrollableLegend
                      :alarmData="alarmData5"
                      :labelData="labelData5"
                      :defaultData="{ num: 6, width: '100%' }"
                    />
                  </el-col>
                  <el-col :span="8">
                    <pieWithScrollableLegend
                      :alarmData="alarmData6"
                      :labelData="labelData6"
                      :defaultData="{ num: 7, width: '100%' }"
                    />
                  </el-col>
                  <el-col :span="8">
                    <pieWithScrollableLegend
                      :alarmData="alarmData7"
                      :labelData="labelData7"
                      :defaultData="{ num: 8, width: '100%' }"
                    />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <!-- 表格组件 start -->
        <el-card class="box-card elTabsNavDiv">
          <div slot="header">
            <el-tabs
              v-model="editableTabsValue"
              class="elTabsNav"
              @tab-click="tabsHandleClick"
            >
              <el-tab-pane label="催办工单" name="0"></el-tab-pane>
              <el-tab-pane label="紧急工单" name="1"></el-tab-pane>
              <el-tab-pane label="延时工单" name="2"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="text item">
            <listTable
              :listTableModule="listTableModule"
              @clickListTable="clickListTable($event)"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <!-- tab标签页切换 start -->
        <el-card class="box-card elTabsNavDiv">
          <div slot="header">
            <el-tabs
              v-model="editableTabsValue"
              class="elTabsNav"
              @tab-click="tabsHandleClick"
            >
              <el-tab-pane label="无规划已上报需求" name="0"></el-tab-pane>
              <el-tab-pane label="有规划未立项" name="1"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="text">
            <simpleExampleOfDataset
              :chartData="chartData"
              :idRef="'simpleExampleOfDataset'"
              :barColorsLg="chartColorLg"
            />
          </div>
        </el-card>
        <!-- tab标签页切换 end -->
      </el-col>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <span>工单类型分析</span>
          </div>
          <div class="text item">
            <echartMap
              :idRef="'echartMap1'"
              :chartData="chartDataRow1"
              :barColorsLg="chartColorLg"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import "../../common/css/common.scss";
import stackedAreaChart from "../../components/echart/stackedAreaChart"; //折线图
import simpleExampleOfDataset from "../../components/echart/simpleExampleOfDataset"; //柱状图
import pieWithScrollableLegend from "../../components/echart/pieWithScrollableLegend"; //饼图
import echartMap from "../../components/echart/echartMap"; //横排柱状图
import listTable from "../../components/echart/listTable"; //表格组件

export default {
  name: "echart",
  components: {
    //引入已配置好对echart图形组件
    stackedAreaChart, //折线图
    simpleExampleOfDataset, //柱状图
    pieWithScrollableLegend, //饼图
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
          { name: "预警类型", code: "text1", type: "text" },
          { name: "工单所属区域", code: "text2", type: "text" },
          { name: "事故分析", code: "text3", type: "text" },
          { name: "关键信息", code: "text4", type: "text" },
          { name: "投诉时间", code: "text5", type: "text" },
        ],
        moduleValue: [
          {
            text1: "大面积投诉",
            text2: "黄冈",
            text3: "有规划已立项，室外宏站",
            text4: "黄冈市蕲春县刘河镇",
            text5: "2021年12月13日 14:22:23",
          },
          {
            text1: "重复基站投诉",
            text2: "宜昌",
            text3: "有规划已立项，室分站点（含室外分布式系统）",
            text4: "598233 ",
            text5: "2021年12月13日 12:21:35",
          },
          {
            text1: "疑难投诉",
            text2: "武汉",
            text3: "有规划已立项，室外宏站",
            text4: "153****8813",
            text5: "2021年12月13日 08:10:43",
          },
          {
            text1: "越级投诉",
            text2: "荆州",
            text3: "有规划已立项，室分站点（含室外分布式系统）",
            text4: "177****5204",
            text5: "2021年12月12日 15:12:55",
          },
          {
            text1: "重点关注人群投诉",
            text2: "武汉",
            text3: "有规划已立项，室外宏站",
            text4: "159****9940",
            text5: "2021年12月11日 17:31:26",
          }
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
        title: "用户投诉需求",
        legend: ["vertical", "right", "25%"],
        color: ["#ffdc8e", "#a1cfff"],
      },
      labelData5: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "需求发布",
        legend: ["vertical", "right", "25%"],
        color: ["#6b6eff", "#8198ff", "#9dd3ff", "#70deff", "#ffd892"],
      },
      labelData6: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "场景分布",
        legend: ["vertical", "right", "25%"],
        color: ["#788ff7", "#a1d0ff", "#80d9fb", "#fd9b98", "#ffc083"],
      },
      labelData7: {
        radius: "50%",
        avoidLabelOverlap: true,
        title: "场景分布",
        legend: ["vertical", "right", "25%"],
        color: ["#797ce7", "#7991eb", "#ff998f"],
      },
      //饼图配置项  end

      //折线图
      stackedData: { name: "stackedAreaChart", data_x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], data_y: [{ name: "工单数", data: [10, 11, 11, 10, 10, 12, 10, 10, 11, 12, 13, 12, 12, 11, 10, 10, 11, 10, 9, 8, 10, 11, 12, 13, 14, 15, 14, 16, 17, 16], }, { name: "完结率", data: [11, 12, 13, 14, 15, 16, 17, 18, 19, 18, 18, 19, 19, 18, 18, 18, 16, 16, 15, 16, 18, 17, 17, 18, 18, 18, 16, 17, 14, 16], }, { name: "催办数", data: [15, 14, 16, 17, 16, 16, 12, 14, 14, 14, 15, 17, 20, 19, 17, 14, 15, 16, 16, 18, 21, 20, 21, 18, 21, 20, 16, 20, 17, 16], }], },
      chartData: { taskData: { name: "本月", data: [{ x: "武汉", y: 10, }, { x: "黄石", y: 20, }, { x: "鄂州", y: 12, }, { x: "黄冈", y: 24, }, { x: "咸宁", y: 34, }, { x: "随州", y: 13, }, { x: "襄阳", y: 10, }, { x: "十堰", y: 20, }, { x: "神农架", y: 12, }, { x: "恩施", y: 24, }, { x: "宜昌", y: 34, }, { x: "荆州", y: 13, }, { x: "荆门", y: 12, }, { x: "潜江", y: 24, }, { x: "天门", y: 34, }, { x: "仙桃", y: 13, },], }, taskData1: { name: "上月", data: [{ x: "武汉", y: 10, }, { x: "黄石", y: 27, }, { x: "鄂州", y: 12, }, { x: "黄冈", y: 24, }, { x: "咸宁", y: 33, }, { x: "随州", y: 13, }, { x: "襄阳", y: 16, }, { x: "十堰", y: 20, }, { x: "神农架", y: 12, }, { x: "恩施", y: 24, }, { x: "宜昌", y: 34, }, { x: "荆州", y: 13, }, { x: "荆门", y: 12, }, { x: "潜江", y: 24, }, { x: "天门", y: 34, }, { x: "仙桃", y: 13, },], }, },

      chartDataRow1: { taskData: { name: "近三十天工单类型", data: [{ x: "无建设规划，无优化手段", y: 13, }, { x: "扩容", y: 34, }, { x: "参数配置问题", y: 24, }, { x: "邻区漏配", y: 12, }, { x: "网络局部负荷过重", y: 20, }, { x: "越区覆盖", y: 10, }, { x: "安装手机伴侣", y: 13, }, { x: "外界干扰", y: 25, }, { x: "手机伴侣故障", y: 33, }] }, style: { height: '350px' } },
      chartData1: { taskData: { name: "本月", data: [{ x: "武汉", y: 20, }, { x: "黄石", y: 30, }, { x: "鄂州", y: 22, }, { x: "黄冈", y: 34, }, { x: "咸宁", y: 24, }, { x: "随州", y: 43, }, { x: "襄阳", y: 16, }, { x: "十堰", y: 35, }, { x: "神农架", y: 12, }, { x: "恩施", y: 45, }, { x: "宜昌", y: 65, }, { x: "荆州", y: 52, }, { x: "荆门", y: 34, }, { x: "潜江", y: 42, }, { x: "天门", y: 34, }, { x: "仙桃", y: 43, },], }, taskData1: { name: "上月", data: [{ x: "武汉", y: 53, }, { x: "黄石", y: 22, }, { x: "鄂州", y: 12, }, { x: "黄冈", y: 24, }, { x: "咸宁", y: 33, }, { x: "随州", y: 13, }, { x: "襄阳", y: 16, }, { x: "十堰", y: 20, }, { x: "神农架", y: 12, }, { x: "恩施", y: 24, }, { x: "宜昌", y: 34, }, { x: "荆州", y: 13, }, { x: "荆门", y: 12, }, { x: "潜江", y: 24, }, { x: "天门", y: 34, }, { x: "仙桃", y: 13, },], }, },
      chartDataRow: { taskData: { name: "基站数", data: [{ x: "SA宏站", y: 10, }, { x: "SA室内站", y: 20, }, { x: "LTE宏站", y: 12, }] }, style: { height: '200px' } },
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
      console.log(this.editableTabsValue)
    },
    //tabs标签页切换 end
  },
};
</script>

<style scoped>
.box-card {
  margin: 10px;
}
</style>
