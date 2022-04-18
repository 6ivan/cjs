<!--优化室-->
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
          <el-form-item label="工单号" prop="workOrderNumber">
            <el-input
              v-model="filterForm.workOrderNumber"
              placeholder="请输入工单号"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button @click="refreshBtn">重置</el-button>
          </el-form-item>
          <el-form-item prop="status" />
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div id="myChart" :style="{ width: '100%', height: '250px' }" />
      <div class="construction_pic">
        <div class="stats-block" @click="$router.push('list?type=1')">
          <span class="stats-text">{{ twoFourCount }}</span>
          <div class="stats-lebale">24小时内工单</div>
        </div>
        <!-- <div class="stats-block">
          <span class="stats-text">15</span>
          <div class="stats-lebale">催办工单</div>
        </div>
        <div class="stats-block">
          <span class="stats-text">31</span>
          <div class="stats-lebale">重点投诉工单</div>
        </div> -->
        <div class="stats-block" @click="$router.push('list?type=1')">
          <span class="stats-text">{{ urgencyCount }}</span>
          <div class="stats-lebale">被催办信息</div>
        </div>
      </div>
      <el-table
        class="p-table"
        :cell-class-name="pTableCell"
        :header-cell-class-name="pTableHead"
        ref="multipleTable"
        v-loading="tableLoading"
        :data="list"
        :row-key="(row) => row.id"
        tooltip-effect="dark"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="workOrderNumber" label="工单号" align="center" />
        <el-table-column prop="region" label="工单所属区域" align="center" />
        <el-table-column label="工单状态" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.workOrderState == 1 ? "已解决" : "未解决待查修" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否重复工单" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.isrep == 1 ? "是" : "否" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="complaintTime" label="投诉时间" align="center" />
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
    </el-card>
  </div>
</template>

<script>
import {
  getDefendApi,
  getUrgencyCountApi,
  getTwoFourCountApi,
  getstatisticsAndOrganizeApi,
} from "@/api/defend";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  data() {
    return {
      list: [
        {
          no: "123456",
          area: "湖北省武汉市光谷广场",
          isrep: 1,
          status: 1,
          time: "2021-01-01",
        },
        {
          no: "123456",
          area: "湖北省武汉市光谷广场",
          isrep: 1,
          status: 2,
          time: "2021-01-01",
        },
        {
          no: "123456",
          area: "湖北省武汉市光谷广场",
          isrep: 2,
          status: 1,
          time: "2021-01-01",
        },
      ],
      urgencyCount: "",
      twoFourCount: "",
      statisticsAndOrganize: {},
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      var param = {};
      if (this.filterForm.orgIworkOrderNumberd) {
        param.workOrderNumber = this.filterForm.workOrderNumber;
      }
      getDefendApi(param, this.page, this.size).then((res) => {
        this.loadingList = false;
        if (res.code == 200) {
          this.total = res.data.total;
          this.size = res.data.size;
          this.page = res.data.current;
          this.list = res.data.records;
          this.list.forEach((item) => {
            item.complaintTime = item.complaintTime.substring(0, 10);
          });
        }
      });
      getUrgencyCountApi().then((res) => {
        this.urgencyCount = res.data;
      });
      getTwoFourCountApi().then((res) => {
        this.twoFourCount = res.data;
      });
      getstatisticsAndOrganizeApi().then((res) => {
        this.statisticsAndOrganize = res.data;
        console.log(this.statisticsAndOrganize);
        this.drawLine();
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      console.log(this.statisticsAndOrganize.yData);
      myChart.setOption({
        color: ["#2478F2", "#FFCB01", "#34C758"],
        legend: {
          show: true,
        },
        title: { text: "工单统计" },
        tooltip: {},
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          data: this.statisticsAndOrganize.x,
        },
        yAxis: {},
        series: [
          {
            name: "待处理工单",
            type: "bar",
            data: this.statisticsAndOrganize.y[0],
          },
          {
            name: "处理中工单",
            type: "bar",
            data: this.statisticsAndOrganize.y[1],
          },
          {
            name: "已处理工单",
            type: "bar",
            data: this.statisticsAndOrganize.y[2],
          },
        ],
      });
    },
  },
};
</script>
<style scoped>
.build-container {
  overflow-y: auto;
  height: 100%;
}
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
.stats-block {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  margin-right: 30px;
  border: 1px rgba(187, 187, 187, 100) solid;
}
.stats-text {
  font-size: 20px;
  margin-bottom: 8px;
}
.stats-label {
  font-size: 14px;
}
</style>
