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
          <el-form-item label="系统编码" prop="systemCode">
            <el-input
              v-model="filterForm.systemCode"
              placeholder="请输入系统编码"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item label="系统名称" prop="systemName">
            <el-input
              v-model="filterForm.systemName"
              placeholder="请输入系统名称"
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
          <el-button
            @click="dialogFormVisible = true"
            size="mini"
            type="primary"
            >新建系统信息</el-button
          >
        </el-button>
      </div>
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
        <el-table-column
          :reserve-selection="true"
          align="center"
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="系统描述"
          align="center"
        ></el-table-column>
        <el-table-column prop="status" label="启用停用" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.status == 0 ? "停用" : "启用" }}
            </div>
          </template></el-table-column
        >
        <el-table-column prop="systemCode" label="系统编码" align="center">
        </el-table-column>
        <el-table-column prop="systemId" label="系统id" align="center">
        </el-table-column>
        <el-table-column prop="systemName" label="系统名称" align="center">
        </el-table-column>
        <el-table-column label="系统类型" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.type == 1 ? "系统" : "应用" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="系统路径" align="center">
        </el-table-column>
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
        label-width="100px"
      >
        <el-form-item label="系统编码" prop="systemCode">
          <el-input
            v-model="formData.systemCode"
            placeholder="请输入系统编码"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="系统名称" prop="systemName">
          <el-input
            v-model="formData.systemName"
            placeholder="请输入系统名称"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="系统类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择系统类型"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
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
        <el-form-item label="系统路径" prop="url">
          <el-input
            v-model="formData.url"
            placeholder="请输入系统路径"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="系统描述" prop="description">
          <el-input
            type="textarea"
            v-model="formData.description"
            placeholder="请输入系统描述"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handelConfirm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserSystemApi,
  updateUserSystemApi,
  deleteSystemApi,
} from "@/api/system";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],

  name: "userSystem",
  data() {
    return {
      dialogTitle: "新建系统信息",
      dialogFormVisible: false,
      formData: {
        systemCode: null,
        systemName: null,
        type: null,
        description: null,
        status: null,
        systemId: null,
        url: null,
      },
      filterForm: {
        systemId: "",
        filterForm: null,
      },
      rules: {
        systemCode: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9]{0,30}$/,
            message: "编号格式错误",
            trigger: "blur",
          },
        ],
        systemName: [
          {
            required: true,
            message: "请输入系统名称",
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
  methods: {
    getList() {
      //请求表格列表数据
      var param = {};
      if (this.filterForm.systemCode) {
        param.systemCode = this.filterForm.systemCode;
      }
      if (this.filterForm.systemName) {
        param.systemName = this.filterForm.systemName;
      }
      this.loadingList = true;
      getUserSystemApi(param,this.page,this.size)
        .then((res) => {
          this.loadingList = false;
          if (res.code == 200) {
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
    onClose() {
      this.dialogFormVisible = false;
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        let params = {
          ...this.formData,
        };
        updateUserSystemApi(params).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.onClose();
            this.getList();
          }
        });
        this.close();
      });
    },
    batchDelete() {
      this.$confirm("确定批量删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const list = this.multipleSelection.map((item) => item.systemId);
        deleteSystemApi(list).then((res) => {
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
      }).catch(()=>{});
    },
    link(row) {
      this.dialogFormVisible = true;
      this.formData = row;
      this.dialogTitle = "更新系统信息";
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
