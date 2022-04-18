<!--用户管理-->
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
          <el-form-item label="登录名" prop="loginName">
            <el-input
              v-model="filterForm.loginName"
              placeholder="请输入登录名"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button @click="refreshBtn">重置</el-button>
            <el-button
              v-permission="'permission-user-add'"
              type="primary"
              plain
              @click="$router.push('./editUser')"
              >新增用户</el-button
            >
          </el-form-item>
          <el-form-item prop="status" />
        </el-form>
      </div>
    </el-card>
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
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="status" label="启用停用" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.status == 0 ? "停用" : "启用" }}
            </div>
          </template></el-table-column
        > -->
        <el-table-column prop="userCode" label="用户编码" align="center">
        </el-table-column>
        <el-table-column prop="userId" label="用户id" align="center">
        </el-table-column>
        <el-table-column label="真实姓名" align="center" prop="displayName">
        </el-table-column>
        <el-table-column prop="loginName" label="登录名" align="center">
        </el-table-column>
        <el-table-column prop="userDetail.email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column
          prop="userDetail.phone"
          label="联系电话"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link
                type="primary"
                style="margin-right: 10px"
                @click="open(scope.row)"
                >分配角色</el-link
              >
              <el-link
                v-permission="'permission-user-edit'"
                type="primary"
                style="margin-right: 10px"
                @click="$router.push(`editUser?id=${scope.row.userId}`)"
                >编辑</el-link
              >
              <el-link
                type="danger"
                v-permission="'permission-user-delete'"
                @click="link(scope.row)"
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
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      @close="onClose"
      title="分配角色"
      width="600px"
    >
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="120px"
      >
        <el-form-item label="用户名称">
          <el-input
            v-model="formData.displayName"
            show-word-limit
            disabled
            clearable
            :style="{ width: '202px' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色分配" prop="phone">
          <!-- <el-select
            v-model="recallArrId"
            multiple 
            placeholder="请选择角色"
            clearable
            :style="{ width: '202px' }"
            @change="selectChanged"
          >
            <el-option
              v-for="(item) in typeOptions"
              :key="item.label"
              :label=" item.label"
              :value=" item.value"
            >  </el-option>
          </el-select> -->
          <el-select v-model="recallArrId" multiple placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="handelConfirm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveOrUpdateUser,
  selectPage,
  deteleUserApi,
  bindRole,
  getBindRole,
  // FilterList,
} from "@/api/user";
import { getDepartmentTreeApi } from "@/api/department";
import { getRoleApi, updateRoleApi, deleteRoleApi } from "@/api/role";
import FilterList from "@/mixins/FilterList";

const mockTableData = {
  id: "A1",
  name: "张德帅",
  unitName: "技术部",
  role: "管理员",
  createTime: "2021-01-01",
  status: 1,
};
export default {
  mixins: [FilterList],
  data() {
    return {
      typeOptions: [],
      options: [
        {
          value: "2",
          label: "普通用户",
        },
        {
          value: "1",
          label: "管理员",
        },
      ],
      value1: [],
      formData: {},
      options1: [],
      dialogFormVisible: false,
      list: [mockTableData],
      infoList: [
        { parentId: "投诉信息", isAdmin: 1 },
        { parentId: "专项行动", isAdmin: 1 },
      ],
      flag: false, // 批量全选状态
      remarkForm: { aa: "暂无" },
      rules: {
        loginName: [
          {
            required: true,
            message: "请输入登入账户",
            trigger: "blur",
          },
        ],
        loginPassword: [
          {
            required: true,
            message: "请输入登入密码",
            trigger: "blur",
          },
        ],
      },
      changeSelect: [],
      recallArrId: [],
    };
  },
  created() {
    this.getList();
    getDepartmentTreeApi()
      .then((res) => {
        if (res.code == 200) {
          this.options1 = res.data;
        }
      })
      .catch((error) => {});
  },
  mounted() {},
  methods: {
    getList() {
      //请求表格列表数据
      var param = {
        loginName: this.filterForm.loginName,
      };
      if (this.filterForm.userCode) {
        param.userCode = this.filterForm.userCode;
      }
      if (this.filterForm.loginName) {
        param.loginName = this.filterForm.loginName;
      }
      console.log(param);
      this.loadingList = true;
      selectPage(
        {
          ...param,
          pageSize: this.size,
          pageNumber:this.page
        },
        // this.page,
        // this.size
      )
        .then((res) => {
          this.loadingList = false;
          if (res.code == 200) {
            this.total = res.data.total;
            this.size = res.data.size;
            this.page = res.data.current;
            this.list = res.data.records;
            this.list.forEach((item) => {
              if (item.createTime) {
                item.createTime = item.createTime.substring(0, 10);
              }
            });
          } else {
            // getErrerMessage(res, "getAuthorityManagement", this);
          }
        })
        .catch((error) => {
          this.loadingList = false;
          // getErrer(error, this);
        });
    },

    link(row) {
      this.$confirm("确定删除用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deteleUserApi(row.userId).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
        .catch(() => {});
    },
    async open(row) {
      // console.log(row)
      this.dialogFormVisible = true;
      this.formData.userId = row.userId;
      this.formData.displayName = row.displayName;
      await this.getBindRole(row.userId);
    },
    onClose() {
      this.dialogFormVisible = false;
      this.formData = {};
    },
    handelConfirm() {
      bindRole({
        userId: this.formData.userId,
        roleIds: this.recallArrId,
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: res.msg,
          });
        }
      });
    },
    getBindRole(userId) {
      getBindRole({}, userId).then((res) => {
        console.log(res);
        if (res.code === 200) {
          let optionList = [];
          res.data.roleData.records.forEach((item) => {
            let params = {
              value: "",
              label: "",
            };
            params.label = item.roleName;
            params.value = item.roleId;

            optionList.push(params);
          });
          this.typeOptions = optionList;
          this.recallArrId = res.data.bindData;
        }
      });
    },
    handleChange(value) {
      this.form.parentId = value[value.length - 1];
    },
    handleCurrentChange(value){
      this.page = value
      this.getList()
    },
    handleSizeChange(value){
      this.size = value
      this.getList()
    }
  },
};
</script>
<style lang="scss" scoped>
.pagination-box {
  margin-top: 30px;
}
</style>
