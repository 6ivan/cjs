<!--入网匹配-->
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
          <el-form-item label="需求工单号" prop="order.wordno">
            <el-input
              v-model="filterForm.order.wordno"
              placeholder="请输入需求工单号"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <el-form-item label="基站名称" prop="stationName">
            <el-input
              v-model="filterForm.stationName"
              placeholder="请输入基站名称"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <el-form-item label="基站号" prop="stationNumber">
            <el-input
              v-model="filterForm.stationNumber"
              placeholder="请输入基站号"
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
    <el-card class="box-card card1">
      <el-table
        class="p-table"
        :cell-class-name="pTableCell"
        :header-cell-class-name="pTableHead"
        ref="multipleTable"
        v-loading="tableLoading"
        :data="list"
        tooltip-effect="dark"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="order.wordno"
          label="需求工单号"
          align="center"
        />
        <el-table-column
          label="站址名称"
          align="center"
          prop="order.sitename"
        />
        <el-table-column label="站址坐标" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order.lng }},{{ scope.row.order.lat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order.city" label="本地网" align="center" />
        <el-table-column prop="order.initdate" label="发起时间" align="center">
          <!-- <template slot-scope="scope">
            <span>{{  }}</span>
          </template> -->
        </el-table-column>

        <el-table-column prop="stationNumber" label="基站号" align="center" />
        <el-table-column prop="stationName" label="基站名称" align="center" />
        <el-table-column label="基站类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.stationType == 1">LET宏站</span>
            <span v-if="scope.row.stationType == 2">SA宏站</span>
            <span v-if="scope.row.stationType == 3">SA室内站</span>
          </template>
        </el-table-column>
        <el-table-column prop="creationTime" label="申请时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.creationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link
                @click="hanleconfirm(scope.row)"
                type="success"
                style="margin-right: 10px"
                >确认匹配</el-link
              >
              <el-link @click="hanlecancel(scope.row)" type="primary"
                >匹配有误</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="filterForm.pageNumber"
          :page-size="filterForm.pageSize"
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
import { accessMatchPage, accessMatch } from "@/api/plan";

import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  data() {
    return {
      filterForm: {
        pageNumber: 1,
        pageSize: 10,
        stationName: null,
        stationNumber: null,
        order: {
          wordno: null,
        },
      },
      total: 0,
      list: [],
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      accessMatchPage(this.filterForm).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.filterForm.pageSize = res.data.size;
          this.filterForm.pageNumber = res.data.current;
          this.list = res.data.records;
          this.list.forEach((item) => {
            if (item.creationTime)
              item.creationTime = item.creationTime.substring(0, 10);
          });
        }
      });
    },
    hanleconfirm(row) {
      // 确认匹配
      let formData = new FormData();
      formData.append("id", row.id);
      formData.append("isMatched", 1);
      accessMatch(formData).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getList();
        }
      });
    },
    hanlecancel(row) {
      //匹配有误
      // 确认匹配
      let formData = new FormData();
      formData.append("id", row.id);
      formData.append("isMatched", 0);
      accessMatch(formData).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getList();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.build-container {
  height: 100%;
  overflow: auto;
}
.pagination-box {
  margin-top: 30px;
}
.btn-group-full {
  width: 300px;
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
.mb-20 {
  margin-bottom: 20px;
}
</style>
