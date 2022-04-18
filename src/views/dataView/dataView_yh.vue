<template>
  <div class="echart">
    <!-- <img src='../assets/images/2.png' /> -->
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <div class="card_title">
              <span class="fw">近三十日规划工单统计</span>
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
          <el-row>
            <el-col :span="5">
              <pieWithScrollableLegend
                :alarmData="alarmData1"
                :labelData="labelData1"
                :defaultData="{ num: 1, width: '100%' }"
              />
            </el-col>
            <el-col :span="5">
              <pieWithScrollableLegend
                :alarmData="alarmData2"
                :labelData="labelData2"
                :defaultData="{ num: 2, width: '100%' }"
              />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    <el-col :span="24">
        <!-- 表格组件 start -->
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <span>工单列表</span>
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
      <el-col :span="24">
        <!-- tab标签页切换 start -->
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <span>工单原因分析</span>
          </div>
          <div class="text">
            <el-tabs
              v-model="editableTabsValue"
              class="elTabsNav"
              @tab-click="tabsHandleClick"
            >
              <el-tab-pane
                v-for="(item, index) in tabDatas"
                :key="index"
                :label="item.tabTitle"
                :name="item.tabIdx"
              ></el-tab-pane>
            </el-tabs>
            <div>
              <simpleExampleOfDataset 
                :chartData="tabData"
                :idRef="'simpleExampleOfDataset1'"
                :barColorsLg="chartColorLg"
              />
            </div>
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
import "@/common/css/common.scss";
import stackedAreaChart from "@/components/echart/stackedAreaChart"; //折线图
import simpleExampleOfDataset from "@/components/echart/simpleExampleOfDataset"; //柱状图
import pieWithScrollableLegend from "@/components/echart/pieWithScrollableLegend"; //饼图
import effectScatterChart from "@/components/echart/effectScatterChart"; //散点图
import basicRadarChart from "@/components/echart/basicRadarChart"; //雷达图
import echartMap from "@/components/echart/echartMap"; //横排柱状图
import listTable from "@/components/echart/listTable"; //表格组件

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
      // tab数据
      tabDatas: [
        {
          tabTitle: "无建设规划，无优化手段"
        },
        {
          tabTitle: "扩容"
        },
        {
          tabTitle: "参数配置问题"
        },
        {
          tabTitle: "邻区漏配"
        },
        {
          tabTitle: "网络局部负荷过重"
        },
        {
          tabTitle: "越区覆盖"
        },
        {
          tabTitle: "安装手机伴侣"
        },
        {
          tabTitle: "外界干扰"
        },
        {
          tabTitle: "手机伴侣故障"
        },
        {
          tabTitle: "导频污染"
        }
      ],
tabData:{taskData:{name:"本月",data:[{x:"武汉",y:12,},{x:"黄石",y:20,},{x:"鄂州",y:12,},{x:"黄冈",y:24,},{x:"咸宁",y:34,},{x:"孝感",y:13,},{x:"随州",y:13,},{x:"襄阳",y:13,},{x:"十堰",y:13,},{x:"神农架",y:13,},{x:"恩施土家族自治区",y:13,},{x:"宜昌",y:13,},{x:"荆州",y:13,},{x:"潜江",y:13,},{x:"天门",y:13,},{x:"仙桃",y:13,},],},taskData1:{name:"上月",data:[{x:"武汉",y:12,},{x:"黄石",y:20,},{x:"鄂州",y:12,},{x:"黄冈",y:24,},{x:"咸宁",y:34,},{x:"孝感",y:13,},{x:"随州",y:13,},{x:"襄阳",y:13,},{x:"十堰",y:13,},{x:"神农架",y:13,},{x:"恩施土家族自治区",y:13,},{x:"宜昌",y:13,},{x:"荆州",y:13,},{x:"潜江",y:13,},{x:"天门",y:13,},{x:"仙桃",y:13,},],},},
      // 表格数据 start
      listTableModule: {
        moduletype: {
          operation: "操作",
          operation1: true,
          operation2: true,
        },
        moduleName: [
          { name: "工单类型", code: "text1", type: "text" },
          { name: "工单所属区域", code: "text2", type: "text" },
          { name: "事故分析", code: "text3", type: "text" },
          { name: "预警对象", code: "text4", type: "text" },
          { name: "投诉时间", code: "text5", type: "text" },
        ],
        moduleValue: [
          {
            text1: "大面积投诉",
            text2: "恩施土家族自治州",
            text3: "扩容",
            text4: "黄冈市蕲春县刘河镇",
            text5: "2021年12月13日 14:22:23",
          },
          {
            text1: "重复基站投诉",
            text2: "恩施土家族自治州",
            text3: "邻区漏配",
            text4: "598233 ",
            text5: "2021年12月13日 12:21:35",
          },
          {
            text1: "疑难投诉",
            text2: "恩施土家族自治州",
            text3: "越区覆盖",
            text4: "153****8813",
            text5: "2021年12月13日 08:10:43",
          },
          {
            text1: "越级投诉",
            text2: "恩施土家族自治州",
            text3: "参数配置问题",
            text4: "177****5204",
            text5: "2021年12月12日 15:12:55",
          },
          {
            text1: "重点关注人群投诉",
            text2: "恩施土家族自治州",
            text3: "导频污染",
            text4: "159****9940",
            text5: "2021年12月11日 17:31:26",
          },
        ],
      },
      // 表格数据 end

      //饼图数据  start
      alarmData1:[{x:"派单数",y:80,},{x:"催单数",y:20,},],
      alarmData2:[{x:"24小时内解决工单",y:80,},{x:"非24小时内解决工单",y:20,},],
      //饼图数据  end

      //饼图配置项  start
      labelData1:{radius:["34%","60%"],avoidLabelOverlap:false,title:"",legend:["horizontal","center","0"],color:["#666eff","#7b9dff"],},
      labelData2:{radius:["34%","60%"],avoidLabelOverlap:false,title:"",legend:["horizontal","center","0"],color:["#a6ccfb","#91dff5"],},
      //饼图配置项  end

      //折线图
      stackedData: {name:"stackedAreaChart",data_x:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,],data_y:[{name:"工单数",data:[15,14,16,17,16,16,12,14,14,14,15,17,20,19,17,14,15,16,16,18,21,20,21,18,21,20,16,20,17,16],},{name:"完结数",data:[16, 17, 16, 15, 15, 17 ,16 ,14 ,15 ,17, 14 ,17 ,14 ,15, 16 ,16, 16, 14, 15, 16, 14, 17, 16, 17, 16, 15, 16, 16, 17, 15],},{name:"催单数",data:[11,12,13,14,15,16,17,18,19,18,18,19,19,18,18,18,16,16,15,16,18,17,17,18,18,18,16,17,14,16],},],},
      chartDataRow:{taskData:{name:"近三十天工单类型",data:[{x:"无建设规划，无优化手段",y:13,},{x:"扩容",y:34,},{x:"参数配置问题",y:24,},{x:"邻区漏配",y:12,},{x:"网络局部负荷过重",y:20,},{x:"越区覆盖",y:10,},{x:"安装手机伴侣",y:13,},{x:"外界干扰",y:25,},{x:"手机伴侣故障",y:33,}]},style:{height: '350px' }},
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
      console.log(tab, event);
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
