<!--权限管理-->
<template>
  <div class="build-container">
    <el-card class="box-card searchLIst">
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
          <el-form-item label="基站名称" prop="organizeCode">
            <el-input
              v-model="filterForm.organizeCode"
              placeholder="请输入基站名称"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属本地网" prop="organizeName">
            <el-input
              v-model="filterForm.organizeName"
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
    <el-card class="box-card">
      <div id="myChart" :style="{ width: '100%', height: '250px' }"></div>
      <el-table
      class="p-table" :cell-class-name="pTableCell" :header-cell-class-name="pTableHead"
        v-loading="tableLoading"
        ref="multipleTable"
        :data="list"
        :row-key="(row) => row.id"
        tooltip-effect="dark"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="organizeCode" label="基站名称" align="center">
        </el-table-column>
        <el-table-column prop="organizeLevel" label="所属本地网" align="center">
        </el-table-column>
        <el-table-column prop="organizeLevel" label="工单抵达时间" align="center">
        </el-table-column>
        <el-table-column prop="organizeLevel" label="状态备注" align="center">
        </el-table-column>
        <el-table-column prop="organizeLevel" label="审核时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
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
    </el-card>
  </div>
</template>

<script>
import { } from "@/api/department";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  data() {
    return {
      list: [{}, {},],
      infoList: [{ parentId: "投诉信息", isAdmin: 1 }, { parentId: "专项行动", isAdmin: 1 }],
      flag: false, //批量全选状态
      remarkForm: { aa: "暂无" }
    };
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        color: ['#2478F2', '#84B7F9'],
        legend: {
          show: true
        },
        title: { text: '本月申报审核（同比）     待审核申请数：' },
        tooltip: {},
        xAxis: {
             
            type: 'category',
            axisLabel :{
                interval:0
            },
          data: ["武汉", "黄石", "黄冈", "孝感", "随州", "襄阳", "十堰", "神农架林区", "宜昌", "恩施土家族自治州", "荆州", "荆门", "潜江", "天门", "仙桃", "鄂州", "咸宁"]
        },
        yAxis: {},
        series: [
          {
            barGap: '0%',
            name: '本月',
            type: 'bar',
            data: [5, 20, 36, 10, 18, 20, 5, 20, 32, 10, 10, 20, 7, 20, 36, 10, 8]
          }, {
            name: '上月',
            type: 'bar',
            data: [5, 8, 36, 18, 10, 20, 20, 32, 10, 10, 20, 7, 20, 32, 10, 10, 20]
          }]
      });
    },
    getList() { },
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
  created() {
    // this.getList();
  },
  mounted() {
    this.drawLine();
  },
};
</script>
<style lang="scss" scoped>
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
.pic_text {
  color: #444;
  font-size: 17px;
  text-align: center;
  margin-top: 20px;
}
</style>
