<!--权限管理-->
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
          <el-form-item label="权限名称" prop="organizeCode">
            <el-input
              v-model="filterForm.organizeCode"
              placeholder="请输入权限名称"
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
              @click="$router.push('./addPermission')"
              >新增权限</el-button
            >
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
        :row-key="(row) => row.menuId"
        tooltip-effect="dark"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="权限名称" align="center" prop="menuName" />

        <el-table-column label="图标" align="center">
          <template slot-scope="scope">
            <div>
              <i :class="scope.row.icon" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="menuId" align="center" />
        <el-table-column label="权限编码" prop="menuCode" align="center" />
        <el-table-column prop="状态" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link
                type="primary"
                style="margin-right: 10px"
                @click="$router.push(`addPermission?id=${scope.row.menuId}`)"
                >编辑</el-link
              >
              <el-link type="danger" @click="deleteItem(scope.row)"
                >删除</el-link
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
    </el-card>
  </div>
</template>

<script>
import { getPowerApi, deleteMenuApi } from '@/api/power'
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
  mounted() { },
  methods: {
    async deleteItem(item) {
      console.log(item.menuId)
      await this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteMenuApi({},item.menuId)
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } catch (e) {
          console.log(e)
          // TODO handle the exception
        }
      })
      this.getList()
    },
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
