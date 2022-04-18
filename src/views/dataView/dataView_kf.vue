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
          <span>各部门完结率</span>
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
        <el-col :span="5">
          <pieWithScrollableLegend
            :alarmData="alarmData3"
            :labelData="labelData3"
            :defaultData="{ num: 3, width: '100%' }"
          />
        </el-col>
        <el-col :span="5">
          <pieWithScrollableLegend
            :alarmData="alarmData4"
            :labelData="labelData4"
            :defaultData="{ num: 4, width: '100%' }"
          />
        </el-col>
        <el-col :span="4">
          <pieWithScrollableLegend
            :alarmData="alarmData5"
            :labelData="labelData5"
            :defaultData="{ num: 5, width: '100%' }"
          />
        </el-col>
        </el-row>
      </el-card>
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
          tabTitle: "无规划已上报需求"
        },
        {
          tabTitle: "有规划未立项"
        },
        {
          tabTitle: "有规划已立项，室外宏站"
        },
        {
          tabTitle: "有规划已立项，室分站点（含室外分布式系统）"
        },
        {
          tabTitle: "停电（铁塔发电）"
        },
        {
          tabTitle: "停电（自维发电）"
        },
        {
          tabTitle: "基站板件故障"
        },
        {
          tabTitle: "隐性故障"
        },
        {
          tabTitle: "手机伴侣故障"
        },
        {
          tabTitle: "IPRAN板件故障"
        },
        {
          tabTitle: "光缆故障"
        },
        {
          tabTitle: "无建设规划"
        },
        {
          tabTitle: "扩容"
        },
        {
          tabTitle: "调整参数、天线角等"
        },
        {
          tabTitle: "安装手机伴侣"
        },
        {
          tabTitle: "外界干扰"
        },
        {
          tabTitle: "其他"
        },
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
          { name: "部门名称", code: "text1", type: "text" },
          { name: "催办次数", code: "text2", type: "text" },
          { name: "完单率", code: "text3", type: "text" },
        ],
        moduleValue: [
          {
            text1: "规划部",
            text2: "4",
            text3: "96.32%",
          },
          {
            text1: "建设部",
            text2: "7",
            text3: "93.44%",
          },
          {
            text1: "维护部",
            text2: "12",
            text3: "89.12%",
          },
          {
            text1: "优化部",
            text2: "24",
            text3: "84.23%",
          },
        ],
      },
      // 表格数据 end

      //饼图数据  start
      alarmData1:[{x:"派单数",y:80,},{x:"催单数",y:20,},],
      alarmData2:[{x:"派单数",y:80,},{x:"催单数",y:20,},],
      alarmData3:[{x:"派单数",y:80,},{x:"催单数",y:20,},],
      alarmData4:[{x:"派单数",y:80,},{x:"催单数",y:20,},],
      alarmData5:[{x:"派单数",y:80,},{x:"催单数",y:20,},],
      //饼图数据  end

      //饼图配置项  start
      labelData1:{radius:["34%","60%"],avoidLabelOverlap:false,title:"服务部",legend:["horizontal","center","0"],color:["#666eff","#7b9dff"],},
      labelData2:{radius:["34%","60%"],avoidLabelOverlap:false,title:"规划部",legend:["horizontal","center","0"],color:["#a6ccfb","#91dff5"],},
      labelData3:{radius:["34%","60%"],avoidLabelOverlap:false,title:"建设部",legend:["horizontal","center","0"],color:["#ffa09a","#fbc27d"]},
      labelData4:{radius:["34%","60%"],avoidLabelOverlap:false,title:"维护部",legend:["horizontal","center","0"],color:["#a6ccfb","#ffda8c"],},
      labelData5:{radius:["34%","60%"],avoidLabelOverlap:false,title:"优化部",legend:["horizontal","center","0"],color:["#7b9dff","#fbc27d"]},
      //饼图配置项  end

      //折线图
      stackedData: {name:"stackedAreaChart",data_x:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,],data_y:[{name:"工单数",data:[15, 17, 16 ,15, 15 ,17, 18, 18, 17 ,16 ,16, 15, 18 ,17, 17 ,19 ,17, 19 ,17 ,16 ,19, 17, 18 ,18, 15, 19 ,16, 18, 17 ,18],},{name:"完结数",data:[10,11,11,10,10,12,10,10,11,12,13,12,12,11,10,10,11,10,9,8,10,11,12,13,14,15,14,16,17,16],},{name:"催单数",data:[12, 13, 14, 13, 15, 14, 15, 12, 16, 15, 16, 14, 16, 16, 14, 15, 15, 14, 14, 16, 13, 12, 15, 13, 14, 15, 13, 14, 13, 15,],},],},

      chartDataRow:{taskData:{name:"近三十天工单类型",data:[{x:"外界干扰",y:13,},{x:"其他",y:34,},{x:"无规划已上报需求",y:24,},{x:"有规划未立项",y:12,},{x:"有规划已立项，室外宏站",y:20,},{x:"有规划已立项，室分站点（含室外分布式系统）",y:10,},{x:"停电（铁塔发电）",y:13,},{x:"停电（自维发电）",y:34,},{x:"基站板件故障",y:24,},{x:"隐性故障",y:12,},{x:"手机伴侣故障",y:20,},{x:"IPRAN板件故障",y:10,},{x:"光缆故障",y:13,},{x:"无建设规划",y:34,},{x:"扩容",y:24,},{x:"调整参数、天线角等",y:12,},{x:"安装手机伴侣",y:20,}]},style:{height: '600px' }},
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
