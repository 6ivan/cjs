<!--权限管理-->
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
          <el-form-item label="组织编码" prop="organizeCode">
            <el-input
              v-model="filterForm.organizeCode"
              placeholder="请输入组织编码"
              :maxlength="30"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item label="组织名称" prop="organizeName">
            <el-input
              v-model="filterForm.organizeName"
              placeholder="请输入组织名称"
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
            >新建部门信息</el-button
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
        <el-table-column prop="isRoot" label="是否根节点" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.isAdmin == 1 ? "是" : "不是" }}
            </div>
          </template>
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
        <el-table-column label="启用停用" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.status == 1 ? "启用" : "停用" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link type="primary" @click="link(scope.row)">已办</el-link>
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
    <el-dialog :visible.sync="dialogVisible" width="70%" top="5vh">
      <div slot="title" class="title">入网申请: {{ dialogData.title }}</div>
      <div class="status">
        <div class="statusTitle">工单流转状态</div>
        <div class="reset-steps">
          <div class="steps_item" v-for="(item, index) in step" :key="index">
            <div
              class="stepsIcon"
              :style="`background-color: ${
               ['#34C758',  '#FFCB01', '#FF3A30','#BBBBBB'][item.status]
              };`"
            >
              {{ item.content }}
            </div>
            <span v-if="item.span" class="lineActive"></span>
            <div class="steps_remark">
              <div class="day">{{ item.day }}</div>
              <div class="time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="remarkInfo">备注信息：</div>
      <el-table
      class="p-table" :cell-class-name="pTableCell" :header-cell-class-name="pTableHead"
        v-loading="tableLoading"
        ref="multipleTable"
        :data="infoList"
        tooltip-effect="dark"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="parentId" label="备注信息" align="center">
        </el-table-column>
        <el-table-column prop="parent" label="是否存在" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.isAdmin == 1 ? "是" : "不是" }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="remarkInfo">需求信息：</div>
      <div class="remarkForm">
        <div><span class="lable">当前状态：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">需求编号：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">需求类型：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">本地网：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">区县：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">申请人：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">发起人：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">发起日期：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">厂商：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">需求来源：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">区域类型：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">场景类型：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">优先级：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">站址名称：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">站址地址：</span>{{ remarkForm.aa }}</div>
        <div>
          <span class="lable">扩载频小区名称：</span>{{ remarkForm.aa }}
        </div>
        <div>
          <span class="lable">扩载频小区标识：</span>{{ remarkForm.aa }}
        </div>
        <div><span class="lable">需求频段：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">地理经度：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">地理纬度：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">扇区数量：</span>{{ remarkForm.aa }}</div>
        <div><span class="lable">室内场景：</span>{{ remarkForm.aa }}</div>
      </div>
      <div class="remarkInfo" v-if="status === 0">
        终审意见：
        <div>{{ remarkForm.aa }}</div>
      </div>
      <div class="remarkInfo" v-else-if="status === 1">
        专项行动：
        <div>{{ remarkForm.aa }}</div>
      </div>
      <div class="remarkInfo" v-else-if="status === 2">
        投诉信息：
        <div>
          <el-table
          class="p-table" :cell-class-name="pTableCell" :header-cell-class-name="pTableHead"
            v-loading="tableLoading"
            ref="multipleTable"
            :data="infoList"
            tooltip-effect="dark"
            border
            style="width: 100%"
            stripe
          >
            <el-table-column label="24消失内投诉次数" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.isAdmin }}次</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="parentId"
              label="30日累计投诉次数"
              align="center"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.isAdmin }}次</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="parentId"
              label="重复投诉人员"
              align="center"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.isAdmin }}人</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="parentId"
              label="累计投诉人员"
              align="center"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.isAdmin }}人</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="remarkInfo" v-else-if="status === 3">
        初审结果：
        <div>{{ remarkForm.aa }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi
} from "@/api/department";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],

  name: "department",
  data() {
    return {
      current: 0,
      step: [
        { status: 0, span: true, content: '分公司', day: '2021年11月30日', time: '12:00:00' },
        { status: 0, span: true, content: '分公司', day: '2021年11月30日', time: '12:00:00' },
        { status: 1, span: true, content: '分公司', day: '2021年11月30日', time: '12:00:00' },
        { status: 2, span: true, content: '分公司', day: '2021年11月30日', time: '12:00:00' },
        { status: 3, span: true, content: '分公司', day: '2021年11月30日', time: '12:00:00' },
        { status: 3, span: true, content: '分公司', day: '2021年11月30日', time: '12:00:00' },
        { status: 3, content: '分公司二', day: '2021年11月30日', time: '12:00:00' },
      ],
      dialogVisible: false,
      tableLoading: false,
      dialogTitle: "新建部门信息",
      dialogFormVisible: false,
      status: 2,
      filterForm: {
        systemId: null,
        filterForm: null,
      },
      dialogData: {
        title: 'F武汉蔡甸_军山局BBU01_新能源汽车研究院OCQH-LTE单站验收报告'
      },
      list: [{}, {}],
      infoList: [{ parentId: "投诉信息", isAdmin: 1 }, { parentId: "专项行动", isAdmin: 1 }],
      flag: false, //批量全选状态
      remarkForm: { aa: "暂无" }
    };
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
      this.tableLoading = true;
      getDepartmentApi(param, this.page, this.size)
        .then((res) => {
          this.tableLoading = false;
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
          this.tableLoading = false;
          // getErrer(error, this);
        });
    },
    onClose() {
      this.dialogFormVisible = false;
      this.$refs["elForm"].resetFields();
      this.formData = {};
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
        updateDepartmentApi(params).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.onClose();
            this.getList();
          }
        });
        this.onClose();
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
      this.dialogVisible = true;
    },
  },
  created() {
    // this.getList();
  },
  mounted() { },
};
</script>
<style lang="scss" scoped>
.sj_title {
  line-height: 36px;
}
.pagination-box {
  margin-top: 30px;
}
.reset-steps {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  div {
    position: relative;
    .stepsIcon {
      margin: 0 auto;
      padding: 10px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      margin-bottom: 15px;
      z-index: 9;
    }
    span {
      position: absolute;
      display: block;
      border-bottom: 4px dotted #bbb;
      height: 2px;
      width: 175px;
      top: 25px;
      left: 60px;
    }
  }
}
.time,
.time {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}
.steps_item {
  width: 125px;
}
.remarkInfo {
  margin: 20px 0;
}
.remarkForm {
  display: flex;
  flex-wrap: wrap;
  margin-top: -20px;
}
.remarkForm div {
  margin-right: 100px;
  margin-top: 20px;
}
.remarkInfo > div {
  margin-top: 20px;
}
.lable {
  display: inline-block;
  width: 112px;
  text-align-last: justify;
}
</style>
<style>
.build-container .el-dialog__body {
  padding: 30px 40px;
}
.build-container .el-dialog {
  font-weight: 800;
}
.build-container .el-table {
  font-weight: normal;
}
.build-container .el-dialog .has-gutter th {
  background-color: #f2f2f2;
}
.build-container
  .el-dialog
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped
  td {
  background-color: #f2f2f2;
}
</style>
