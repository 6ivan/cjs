<!--权限管理-->
<template>
  <div class="rules-container">
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
          <!-- <el-form-item label="用户编码" prop="userCode">
            <el-input
              v-model="filterForm.userCode"
              :maxlength="30"
              placeholder="请输入用户编码"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="登录名" prop="loginName">
            <el-input
              v-model="filterForm.loginName"
              placeholder="请输入登录名"
              :maxlength="20"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button @click="refreshBtn">重置</el-button>
          </el-form-item>
          <el-form-item prop="status"></el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="sj_title">
          <i class="el-icon-s-unfold"></i>权限管理列表
        </span>
        <el-button style="float: right; padding: 3px 0" type="text">
          <el-button @click="addUser" size="mini" type="primary"
            >新建用户信息</el-button
          >
        </el-button>
      </div>
      <el-table
      class="p-table" :cell-class-name="pTableCell" :header-cell-class-name="pTableHead"
        v-loading="tableLoading"
        ref="multipleTable"
        :data="list"
        :row-key="(row) => row.id"
        tooltip-effect="dark"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="status" label="启用停用" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.status == 0 ? "停用" : "启用" }}
            </div>
          </template></el-table-column
        >
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
        <!-- <el-table-column prop="type" label="类型" align="center">
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link type="primary" @click="link(scope.row)">编辑</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="page"
          :page-size="size"
          :page-sizes="[5, 10, 15, 20]"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="dialogFormVisible"
      @close="onClose"
      :title="dialogTitle"
    >
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="120px"
      >
        <el-form-item label="真实姓名" prop="displayName">
          <el-input
            v-model="formData.displayName"
            placeholder="请输入真实姓名"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input
            type="number"
            v-model="formData.phone"
            placeholder="请输入联系方式"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="登入账户" prop="loginName">
          <el-input
            v-model="formData.loginName"
            placeholder="请输入登入账户"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="loginPassword">
          <el-input
            show-password
            v-model="formData.loginPassword"
            placeholder="请输入登录密码"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item
          show-password
          v-show="dialogTitle == '新建用户信息'"
          label="确认登录密码"
          prop="Confirmpassword"
        >
          <el-input
            v-model="formData.Confirmpassword"
            placeholder="请再次确认您的登录密码"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.userDetail.email"
            placeholder="请输入邮箱"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用停用" prop="status">
          <el-select
            v-model="formData.status"
            placeholder="请选择启用停用"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in statusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handelCancel">取 消</el-button>
        <el-button type="primary" @click="handelConfirm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveOrUpdateUser,
  selectPage,
  // FilterList,
} from "@/api/user";
import { encrypt, decrypt } from "@/utils/auth";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  name: "user",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.loginPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogTitle: "新建用户信息",
      dialogFormVisible: false,
      formData: {
        loginName: null,
        loginPassword: null,
        Confirmpassword: null,
        status: null,
        userDetail: {
          realName: null,
          displayName: null,
          email: null,
          phone: null,
        },
      },
      filterForm: {
        userCode: "",
        loginName: "",
        entity: {},
      },
      rules: {
        Confirmpassword: [
          {
            validator: validatePass2,
            required: true,
            trigger: "change",
          },
        ],
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
        loginPassword: [
          {
            required: true,
            message: "请输入登入密码",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号码",
            required: true,
            trigger: "blur",
          },
          {
            pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
            message: "手机号格式错误",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择系统类型",
            trigger: "change",
          },
        ],
        description: [],
        status: [],
        systemId: [],
        url: [],
      },
      typeOptions: [
        {
          label: "系统",
          value: 1,
        },
        {
          label: "应用",
          value: 2,
        },
      ],
      statusOptions: [
        {
          label: "停用 ",
          value: 0,
        },
        {
          label: "启用",
          value: 1,
        },
      ],
      flag: false, //批量全选状态
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //新增
    addUser() {
      this.reset();
      this.dialogFormVisible = true;
    },
    getList() {
      //请求表格列表数据
      var param = {};
      if (this.filterForm.userCode) {
        param.userCode = this.filterForm.userCode;
      }
      if (this.filterForm.loginName) {
        param.loginName = this.filterForm.loginName;
      }
      this.loadingList = true;
      selectPage(param, this.page, this.size)
        .then((res) => {
          this.loadingList = false;
          if (res.code == 200) {
            console.log(res.data.records);
            this.total = res.data.total;
            this.size = res.data.size;
            this.page = res.data.current;
            this.list = res.data.records;
          } else {
            // getErrerMessage(res, "getAuthorityManagement", this);
          }
        })
        .catch((error) => {
          this.loadingList = false;
          // getErrer(error, this);
        });
    },
    reset() {
      this.formData = {
        loginName: null,
        loginPassword: null,
        Confirmpassword: null,
        status: null,
        userDetail: {
          displayName: null,
          realName: null,
          email: null,
          phone: null,
        },
      };
    },
    onClose() {
      this.dialogFormVisible = false;
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelCancel() {
      this.$refs["elForm"].resetFields();
      this.dialogFormVisible = false;
    },
    handelConfirm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        let params = {
          displayName: this.formData.displayName,
          loginName: this.formData.loginName,
          loginPassword: encrypt(this.formData.loginPassword),
          userDetail: {
            phone: this.formData.userDetail.phone,
            email: this.formData.userDetail.email,
            realName: this.formData.userDetail.displayName,
          },
        };
        saveOrUpdateUser(params).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.onClose();
            this.getList();
          }
        });
        this.close();
      });
    },
    link(row) {
      this.dialogFormVisible = true;
      if (row.userDetail) {
        row.userDetail = {};
      }
      this.formData = row;
      this.dialogTitle = "编辑用户信息";
    },
  },
  created() {
    this.getList();
  },
  mounted() {},
};
</script>
<style scoped>
.sj_title {
  line-height: 36px;
}
.pagination-box {
  margin-top: 30px;
}
</style>
