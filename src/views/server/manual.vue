<!--客服部-手工单表-->
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
          <el-form-item class="btn-box">
            <el-button type="primary" @click="$router.push('add')"
              >新增工单</el-button
            >
          </el-form-item>
          <el-form-item
            :rules="{
              required: true,
              message: '工单编号不能为空',
              trigger: 'blur',
            }"
            label="工单编号"
            prop="organizeCode"
          >
            <el-input
              v-model="filterForm.organizeCode"
              placeholder="请输入工单编号"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <!-- <el-button @click="refreshBtn">重置</el-button> -->
          </el-form-item>
          <el-form-item prop="status" />
        </el-form>
      </div>
    </el-card>
    <div class="box-card">
      <div class="card">
        <h3 class="section-title">
          <span>手动工单表统计</span>
        </h3>
        <div id="myChart" :style="{ width: '100%', height: '250px' }" />
      </div>
      <!-- <div class="btn-group-full mt-30" :stretch="true">
        <span
          v-for="(tab, index) in serverList.tabs"
          :key="index"
          class="tab-btn"
          :class="index === serverList.tabIndex ? 'active' : ''"
          @click="changePlanTab(index)"
        >
          {{ tab }}</span
        >
      </div> -->
      <div class="card">
        <h3 class="section-title">
          <span>待分拣工单</span>
        </h3>
        <el-table
          class="p-table"
          :cell-class-name="pTableCell"
          :header-cell-class-name="pTableHead"
          ref="multipleTable"
          v-loading="tableLoading"
          :data="serverList.currentData"
          :row-key="(row) => row.id"
          tooltip-effect="dark"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            prop="workOrderNumber"
            label="工单名称/编号"
            align="center"
          />
          <el-table-column prop="region" label="工单所属区域" align="center" />
          <el-table-column label="工单派发部门" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.status == 1 ? "已派单" : "未派单" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="complaint" label="工单时限" align="center" />
          <el-table-column label="工单状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderState == 0">待处理</span>
              <span v-if="scope.row.workOrderState == 1">已接收</span>
              <span v-if="scope.row.workOrderState == 2">已解决</span>
              <span v-if="scope.row.workOrderState == 3">未解决</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template slot-scope="scope">
              <div class="table-btn">
                <el-link
                  type="primary"
                  @click="
                    $router.push({
                      path: 'detail',
                      query: {
                        id: scope.row.workOrderNumber,
                      },
                    })
                  "
                  >查看</el-link
                >
              </div>
            </template>
          </el-table-column>
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
      </div>
    </div>
  </div>
</template>

<script>
import { orderStateStatistics, getOrderList } from "@/api/server";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  data() {
    return {
      filterForm: {
        pageNumber: 1,
        pageSize: 10,
      },
      chartData: {},
      serverList: {
        tabIndex: 0,
        tabs: [
          "工单情况",
          "重点区域",
          "重点栅格",
          "重复投诉",
          "待建基站",
          "待维修基站",
          "待优化基站",
          "满意情况",
        ],
        currentData: [],
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getCityChart();
  },
  methods: {
    searchBtn() {
      this.$refs["filterForm"].validate((valid) => {
        if (valid) {
          this.$router.push({
            path: "detail",
            query: { id: this.filterForm.workOrderNumber },
          });
        }
      });
    },
    getList() {
      getOrderList(this.filterForm).then((res) => {
        this.serverList.currentData = res.data.records;
        res.data.records.forEach((item) => {
          if (item.createTime) {
            item.createTime = item.createTime.substring(0, 10);
          }
        });
        this.filterForm.pageNumber = res.data.current;
        this.filterForm.pageSize = res.data.size;
        this.total = res.data.total;
      });
    },
    changePlanTab(index) {
      this.serverList.tabIndex = index;
      this.serverList.currentData = this.serverList.list[index];
    },
    getCityChart() {
      orderStateStatistics({}).then((res) => {
        console.log(res);
        this.chartData.x = res.data.processed.map((item) => item.name);
        this.chartData.y = [];
        this.chartData.y[0] = res.data.processed.map((item) => item.count);
        this.chartData.y[1] = res.data.processing.map((item) => item.count);
        this.drawLine();
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#2478F2", "#84B7F9"],
        legend: {
          show: true,
        },
        tooltip: {},
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          data: this.chartData.x,
        },
        yAxis: {},
        series: [
          {
            barGap: "0%",
            name: "已处理工单",
            type: "bar",
            data: this.chartData.y[0],
          },
          {
            name: "处理中工单",
            type: "bar",
            data: this.chartData.y[1],
          },
        ],
      });
     window.addEventListener("resize", function () {
        myChart.resize();
      });
   },
  },
};
</script>
<style lang="scss" scoped>
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  .section-title-more {
    font-size: 14px;
    color: #999;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
.btn-group-full {
  width: 100%;
  display: flex;
  height: 32px;
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
</style>
