<!--优化室-->
<template>
  <div class="ruTask-container">
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
          <el-form-item label="工单号" prop="organizeCode">
            <el-input
              v-model="filterForm.organizeCode"
              placeholder="请输入工单号"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <el-form-item label="所属本地网" prop="organizeName">
            <el-input
              v-model="filterForm.organizeName"
              placeholder="请输入所属本地网"
              :maxlength="20"
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
          <span class="stats-text">214</span>
          <div class="stats-lebale">24小时内工单</div>
        </div>
        <div class="stats-block" @click="$router.push('list?type=2')">
          <span class="stats-text">15</span>
          <div class="stats-lebale">催办工单</div>
        </div>
        <div class="stats-block" @click="$router.push('list?type=3')">
          <span class="stats-text">31</span>
          <div class="stats-lebale">重点投诉工单</div>
        </div>
        <div class="stats-block" @click="$router.push('list?type=4')">
          <span class="stats-text">12</span>
          <div class="stats-lebale">悲催办信息</div>
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
        <el-table-column prop="no" label="工单号" align="center" />
        <el-table-column prop="area" label="工单所属区域" align="center" />
        <el-table-column label="工单状态" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.status == 1 ? "已解决" : "未解决待查修" }}
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
        <el-table-column prop="time" label="投诉时间" align="center" />
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
import FilterList from '@/mixins/FilterList'
export default {
  mixins: [FilterList],
  data() {
    return {
      list: [{
        no: '123456',
        area: '湖北省武汉市光谷广场',
        isrep: 1,
        status: 1,
        time: '2021-01-01'
      }, {
        no: '123456',
        area: '湖北省武汉市光谷广场',
        isrep: 1,
        status: 2,
        time: '2021-01-01'
      }, {
        no: '123456',
        area: '湖北省武汉市光谷广场',
        isrep: 2,
        status: 1,
        time: '2021-01-01'
      }]
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    getList() {
      this.$http.post('/szkj-datamiddleground/order/getPageOrderListAndOrganize', {
        pageNumber: 1,
        pageSize: 10,
        stateList: [],
        workOrderId: "",
        orgIdList: []
      }).then(res => {
        console.log(res);
      })
    },



    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        color: ['#2478F2', '#FFCB01', '#34C758'],
        legend: {
          show: true
        },
        title: {
          text: '工单统计'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0
          },
          data: ['武汉', '黄石', '黄冈', '孝感', '随州', '襄阳', '十堰', '神农架林区', '宜昌', '恩施土家族自治州', '荆州', '荆门',
            '潜江', '天门', '仙桃', '鄂州', '咸宁'
          ]
        },
        yAxis: {},
        series: [{
          name: '待处理工单',
          type: 'bar',
          data: (new Array(17)).fill(null).map(() => {
            return parseInt(Math.random() * (40 - 10 + 1) + 10, 10)
          })
        }, {
          name: '处理中工单',
          type: 'bar',
          data: (new Array(17)).fill(null).map(() => {
            return parseInt(Math.random() * (40 - 10 + 1) + 10, 10)
          })
        }, {
          name: '已处理工单',
          type: 'bar',
          data: (new Array(17)).fill(null).map(() => {
            return parseInt(Math.random() * (40 - 10 + 1) + 10, 10)
          })
        }]
      })
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }
  }
}
</script>
<style>
.ruTask-container .el-dialog__body {
  padding: 30px 40px;
}

.ruTask-container .el-dialog {
  font-weight: 800;
}

.ruTask-container .el-table {
  font-weight: normal;
}

.ruTask-container .el-dialog .has-gutter th {
  background-color: #f2f2f2;
}

.ruTask-container
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
