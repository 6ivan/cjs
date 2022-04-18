<template>
  <div class="echart">
    <!-- <img src='../assets/images/2.png' /> -->
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <div class="card_title">
              <span class="fw" >近三十日规划工单统计</span>
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
        <el-col :span="5">
            <pieWithScrollableLegend
              :alarmData="alarmData"
              :labelData="labelData1"
              :defaultData="{ num: 1, width: '100%' }"
            />
        </el-col>
        <el-col :span="5">
            <pieWithScrollableLegend
              :alarmData="alarmData1"
              :labelData="labelData1"
              :defaultData="{ num: 2, width: '100%' }"
            />
        </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <!-- 表格组件 start -->
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <span>工单统计</span>
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
              <el-tab-pane
                label="有规划已立项，室外宏站"
                name="0"
              ></el-tab-pane>
              <el-tab-pane
                label="有规划已立项，室内站点（含室外分布式系统）"
                name="1"
              ></el-tab-pane>
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
      <el-col :span="24">
        <!-- tab标签页切换 start -->
        <el-card class="box-card">
          <div slot="header" class="clearfix boxCardTitle">
            <span>基站类型分析</span>
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
                :chartData="chartData1"
                :idRef="'simpleExampleOfDataset3'"
                :barColorsLg="chartColorLg"
              />
            </div>
            <div>
            <echartMap
              :idRef="'echartMap'"
              :chartData="chartDataRow"
              :barColorsLg="chartColorLg"
            />
          </div>
          </div>
        </el-card>
        <!-- tab标签页切换 end -->
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
          { name: "工单类型", code: "text1", type: "text" },
          { name: "工单所属区域", code: "text2", type: "text" },
          { name: "规划站址名称/规划编号", code: "text3", type: "text" },
          { name: "预警对象", code: "text4", type: "text" },
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
tabDatas: [
        {
          tabTitle: "LTE宏站"
        },
        {
          tabTitle: "SA宏站"
        },
        {
          tabTitle: "SA室内站"
        }],
      //饼图数据  start
      alarmData: [{x:"通过数",y:480,},{x:"回绝数",y:190,},],
      alarmData1: [{x:"工单数",y:40,},{x:"催单数",y:5,}],
      //饼图数据  end

      //饼图配置项  start
      labelData1: {radius:["34%","60%"],avoidLabelOverlap:false,title:"",legend:["horizontal","center","0"],color:["#666eff","#7b9dff"],},
      //饼图配置项  end

      taskData:[{x:"一月",y:10,},{x:"二月",y:20,},{x:"三月",y:12,},{x:"四月",y:24,},{x:"五月",y:34,},{x:"六月",y:13,},],
      //折线图
      stackedData: {name:"stackedAreaChart",data_x:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],data_y:[{name:"待审核单验报告",data:[20, 19, 17, 19, 19, 18, 19 ,18 ,21 ,17 ,20 ,18 ,20, 18, 21, 18 ,18 ,20 ,20 ,21 ,18, 19 ,19 ,18 ,19 ,18, 20, 19 ,20, 21],},{name:"已审核单验报告",data:[15, 17, 16 ,15, 15 ,17, 18, 18, 17 ,16 ,16, 15, 18 ,17, 17 ,19 ,17, 19 ,17 ,16 ,19, 17, 18 ,18, 15, 19 ,16, 18, 17 ,18],},{name:"入网基站",data:[22, 20, 22, 21 ,21, 22 ,19, 23, 22, 20, 20, 19, 23 ,22, 19 ,20 ,22 ,21 ,19, 22, 20 ,19 ,23, 22 ,20 ,20, 22, 20, 21 ,23],},{name:"监控基站",data:[16, 17, 16, 15, 15, 17 ,16 ,14 ,15 ,17, 14 ,17 ,14 ,15, 16 ,16, 16, 14, 15, 16, 14, 17, 16, 17, 16, 15, 16, 16, 17, 15],}],},
      chartData:{taskData:{name:"本月",data:[{x:"武汉",y:10,},{x:"黄石",y:20,},{x:"鄂州",y:12,},{x:"黄冈",y:24,},{x:"咸宁",y:34,},{x:"随州",y:13,},{x:"襄阳",y:10,},{x:"十堰",y:20,},{x:"神农架",y:12,},{x:"恩施",y:24,},{x:"宜昌",y:34,},{x:"荆州",y:13,},{x:"荆门",y:12,},{x:"潜江",y:24,},{x:"天门",y:34,},{x:"仙桃",y:13,},],},taskData1:{name:"上月",data:[{x:"武汉",y:10,},{x:"黄石",y:27,},{x:"鄂州",y:12,},{x:"黄冈",y:24,},{x:"咸宁",y:33,},{x:"随州",y:13,},{x:"襄阳",y:16,},{x:"十堰",y:20,},{x:"神农架",y:12,},{x:"恩施",y:24,},{x:"宜昌",y:34,},{x:"荆州",y:13,},{x:"荆门",y:12,},{x:"潜江",y:24,},{x:"天门",y:34,},{x:"仙桃",y:13,},],},},
      chartDataRow1: {taskData:{name:"工单数",data:[{x:"有规划已立项，室外宏站",y:10,},{x:"有规划已立项，室内站点（含室外分布式系统）",y:20,}]},style:{height: '150px' }},
      chartData1:{taskData:{name:"本月",data:[{x:"武汉",y:20,},{x:"黄石",y:30,},{x:"鄂州",y:22,},{x:"黄冈",y:34,},{x:"咸宁",y:24,},{x:"随州",y:43,},{x:"襄阳",y:16,},{x:"十堰",y:35,},{x:"神农架",y:12,},{x:"恩施",y:45,},{x:"宜昌",y:65,},{x:"荆州",y:52,},{x:"荆门",y:34,},{x:"潜江",y:42,},{x:"天门",y:34,},{x:"仙桃",y:43,},],},taskData1:{name:"上月",data:[{x:"武汉",y:53,},{x:"黄石",y:22,},{x:"鄂州",y:12,},{x:"黄冈",y:24,},{x:"咸宁",y:33,},{x:"随州",y:13,},{x:"襄阳",y:16,},{x:"十堰",y:20,},{x:"神农架",y:12,},{x:"恩施",y:24,},{x:"宜昌",y:34,},{x:"荆州",y:13,},{x:"荆门",y:12,},{x:"潜江",y:24,},{x:"天门",y:34,},{x:"仙桃",y:13,},],},},
      chartDataRow: {taskData:{name:"基站数",data:[{x:"SA宏站",y:10,},{x:"SA室内站",y:20,},{x:"LTE宏站",y:12,}]},style:{height: '200px' }},
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
