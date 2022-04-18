<!--权限管理-->
<template>
  <div class="build-container">
    <el-card class="box-card searchLIst card1">
      <div slot="header" class="clearfix">
        <span>筛选查询</span>
      </div>
      <div class="text item">
        <el-form
          ref="filterForm"
          :model="filterForm"
          label-width="100px"
          inline
          size="small"
        >
          <el-form-item label="基站名称" prop="stationName">
            <el-input
              v-model="filterForm.stationName"
              placeholder="请输入基站名称"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属本地网" prop="orgName">
            <el-input
              v-model="filterForm.orgId"
              placeholder="请输入所属本地网"
              :maxlength="20"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button @click="refreshBtn">重置</el-button>
          </el-form-item>
          <el-form-item prop="status"></el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="box-card">
      <div class="card">
        <div id="myChart" :style="{ width: '100%', height: '330px' }"></div>
      </div>
      <div class="card">
        <div class="title">需求清单</div>
        <div class="btn-group-full mt-30 mb-20" :stretch="true">
          <span
            v-for="(tab, index) in serverList.tabs"
            :key="index"
            class="tab-btn"
            :class="index === serverList.tabIndex ? 'active' : ''"
            @click="changePlanTab(index)"
          >
            {{ tab }}</span
          >
        </div>
        <el-table
          class="p-table"
          :cell-class-name="pTableCell"
          :header-cell-class-name="pTableHead"
          v-loading="tableLoading"
          ref="multipleTable"
          :data="list"
          :row-key="(row) => row.id"
          tooltip-effect="dark"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            label="工单编号"
            prop="workOrderNumber"
            align="center"
          />
          <el-table-column label="预警对象" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderType < 4">
                {{ scope.row.region }}
              </span>
              <span v-else-if="scope.row.workOrderType == 4">{{
                scope.row.baseNumber
              }}</span>
              <span v-if="scope.row.workOrderType == 5">{{
                scope.row.telephone
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="工单类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderType == 1">疑难工单</span>
              <span v-if="scope.row.workOrderType == 2">专项工单</span>
              <span v-if="scope.row.workOrderType == 3">贬损工单</span>
              <span v-if="scope.row.workOrderType == 4">重复基站</span>
              <span v-if="scope.row.workOrderType == 5">重复用户</span>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="工单所属区域" align="center">
          </el-table-column>
          <el-table-column label="工单状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderState == 0">待处理</span>
              <span v-if="scope.row.workOrderState == 1">已接收</span>
              <span v-if="scope.row.workOrderState == 2">已解决</span>
              <span v-if="scope.row.workOrderState == 3">未解决</span>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="投诉时间" align="center">
          </el-table-column>
          <!-- <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope" width="220">
            <div>
              <el-link type="primary" @click="link(scope.row)">处理</el-link>
            </div>
          </template>
        </el-table-column> -->
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="filterForm.pageNumber"
          :page-size="filterForm.pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="70%">
      <div class="content">
        <div>项目名称：{{ dialogList.stationName }}</div>
        <div>项目区域：{{ dialogList.stationAddress }}</div>
        <div style="cursor: pointer" @click="aa">检验报告：{{ title }}</div>
        <div>
          审核结果：
          <div class="btngroup">
            <el-button @click="open1">允许入网</el-button>
            <el-button @click="dialogVisible2 = true">拒绝入网</el-button>
            <el-button @click="dialogVisible3 = true">工单挂起</el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="系统提醒" :visible.sync="dialogVisible2" width="50%">
      <span>您拒绝该基站进行入网建设工作，您可以选择填写拒绝原因</span>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="checkDetail"
        @close="close"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="reject">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="系统提醒" :visible.sync="dialogVisible3" width="50%">
      <span>您挂起该基站进行入网建设工作，您可以选择填写挂起原因</span>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="checkDetail"
        @close="close"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="reject2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { } from "@/api/department";
import FilterList from "@/mixins/FilterList";
import { getCityChartApi, getConstructionApi, putStatusApi } from "@/api/plan";
export default {
  mixins: [FilterList],
  data() {
    return {
      list: [{}, {}],
      flag: false, //批量全选状态
      remarkForm: {},
      filterForm: {
        pageNumber: 1,
        pageSize: 10,
        workOrderState: 1,
        isPlanned: 1,
      },
      title: "",
      dialogList: {},
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      checkDetail: undefined,
      serverList: {
        tabIndex: 0,
        tabs: ["已有规划", "无规划"],
      },
    };
  },
  methods: {
    changePlanTab(index) {
      this.serverList.tabIndex = index;
      this.filterForm.isPlanned = index == 1 ? 0 : 1;
      this.getList();
    },
    aa() {
      window.open(this.dialogList.filePath);
    },
    getCityChart() {
      getCityChartApi().then((res) => {
        this.chartData = res.data;
        this.drawLine();
      });
    },
    splitFileName(text) {
      var arr = text.split("/"); //通过分隔字符串，成字符串数组
      var last = arr[arr.length - 1]; //取最后一个，就是文件名
      var pattern = /\.{1}[a-z]{1,}$/;
      if (pattern.exec(last) !== null) {
        return last.slice(0, pattern.exec(last).index);
      } else {
        return aa;
      }
    },
    reject() {
      putStatusApi(this.dialogList.id, 3, this.checkDetail).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "驳回成功!",
          });
          (this.dialogVisible = false),
            (this.dialogVisible2 = false),
            this.getList();
        }
      });
    },
    reject2() {
      putStatusApi(this.dialogList.id, 4, this.checkDetail).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "挂起成功!",
          });
          (this.dialogVisible = false), (this.dialogVisible3 = false);
          this.getList();
        }
      });
    },
    close() {
      this.checkDetail = "";
    },
    drawLine() {
      console.log(this.chartData.xData);
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#2478F2", "#84B7F9"],
        legend: {
          show: true,
        },
        title: { text: "建设动态" },
        tooltip: {},
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: ["rgb(238,239,244)"],
              width: 1,
              type: "solid",
            },
          },
          data: this.chartData.xData,
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: ["rgb(238,239,244)"],
              width: 1,
              type: "solid",
            },
          },
        },
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
            data: this.chartData.yData[0],
            backgroundStyle: {
              color: "rgba(217, 222, 245,0.2)",
            },
          },
          {
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
            data: this.chartData.yData[1],
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
    getList() {
      getConstructionApi({}, this.filterForm).then((res) => {
        this.loadingList = false;
        if (res.code == 200) {
          console.log(res);
          this.total = res.data.total;
          this.filterForm.pageSize = res.data.size;
          this.filterForm.pageNumber = res.data.current;
          this.list = res.data.records;
          this.list.forEach((item) => {
            if (item.creationTime) {
              item.creationTime = item.creationTime.substring(0, 10);
            }
          });
        }
      });
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
      this.title = this.splitFileName(row.filePath);
      this.dialogList = row;
    },
    open1() {
      this.$confirm("是否同意该基站进行建设", "系统提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          putStatusApi(this.dialogList.id, 2).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              (this.dialogVisible = false),
                (this.dialogVisible2 = false),
                this.getList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getCityChart();
  },
};
</script>
<style lang="scss" scoped>
.sj_title {
  line-height: 36px;
}
.btn-group-full {
  width: 300px;
  display: flex;
  height: 32px;
  margin-bottom: 20px;
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
.pagination-box {
  margin-top: 30px;
}
.reset-steps {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  div {
    position: relative;
    .stepsIcon {
      margin: 0 auto;
      padding: 10px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      margin-bottom: 15px;
      z-index: 9;
    }
    span {
      position: absolute;
      display: block;
      border-bottom: 4px dotted #bbb;
      height: 2px;
      width: 175px;
      top: 25px;
      left: 60px;
    }
  }
}
.time,
.time {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}
.steps_item {
  width: 125px;
}
.remarkInfo {
  margin: 20px 0;
}
.remarkForm {
  display: flex;
  flex-wrap: wrap;
  margin-top: -20px;
}
.remarkForm div {
  margin-right: 100px;
  margin-top: 20px;
}
.remarkInfo > div {
  margin-top: 20px;
}
.lable {
  display: inline-block;
  width: 112px;
  text-align-last: justify;
}
</style>
<style>
.build-container .el-dialog__body {
  padding: 30px 40px;
}
.build-container .el-dialog {
  font-weight: 800;
}
.build-container .el-table {
  font-weight: normal;
}
.build-container .el-dialog .has-gutter th {
  background-color: #f2f2f2;
}
.build-container
  .el-dialog
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped
  td {
  background-color: #f2f2f2;
}
.construction_pic {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}
.content > div {
  margin-top: 30px;
}
.btngroup {
  padding: 30px;
}
.title {
  font-size: 18px;
  font-weight: 800;
}
</style>
