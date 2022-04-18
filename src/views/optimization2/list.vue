<!--优化室列表-->
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
          <el-form-item prop="organizeCode">
            <el-select v-model="filterOptions.type" placeholder="请选择预警类型">
              <el-option
                v-for="item in filterOptions.types"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="organizeCode">
            <el-select v-model="filterOptions.state" placeholder="请选择工单状态">
              <el-option
                v-for="item in filterOptions.status"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
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
      <el-table
      class="p-table" :cell-class-name="pTableCell" :header-cell-class-name="pTableHead"
        ref="multipleTable"
        v-loading="tableLoading"
        :data="list"
        :row-key="(row) => row.menuId"
        tooltip-effect="dark"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="预警类型" prop="menuId" align="center" />
        <el-table-column label="工单所属区域" align="center" prop="menuName" />
        <el-table-column label="工单状态" prop="menuCode" align="center" />
        <el-table-column label="预警对象" prop="menuCode" align="center" />
        <el-table-column prop="createTime" label="投诉时间" align="center" />
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link
                type="primary"
                style="margin-right: 10px"
                @click="$router.push(`detail?id=1`)"
              >查看</el-link>
              <el-link type="danger" @click="link(scope.row)">催办</el-link>
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
import { getPowerApi } from '@/api/power'
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
      filterOptions: {
        types: [{ name: '大面积投诉' }, { name: '重复基站投诉' }],
        status: [{ name: '未解决待查修' }, { name: '已解决待查修' }],
        type: '大面积投诉',
        state: '未解决待查修'
      },
      list: [mockTableData],
      infoList: [
        { parentId: '投诉信息', isAdmin: 1 },
        { parentId: '专项行动', isAdmin: 1 }
      ],
      flag: false, // 批量全选状态
      remarkForm: { aa: '暂无' }
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      var a = {}
      getPowerApi(a).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total
          this.size = res.data.size
          this.page = res.data.current
          this.list = res.data
        }
      })
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
