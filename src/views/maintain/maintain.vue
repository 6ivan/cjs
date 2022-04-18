<!--优化室-->
<template>
  <div class="build-container">
    <div class="p-dbox">
      <h3>筛选查询</h3>
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
    </div>
    <div
      id="myChart"
      class="card"
      :style="{ width: '100%', height: '250px' }"
    />
    <div class="construction_pic card">
      <div class="pic_i pic4" @click="$router.push('list?type=1')">
        <div class="pic_cen">
          <div class="pic_num">{{ twoFourCount }}</div>
          <div class="pic_text">24小时内工单</div>
        </div>
      </div>
      <div class="pic_i pic3" @click="$router.push('list?type=2')">
        <div class="pic_cen">
          <div class="pic_num">{{ urgencyCount }}</div>
          <div class="pic_text">被催办信息</div>
        </div>
      </div>
    </div>
    <div class="card">
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
      >
        <el-table-column
          prop="workOrderNumber"
          label="工单编号"
          align="center"
        />
        <el-table-column label="预警类型" align="center">
          <template slot-scope="scope">
            <div>
              {{ $webConfig.workOrderType[scope.row.workOrderType] || "--" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="工单所属区域" align="center" />
        <el-table-column label="工单状态" align="center">
          <template slot-scope="scope">
            <div>
              {{ $webConfig.workOrderState[scope.row.workOrderState] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预警对象" align="center">
          <template slot-scope="scope">
            <!-- workOrderType=1,2,3 取 region
						// workOrderType=4 取 baseNumber
						// workOrderType=5 取 telephone -->
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
        <el-table-column prop="complaintTime" label="投诉时间" align="center" />
        <el-table-column prop="complaintTime" label="操作" align="center">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link type="primary" @click="jumpDetail(scope.row)"
                >查看</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <p-page
          :pageNumber.sync="pages.number"
          :pageTotal="pages.total"
          :pageSize="pages.size"
          @pageChange="pageRefresh"
        ></p-page>
      </div>
    </div>
  </div>
</template>

<script>
// 预警对象
// workOrderType=1,2,3 取 region
// workOrderType=4 取 baseNumber
// workOrderType=5 取 telephone
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
      list: [],
      tableLoading: false,
      urgencyCount: "",
      twoFourCount: "", //24小时数量
      filterForm: {
        workOrderNumber: "",
      },
      chartData: {}, //图表数据
    };
  },
  created() {
    this.getList(); //table
    this.getNums();
  },
  mounted() {
    this.getChartData(); //图表
  },
  methods: {
    // 获取列表
    getList() {
      let param = {
        workOrderNumber: this.filterForm.workOrderNumber,
        pageNumber: this.pages.number,
        pageSize: this.pages.size,
        orgIdList: [4],
      };
      this.tableLoading = true;
      this.$http
        .post("/szkj-datamiddleground/order/getPageOrderListAndOrganize", param)
        .then((res) => {
          this.tableLoading = false;
          if (res.code == 200) {
            let data = res.data;
            this.pages.total = data.total;
            this.list = data.records;
            this.list.forEach((item) => {
              item.complaintTime = item.complaintTime.substring(0, 10);
            });
          }
        })
        .catch((e) => {
          this.tableLoading = false;
        });
    },
    // 维护优化-表单统计接口  表单数据
    getChartData() {
      this.$http
        .get("/szkj-datamiddleground/order/orderStatisticsAndOrganize", {
          params: {
            orgIdList: 4,
            stateList: "",
          },
        })
        .then((res) => {
          if (res.code == 200) {
            this.chartData = res.data;
            this.drawLine();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#2478F2", "#FFCB01", "#34C758"],
        legend: {
          show: true,
        },
        title: {
          text: "工单统计",
        },
        tooltip: {},
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          data: this.chartData.x || [],
        },
        yAxis: {},
        series: [
          {
            name: "待处理工单",
            type: "bar",
            data:
              this.chartData.y && this.chartData.y.length > 0
                ? this.chartData.y[0]
                : [],
          },
          {
            name: "处理中工单",
            type: "bar",
            data:
              this.chartData.y && this.chartData.y.length > 1
                ? this.chartData.y[1]
                : [],
          },
          {
            name: "已处理工单",
            type: "bar",
            data:
              this.chartData.y && this.chartData.y.length > 2
                ? this.chartData.y[2]
                : [],
          },
        ],
      });
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    pageRefresh() {
      this.getList();
    },
    jumpDetail(item) {
      this.$router.push({
        path: "/maintain/detail",
        query: item,
      });
    },
    // 获取数量
    getNums() {
      // 维护优化-被催办表单数量
      getUrgencyCountApi().then((res) => {
        this.urgencyCount = res.data;
      });
      // 24小时表单数量
      getTwoFourCountApi().then((res) => {
        this.twoFourCount = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.construction_pic {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
}
.pic_i {
  margin-right: 80px;
  width: 300px;
  height: 153px;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px;
  .pic_cen {
    margin-bottom: 6px;
    .pic_text {
      display: block;
      margin-top: 6px;
      font-size: 18px;
      margin-left: 85px;
    }
    .pic_num {
      font-weight: 600;
      font-size: 40px !important;
      margin-left: 85px;
      font-size: 46px;
    }
  }
}
.pic1 {
  color: rgb(130, 152, 254);
  background-image: url("../../assets/404_images/icon9.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.pic2 {
  color: rgb(255, 157, 151);
  background-image: url("../../assets/404_images/icon8.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.pic3 {
  color: rgb(255, 193, 126);
  background-image: url("../../assets/404_images/icon7.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.pic4 {
  color: rgb(161, 207, 255);
  background-image: url("../../assets/404_images/icon5.png");
  background-repeat: no-repeat;
  background-size: contain;
}
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
