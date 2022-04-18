<!--部门管理-->
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
          <el-form-item label="部门名称" prop="organizeCode">
            <el-input
              v-model="filterForm.organizeCode"
              placeholder="请输入部门名称"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button @click="refreshBtn">重置</el-button>
            <el-button
              type="primary"
              plain
              @click="$router.push('./editDepartment')"
              >新增部门</el-button
            >
          </el-form-item>
          <el-form-item prop="status" />
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card card1">
      <div class="table-select-box">
        <i class="el-icon-warning"></i>
        <div class="text">
          已选择 <span>{{ multipleSelection.length }}</span> 项
        </div>
        <el-divider direction="vertical"></el-divider>
        <el-link
          v-if="multipleSelection.length"
          type="primary"
          @click="batchDelete"
          >批量删除</el-link
        >
      </div>
      <el-table
        class="p-table"
        :cell-class-name="pTableCell"
        :header-cell-class-name="pTableHead"
        ref="multipleTable"
        v-loading="tableLoading"
        :data="list"
        :row-key="(row) => row.organizeId"
        tooltip-effect="dark"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          :reserve-selection="true"
          align="center"
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column prop="organizeCode" label="组织编码" align="center">
        </el-table-column>
        <el-table-column prop="organizeLevel" label="组织级别" align="center">
        </el-table-column>
        <el-table-column prop="organizeName" label="组织名称" align="center">
        </el-table-column>
        <el-table-column prop="systemId" label="系统ID" align="center">
        </el-table-column>
        <el-table-column prop="organizeId" label="组织id" align="center">
        </el-table-column>
        <el-table-column prop="parentId" label="父级ID" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link
                type="primary"
                style="margin-right: 10px"
                @click="$router.push(`editDepartment?id=${scope.row.organizeId}`)"
                >编辑</el-link
              >
              <!-- <el-link type="danger" @click="link(scope.row)">删除</el-link> -->
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
import {
  getDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi,
  getDepartmentTreeApi
} from "@/api/department";
import FilterList from '@/mixins/FilterList'
const mockTableData = {
  id: 'A1',
  name: '张德帅',
  unitName: '技术部',
  role: '管理员',
  createTime: '2021-01-01',
  status: 1
}
export default {
  mixins: [FilterList],
  data() {
    return {
      list: [mockTableData],
      infoList: [{ parentId: '投诉信息', isAdmin: 1 }, { parentId: '专项行动', isAdmin: 1 }],
      flag: false, // 批量全选状态
      remarkForm: { aa: '暂无' }
    }
  },
  created() {
    this.getList();
  },
  mounted() {
  },
  methods: {
    getList() {
      //请求表格列表数据
      var param = {};
      if (this.filterForm.organizeCode) {
        param.organizeCode = this.filterForm.organizeCode;
      }
      if (this.filterForm.organizeName) {
        param.organizeName = this.filterForm.organizeName;
      }
      getDepartmentTreeApi()
        .then((res) => {
          this.tableLoading = false;
          if (res.code == 200) {
            this.total = res.data.total;
            this.size = res.data.size;
            this.page = res.data.current;
            this.list = res.data;
            this.list.forEach((item) => {
              if (item.createTime) {
                item.createTime = item.createTime.substring(0, 10);
              }

            });
          } else {
          }
        })
        .catch((error) => {

        });
    },
    batchDelete() {
      this.$confirm("确定批量删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const list = this.multipleSelection.map(
          (item) => item.organizeId
        );
        deleteDepartmentApi(list).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.multipleSelection = [];
          this.$nextTick(() => {
            this.$refs.multipleTable.clearSelection();
          });
          this.searchBtn();
        });
      }).catch(() => { });
    },
    link(row) {
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination-box {
  margin-top: 30px;
}
</style>
</style>
