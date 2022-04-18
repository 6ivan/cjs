<!--客服部-栅格预警分拣-->
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
            prop="workOrderNumber"
          >
            <el-input
              v-model="filterForm.workOrderNumber"
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
          <span>待分拣工单</span>
        </h3>
        <div id="myChart" :style="{ width: '100%', height: '250px' }" />
      </div>
      <div class="card">
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
          <el-table-column label="预警类型" align="center">
            <template slot-scope="scope">
              <!-- @click="jumpDetail(scope.row)" -->
              <div>
                {{ workOrderType[scope.row.workOrderType] || "--" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="工单所属区域" align="center" />
          <el-table-column
            prop="subCategory"
            label="投诉子类别"
            align="center"
          />
          <el-table-column label="预警对象" align="center">
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.workOrderType == 1 ||
                  scope.row.workOrderType == 2 ||
                  scope.row.workOrderType == 3
                "
              >
                {{ scope.row.region }}
              </div>
              <div v-else-if="scope.row.workOrderType == 4">
                {{ scope.row.baseNumber }}
              </div>
              <div v-else-if="scope.row.workOrderType == 5">
                {{ scope.row.telephone }}
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="complaintTime"
            label="投诉时间"
            align="center"
          />
          <el-table-column label="工单状态" align="center">
            <template slot-scope="scope">
              <div>
                {{ workOrderState[scope.row.workOrderState] }}
              </div>
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
                      query: { id: scope.row.workOrderNumber },
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
import { getCityChartApi, getPageWaitWorkList } from "@/api/server";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  data() {
    return {
      serverList: {
        tabIndex: 0,
        currentData: [],
      },
      workOrderType: {
        // 工单类型
        1: "疑难工单",
        2: "专项工单",
        3: "贬损工单",
        4: "重复基站",
        5: "重复用户",
      },
      workOrderState: {
        // 工单类型
        0: "待处理",
        1: "已接受",
        2: "已解决",
        3: "未解决",
      },
      filterForm: {
        workOrderNumber: null,
        workOrderSource: 2, //1预警单，2栅格预警单，3手工工单
        pageNumber: 1,
        pageSize: 10,
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
      console.log(this.filterForm);
      getPageWaitWorkList(this.filterForm).then((res) => {
        this.serverList.currentData = res.data.records;
        res.data.records.forEach((item) => {
          if (item.createTime) {
            item.createTime = item.createTime.substring(0, 10);
          }
        });
        this.filterForm.pageNumber = res.data.current;
        this.filterForm.pageSize = res.data.size;
        this.total = res.data.total;
        console.log(res);
      });
    },
    changePlanTab(index) {
      this.serverList.tabIndex = index;
      this.serverList.currentData = this.serverList.list[index];
    },
    getCityChart() {
      getCityChartApi({ sourceList: 2 }).then((res) => {
        this.chartData = res.data;
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
            name: "累计工单",
            type: "bar",
            data: this.chartData.y[0],
          },
          {
            name: "待分拣工单",
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
