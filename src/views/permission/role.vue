<!--权限管理-->
<template>
  <div class="build-container">
    <el-card class="card1 searchLIst">
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
          <el-form-item label="角色名" prop="organizeCode">
            <el-input
              v-model="filterForm.organizeCode"
              placeholder="请输入角色名"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button @click="refreshBtn">重置</el-button>
            <el-button type="primary" plain @click="$router.push('./editRole')"
              >新增角色</el-button
            >
          </el-form-item>
          <el-form-item prop="status" />
        </el-form>
      </div>
    </el-card>
    <div class="card">
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
        :row-key="(row) => row.orgId"
        tooltip-effect="dark"
        border
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
        <el-table-column label="排序" type="index" width="50">
        </el-table-column>
        <el-table-column label="角色编码" align="center" prop="roleCode">
        </el-table-column>
        <el-table-column label="角色名称" align="center" prop="roleName">
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <el-tag>{{
              scope.row.type === 1 ? "系统角色" : "第三方角色"
            }}</el-tag>
            <!-- <el-tag  type="warning">规划室成员</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="是否管理员" align="center" prop="isAdmin">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.isAdmin === 1 ? "是" : "不是" }}</el-tag>
            <!-- <el-tag  type="warning">规划室成员</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="启用/停用" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.status === 1 ? "启用" : "停用" }}</el-tag>
            <!-- <el-tag  type="warning">规划室成员</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="270">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link
                type="primary"
                style="margin-right: 10px"
                @click="showSetting(scope.row)"
                >权限设置</el-link
              >
              <el-link
                type="primary"
                style="margin-right: 10px"
                @click="showSetting1(scope.row)"
                >部门设置</el-link
              >
              <el-link
                type="primary"
                style="margin-right: 10px"
                @click="$router.push(`./editRole?id=${scope.row.roleId}`)"
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
    </div>

    <el-dialog
      :visible.sync="edit.dialogVisible"
      title="权限设置"
      width="600px"
      @close="onClose"
    >
      <div class="edit-role">
        <div class="edit-role-right">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="角色名称">
              <el-input
                v-model="form.name"
                placeholder="请输入用户编码"
                disabled
                style="width: 202px"
              />
            </el-form-item>
            <el-form-item label="所属部门">
              <el-cascader
                v-model="form.parentId"
                :options="options1"
                placeholder="请选择上级部门"
                :props="{
                  checkStrictly: true,
                  checkStrictly: true,
                  multiple: false,
                  expandTrigger: 'hover',
                  value: 'organizeId',
                  label: 'organizeName',
                  children: 'children',
                  multiple: true,
                }"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="菜单权限">
              <div class="edit-role-title">
                <div>
                  <!-- <el-checkbox
                    v-model="menuExpand"
                    @change="handleCheckedTreeExpand($event, 'menu')"
                    >展开/折叠</el-checkbox
                  > -->
                  <el-checkbox v-model="checked" @change="checkedAll($event)"
                    >全选/全不选</el-checkbox
                  >
                  <el-checkbox
                    v-model="checked2"
                    @change="handleCheckedTreeConnect($event, 'menu')"
                    >父子联动</el-checkbox
                  >
                </div>
              </div>
              <div class="edit-role-tree">
                <el-tree
                  ref="roleTree"
                  node-key="menuId"
                  :data="edit.roleList"
                  :expand-on-click-node="false"
                  show-checkbox
                  :default-checked-keys="showCheckBox"
                  :check-strictly="!checked2"
                  :props="{
                    children: 'children',
                    label: 'menuName',
                  }"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="edit.dialogVisible = false"
                >取 消</el-button
              >
              <el-button type="primary" size="small" @click="submit"
                >确 定</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="edit.dialogVisible1"
      title="部门设置"
      width="600px"
      @close="onClose"
    >
      <div class="edit-role">
        <div class="edit-role-right">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="角色名称">
              <el-input v-model="form1.name" disabled style="width: 202px" />
            </el-form-item>
            <el-form-item label="所属部门">
              <!-- <el-cascader
                v-model="form1.organizeIds"
                :options="options1"
                placeholder="请选择上级部门"
                :props="{
                  checkStrictly: true,
                  expandTrigger: 'hover',
                  value: 'organizeId',
                  label: 'organizeName',
                  children: 'children',
                  multiple: true,
                }"
                clearable
                @change="handleChange1"
              ></el-cascader> -->
              <div class="edit-role-tree">
                <el-tree
                  ref="roleTree1"
                  accordion
                  node-key="organizeId"
                  :data="options1"
                  :expand-on-click-node="false"
                  show-checkbox
                  :props="{
                    children: 'children',
                    label: 'organizeName',
                  }"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="edit.dialogVisible1 = false"
                >取 消</el-button
              >
              <el-button type="primary" size="small" @click="submit1"
                >确 定</el-button
              >
            </el-form-item>
          </el-form>

          <!-- <div style="text-align: right;">
            <el-switch
              v-model="edit.selectAll"
              active-text="全选/全不选"
              @change="selectAllChange"
            />
          </div> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleListApi, getOrganizeListApi, bindOrganizeApi, getPowerApi } from '@/api/power'
import {
  getDepartmentTreeApi
} from "@/api/department";
import { getRoleApi, updateRoleApi, deleteRoleApi, bindOrganize1Api, getMenuByRoleIdApi, authorityBindingApi, getBindOrganizeApi } from "@/api/role";
import FilterList from '@/mixins/FilterList'
const mockData = JSON.stringify([
  {
    enabled: false, name: '数字科技', id: 2,
    child: [
      {
        enabled: false, name: '用户系统', id: 3,
        child: [{
          enabled: false, name: '用户管理', id: 4,
          child: [{
            enabled: false, name: '用户查询', id: 5
          }, {
            enabled: false, name: '用户删除', id: 6
          }]
        }]
      },
      { enabled: false, name: '数据底座', id: 7 }
    ]
  }
])
const mockTableData = {
  id: 'A1',
  name: '张德帅',
  unitName: '技术部',
  role: '管理员',
  isAdmin: '是',
  createTime: '2021-01-01',
  status: 1
}
export default {
  mixins: [FilterList],
  data() {
    return {
      form1: {},
      form: {},
      options: {},
      options1: [],
      showCheckBox: [],
      defaultExpandAll: false,
      menuExpand: false,
      list: [mockTableData],
      infoList: [{ parentId: '投诉信息', isAdmin: 1 }, { parentId: '专项行动', isAdmin: 1 }],
      flag: false, // 批量全选状态
      remarkForm: { aa: '暂无' },
      current: {},
      menuNodeAll: false,
      checked: false,
      checked2: false,
      currentSelectRole: [],
      edit: {
        dialogVisible: false,
        dialogVisible1: false,

        defaultExpandAll: false,
        selectAll: false,
        department: 1,
        currentDepartment: [],
        roleList: [],
        departmentList: [
          {
            id: 1, name: '系统部门',
            roles: JSON.parse(mockData)
          },
          {
            id: 2, name: '规划室内',
            roles: JSON.parse(mockData)
          },
          {
            id: 3, name: '建设室',
            roles: JSON.parse(mockData)
          },
          {
            id: 4, name: '维护室',
            roles: JSON.parse(mockData)
          },
          {
            id: 5, name: '优化室',
            roles: JSON.parse(mockData)
          },
          {
            id: 6, name: '客服中心',
            roles: JSON.parse(mockData)
          }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
    this.edit.currentDepartment = this.edit.departmentList[0]
    getDepartmentTreeApi()
      .then((res) => {
        if (res.code == 200) {
          this.options1 = res.data;
        }
      })
      .catch((error) => {
      });
  },
  methods: {
    handleCheckedTreeExpand(value, type) {
      let treeList = this.edit.roleList;
      console.log(this.$refs.roleTree.store.nodesMap, treeList[0]);
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.roleTree.store.nodesMap[i].expanded = value;

      }
    },
    handleChange(value) {
      console.log(this.form1.organizeIds);

    },
    handleChange1(value) {
      console.log(this.form1.organizeIds);

    },
    checkedAll(value) {
      console.log(this.edit.roleList);
      //       this.$refs.roleTree.setCheckedNodes(value ? this.edit.roleList: []);
      if (this.checked) {
        //全选
        this.$refs.roleTree.setCheckedNodes(this.edit.roleList);
        // this.$refs.roleTree.setCheckedNodes(this.edit.roleList);
      } else {
        //取消选中
        this.$refs.roleTree.setCheckedKeys([]);
      }
    },
    handleCheckedTreeConnect(value, type) {
      this.checked2 = value ? true : false;
    },
    showSetting(row) {
      this.showCheckBox = []
      this.edit.dialogVisible = true
      this.form.name = row.roleName
      this.form.roleId = row.roleId
      this.getPower()
      getOrganizeListApi().then(res => {
        this.edit.departmentList = res.data
      })
      let formData = new FormData()
      formData.append("roleId", parseInt(row.roleId));
      getMenuByRoleIdApi(formData).then(res => {
        res.data.forEach(i => {
          this.showCheckBox.push(i.menuId)
        })
        this.$refs.roleTree.setCheckedKeys(this.showCheckBox)
      })
    },
    showSetting1(row) {
      this.edit.dialogVisible1 = true
      this.form1.name = row.roleName
      this.form1.roleId = row.roleId
      console.log(this.form1.organizeIds, this.edit.roleList);
      getBindOrganizeApi(row.roleId).then(res => {
        this.$refs.roleTree1.setCheckedKeys(res.data.bindData)
      })
    },
    getPower() {
      getPowerApi({}).then(res => {
        this.edit.roleList = res.data
      })
    },
    getRoleList() {
      getRoleListApi({
        'pageNumber': this.page,
        'pageSize': this.size
      }).then(res => {
        if (res.data && res.code === 200) {
          this.list = res.data.records
          this.total = res.data.total
          this.page = res.data.current
          this.size = res.data.size
        }
      })
    },
    selectDepartment(index) {
      console.log(index)
      // this.edit.currentDepartment = this.edit.departmentList[index]
    },
    selectAllChange(selectAll) {
      const allKeys = []
      if (selectAll) {
        const getKeys = (data, keys) => {
          data.forEach(item => {
            keys.push(item.id)
            if (item.child && item.child.length > 0) {
              getKeys(item.child, keys)
            }
          })
          return keys
        }
        getKeys(this.edit.currentDepartment.roles, allKeys)
      }
      this.$refs.roleTree.setCheckedKeys(allKeys)
    },
    submit() {
      let organizeIds = this.$refs.roleTree.getCheckedKeys()
      console.log(organizeIds)
      let arr = organizeIds
      var newArr = new Set(arr.concat(this.showCheckBox))
      newArr = [...newArr]
      let arr3 = []
      let arr4 = [];
      for (var i = 0; i < newArr.length; i++) {
        if (arr.indexOf(newArr[i]) === -1) {
          arr3.push(newArr[i]);
        }
      }
      for (var o = 0; o < newArr.length; o++) {
        if (this.showCheckBox.indexOf(newArr[o]) === -1) {
          arr4.push(newArr[o]);
        }
      }
      let params = { delId: arr3, insId: arr4, roleId: parseInt(this.form.roleId) }
      authorityBindingApi(params).then(res => { })
      // bindOrganizeApi({
      //   organizeIds
      //   // roleID
      // }).then(res => {
      //   this.$message.success(res.msg)
      // })
      this.edit.dialogVisible = false
      // this.$message.success(`设置${this.edit.currentDepartment.name}的权限ID为 ${keys}`)
    },
    submit1() {
      let arr = []
      let organizeIds = this.$refs.roleTree1.getCheckedKeys()
      let formData = new FormData()
      formData.append("roleId", parseInt(this.form1.roleId));
      formData.append("organizeIds", organizeIds);
      bindOrganize1Api(formData).then(res => {

      })
      this.edit.dialogVisible1 = false
    },
    onClose() {
      this.form1 = {}
      this.form2 = {}
    },
    batchDelete() {
      console.log(this.multipleSelection);
      this.$confirm("确定批量删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(this.multipleSelection);
        const list = this.multipleSelection.map((item) => item.roleId);
        deleteRoleApi(list).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.multipleSelection = [];
          this.$nextTick(() => {
            this.$refs.multipleTable.clearSelection();
          });
          this.getList();
        });
      }).catch(() => { });
    },
    getList() { },
    link(row) {
      this.dialogVisible = true
    },
    handleCurrentChange(value){
       this.page = value
      this.getList()
    },
    handleSizeChange(value){
      this.size = value
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination-box {
  margin-top: 30px;
}
.edit-role-right,
.edit-role-left {
  width: 100%;
}
.mt-10 {
  margin-top: 10px;
}
.mr-10 {
  margin-right: 10px;
}
.ml-10 {
  margin-left: 10px;
}
.edit-role-radio {
  height: 30px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
}
.edit-role-radio:nth-child(2n) {
  background: #f2f2f2;
}
.edit-role-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.edit-role-tree {
  overflow: auto;
}
</style>
