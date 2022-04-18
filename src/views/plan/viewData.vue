<!--数据查看-规划-->
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
          <el-form-item class="btn-box">
            <el-button type="primary" @click="$router.push('add')">新增工单</el-button>
          </el-form-item>
          <el-form-item label="基站名称" prop="organizeCode">
            <el-input
              v-model="filterForm.organizeCode"
              placeholder="请输入基站名称"
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

      <h3>本月需求统计（同比）</h3>
      <div id="build-stats" :style="{ width: '100%', height: '300px' }" />
      <div class="end-stats">
        <div id="build-1" class="end-stats-monitor" />
        <div id="build-2" class="end-stats-monitor2" />
        <div id="build-3" class="end-stats-monitor" />
        <div id="build-4" class="end-stats-monitor" />
        <div id="build-5" class="end-stats-monitor" />
      </div>
      <div class="plan-stats">
        <span class="plan-stats-item active">总规划清单数： 428  件</span>
        <span class="plan-stats-item">有规划清单数：312  件</span>
        <span class="plan-stats-item">未规划清单数：31  件</span>
      </div>
      <el-table
      class="p-table" :cell-class-name="pTableCell" :header-cell-class-name="pTableHead"
        ref="multipleTable"
        v-loading="tableLoading"
        :data="list"
        tooltip-effect="dark"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="需求名称" align="center" />
        <el-table-column prop="ascription" label="所属本地网" align="center" />
        <el-table-column prop="arrive" label="工单抵达时间" align="center" />
        <el-table-column prop="progress" label="需求进度" align="center" />
        <el-table-column prop="time" label="审核时间" align="center" />
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link type="primary">查看</el-link>
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
    </el-card>
  </div>
</template>

<script>
import FilterList from '@/mixins/FilterList'
const mockData = {
  name: 'F武汉蔡甸_军山局BBU01_新能源汽车研究院OCQH-LTE单站验收报告',
  ascription: '武汉市电信局本地网',
  arrive: '2021年11月30日',
  progress: '工程立项',
  time: '2021年11月30日'
}
export default {
  mixins: [FilterList],
  data() {
    return {
      list: Array(10).fill(mockData)
    }
  },
  created() {
    // this.getList();
  },
  mounted() {
    this.drawLine()
    this.drawRing1()
    this.drawRing2()
    this.drawRing3()
    this.drawRing4()
    this.drawRing5()
  },
  methods: {
    buildRingParams({ data, title, color }) {
      return {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '0',
          orient: 'horizontal'
        },
        series: [
          {
            type: 'pie',
            radius: ['70%'],
            avoidLabelOverlap: false,
            color,
            emphasis: {
              label: {
                show: false,
                fontSize: '20',
                formatter: '{d}%'
              }
            },
            data
          }
        ]
      }
    },
    drawRing1() {
      const buildEndChart = this.$echarts.init(
        document.getElementById('build-1')
      )
      const options = this.buildRingParams({
        color: ['#5087EC', '#68BBC4'],
        title: '本月投诉需求',
        data: [
          { value: 1048, name: '本月' },
          { value: 120, name: '上月' }
        ]
      })
      buildEndChart.setOption(options)
    },
    drawRing2() {
      const buildEndChart = this.$echarts.init(
        document.getElementById('build-2')
      )
      buildEndChart.setOption({
        title: {
          text: '本地网需求',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          right: '0',
          top: 20,
          bottom: 20,
          orient: 'vertical'
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            color: ['#5087EC', '#68BBC4', '#58A55C', '#F2BD42', '#EE752F', '#D95040', '#EC50C0'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                position: 'center'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '武汉' },
              { value: 120, name: '黄石' },
              { value: 120, name: '宜昌' },
              { value: 120, name: '襄阳' },
              { value: 120, name: '十堰' },
              { value: 120, name: '荆门' },
              { value: 120, name: '其他' }
            ]
          }
        ]
      })
    },
    drawRing3() {
      const buildEndChart = this.$echarts.init(
        document.getElementById('build-3')
      )
      const options = this.buildRingParams({
        color: ['#FFCB01', '#5AC8FA'],
        title: '省网优需求',
        data: [
          { value: 648, name: '本月' },
          { value: 420, name: '上月' }
        ]
      })
      buildEndChart.setOption(options)
    },
    drawRing4() {
      const buildEndChart = this.$echarts.init(
        document.getElementById('build-4')
      )
      const options = this.buildRingParams({
        color: ['#FF3A30', '#FFCB01'],
        title: '设计院需求',
        data: [
          { value: 648, name: '本月' },
          { value: 400, name: '上月' }
        ]
      })
      buildEndChart.setOption(options)
    },
    drawRing5() {
      const buildEndChart = this.$echarts.init(
        document.getElementById('build-5')
      )
      const options = this.buildRingParams({
        color: ['#5AC8FA', '#34C758'],
        title: '两图两单需求',
        data: [
          { value: 648, name: '本月' },
          { value: 440, name: '上月' }
        ]
      })
      buildEndChart.setOption(options)
    },
    drawRing6() {
      const buildEndChart = this.$echarts.init(
        document.getElementById('build-6')
      )
      const options = this.buildRingParams({
        color: ['#5AC8FA', '#34C758'],
        title: '客服催单率',
        data: [
          { value: 648, name: '本月' },
          { value: 420, name: '上月' }
        ]
      })
      buildEndChart.setOption(options)
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const buildStatsChart = this.$echarts.init(
        document.getElementById('build-stats')
      )
      // 绘制图表
      buildStatsChart.setOption({
        color: ['#2478F2', '#84B7F9'],
        legend: {
          show: true
        },
        tooltip: {},
        xAxis: {

          type: 'category',
          axisLabel: {
            interval: 0
          },
          data: ['武汉', '黄石', '黄冈', '孝感', '随州', '襄阳', '十堰', '神农架林区', '宜昌', '恩施土家族自治州', '荆州', '荆门', '潜江', '天门', '仙桃', '鄂州', '咸宁']
        },
        yAxis: {},
        series: [
          {
            barGap: '0%',
            name: '已有规划',
            type: 'bar',
            data: [5, 20, 36, 10, 18, 20, 5, 20, 32, 10, 10, 20, 7, 20, 36, 10, 8]
          }, {
            name: '无规划',
            type: 'bar',
            data: [5, 8, 36, 18, 10, 20, 20, 32, 10, 10, 20, 7, 20, 32, 10, 10, 20]
          }]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.end-stats {
  display: flex;
  align-items: center;
  justify-content: start;
    margin-bottom: 30px;
    width: 1300px;
}
.end-stats-monitor {
  flex: 2;
  height: 210px;
}
.end-stats-monitor2{
    flex: 3;
  height: 210px;
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
.build-container{
    height: 100%;
    overflow-y: auto;
}
.plan-stats{
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
.plan-stats-item{
  margin-right: 30px;
  color: #8E8E93;
  &.active{
    color: #010101;
  }
}
</style>
