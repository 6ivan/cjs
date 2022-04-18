<!--权限管理-->
<template>
  <div class="build-container">
    <div class="box-card searchLIst card">
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
          <el-form-item class="btn-box">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button @click="refreshBtn">重置</el-button>
          </el-form-item>
          <el-form-item prop="status"></el-form-item>
        </el-form>
      </div>
    </div>
    <div class="box-card">
      <div
        id="myChart"
        class="card"
        :style="{ width: '100%', height: '330px' }"
      ></div>
      <div class="card">
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
          prop="stationNumber"
          label="基站号"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
          <el-table-column prop="stationName" label="基站名称" align="center">
          </el-table-column>
          <el-table-column prop="orgName" label="所属本地网" align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="工单抵达时间"
            align="center"
          >
          </el-table-column>
                    <el-table-column label="当前进度" align="center">
            <template slot-scope="scope">
              <div>
                {{ statusList[parseInt(scope.row.status)] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template slot-scope="scope" width="220">
              <div>
                <el-link type="primary" @click="link(scope.row)">处理</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes,prev, pager, next,jumper"
            :current-page.sync="page"
            :page-size="size"
            :page-sizes="[5, 10, 15, 20]"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="70%">
      <div class="content">
        <div>项目名称：{{ remarkForm.name }}</div>
        <div>项目区域：{{ remarkForm.stationAddress }}</div>
        <div style="cursor: pointer" >
          检验报告：
          <div class="footer" @click="open(remarkForm.fileName)">
            <div class="img">
              <img
                v-if="lastName == 'pdf'"
                src="../../assets/404_images/pdf.png"
                alt=""
              />
              <img
                v-if="lastName == 'xlsx'"
                src="../../assets/404_images/excel.png"
                alt=""
              />
              <img
                v-if="lastName == 'doc' || lastName == 'docx'"
                src="../../assets/404_images/word.png"
                alt=""
              />
            </div>
            <a> {{ remarkForm.name }}</a>
          </div>
        </div>
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
    <el-dialog title="系统提醒" :visible.sync="dialogVisible2" width="50%" @close="close">
      <span>您拒绝该基站进行入网建设工作，您可以选择填写拒绝原因：</span>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="checkDetail"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="reject">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="系统提醒" :visible.sync="dialogVisible3" width="50%"  @close="close">
      <span>您挂起该基站进行入网建设工作，您可以选择填写挂起原因：</span>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="checkDetail"
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
import {} from "@/api/department";
import FilterList from "@/mixins/FilterList";
import {
  getCityChartApi,
  getConstructionApi,
  putStatusApi,
} from "@/api/construction";
export default {
  mixins: [FilterList],
  data() {
    return {
      list: [{}, {}],
      flag: false, //批量全选状态
      remarkForm: {},
      title: "",
      dialogList: {},
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      checkDetail: '',
      lastName: "",
            statusList: [
        "",
        "待审核",
        "已通过",
        "已拒绝",
        "已挂起",
        "已建成",
        "监测失败",
        "监测成功",
      ],
    };
  },
  methods: {
        open(a) {
      window.open(a);
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
      var arr1 = last.split("."); //通过分隔字符串，成字符串数组
      var last1 = arr1[arr1.length - 1]; //取最后一个，就是文件
      this.lastName = last1;
      console.log(last1);
      var pattern = /\.{1}[a-z]{1,}$/;
      if (pattern.exec(last) !== null) {
        return last.slice(0, pattern.exec(last).index);
      } else {
        // return aa;
      }
    },
    reject() {
      putStatusApi(this.remarkForm.id, 3, this.checkDetail).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "驳回成功!",
          });
          (this.dialogVisible = false),
            (this.dialogVisible2 = false),
            this.getList();
             this.remarkForm.check = ''
        }
      });
    },
    reject2() {
      putStatusApi(this.remarkForm.id, 4, this.checkDetail).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "挂起成功!",
          });
          (this.dialogVisible = false), (this.dialogVisible3 = false);
          this.getList();
          this.remarkForm.check = ''
        }
      });
    },
    close() {
      this.checkDetail = "";
      this.remarkForm.check = ''
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#2478F2", "#84B7F9"],
        legend: {
          show: true,
        },
        title: { text: "本月申报审核（同比）     待审核申请数：" },
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
    },
    getList() {
      var param = {};
      if (this.filterForm.orgId) {
        param.orgId = this.filterForm.orgId;
      }
      if (this.filterForm.stationName) {
        param.stationName = this.filterForm.stationName;
      }
      getConstructionApi(param, this.page, this.size, 2).then((res) => {
        this.loadingList = false;
        if (res.code == 200) {
          this.total = res.data.total;
          this.size = res.data.size;
          this.page = res.data.current;
          this.list = res.data.records;
          this.list.forEach((item) => {
            if (item.createTime) {
              item.createTime = item.createTime.substring(0, 10);
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
    link(row) {
      this.dialogVisible = true;
      this.remarkForm.aa = row.stationName;
      this.remarkForm.name = this.splitFileName(row.filePath);
      this.remarkForm.fileName = row.filePath;
      this.remarkForm.stationAddress = row.stationAddress;
      this.remarkForm.id = row.id
    },
    open1() {
      this.$confirm("是否同意该基站进行建设", "系统提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          putStatusApi(this.remarkForm.id, 2,'').then((res) => {
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
    this.getCityChart();
  },
  mounted() {
    this.getCityChart();
  },
};
</script>
<style lang="scss" scoped>
.repoet{
  display: flex;
  line-height: 25px;
}
.day{
  text-align: center;
}
.title{
  font-size: 22px;
}
.statusTitle{
  font-size: 18px;
}
.baseInfo{
  display: flex;
  .remarkInfo{
    margin-right: 50px;
  }
}
.el-dialog span{
  margin-bottom: 15px;
}
.el-dialog .el-textarea{
  margin-top: 15px;
}
.sj_title {
  line-height: 36px;
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
.footer {
  margin-top: 10px;
  cursor: pointer;
  margin-right: 30px;
  display: flex;
}
.footer a {
  line-height: 25px;
}
.img img {
  height: 25px;
  margin-right: 10px;
}
</style>
