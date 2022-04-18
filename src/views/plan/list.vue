<!--需求清单-->
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
          <el-form-item label="工单编号" prop="workOrderNumber">
            <el-input
              v-model="filterForm.workOrderNumber"
              placeholder="请输入工单编号"
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
    <div class="box-card">
      <div class="card">
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
            label="工单编号"
            prop="workOrderNumber"
            align="center"
          />
          <el-table-column label="预警对象" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderType < 4">
                {{ scope.row.region }}
              </span>
              <span v-else-if="scope.row.workOrderType == 4">{{
                scope.row.baseNumber
              }}</span>
              <span v-if="scope.row.workOrderType == 5">{{
                scope.row.telephone
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="工单编号"
            prop="workOrderNumber"
            align="center"
          />
          <el-table-column label="工单类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderType == 1">疑难工单</span>
              <span v-if="scope.row.workOrderType == 2">专项工单</span>
              <span v-if="scope.row.workOrderType == 3">贬损工单</span>
              <span v-if="scope.row.workOrderType == 4">重复基站</span>
              <span v-if="scope.row.workOrderType == 5">重复用户</span>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="工单所属区域" align="center">
          </el-table-column>
          <el-table-column label="工单状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderState == 0">待处理</span>
              <span v-if="scope.row.workOrderState == 1">已接收</span>
              <span v-if="scope.row.workOrderState == 2">已解决</span>
              <span v-if="scope.row.workOrderState == 3">未解决</span>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="投诉时间" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template slot-scope="scope">
              <div class="table-btn">
                <el-link
                  @click="accept(scope.row.workOrderId)"
                  type="success"
                  style="margin-right: 10px"
                  >接收</el-link
                >
                <el-link @click="hanlesee(scope.row)" type="primary"
                  >查看</el-link
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="filterForm.pageNumber"
            :limit.sync="filterForm.pageSize"
            :page-sizes="[5, 10, 15, 20]"
            @pagination="getList"
          />
        </div>
      </div>
      <div class="card">
        <div class="btn-group-full mt-30 mb-20" :stretch="true">
          <span
            v-for="(tab, index) in serverList.tabs"
            :key="index"
            class="tab-btn"
            :class="index === serverList.tabIndex ? 'active' : ''"
            @click="changePlanTab(index)"
          >
            {{ tab }}</span
          >
        </div>
        <el-table
          class="p-table"
          :cell-class-name="pTableCell"
          :header-cell-class-name="pTableHead"
          :data="list2"
          tooltip-effect="dark"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            label="工单编号"
            prop="workOrderNumber"
            align="center"
          />
          <el-table-column label="预警对象" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderType < 4">
                {{ scope.row.region }}
              </span>
              <span v-else-if="scope.row.workOrderType == 4">{{
                scope.row.baseNumber
              }}</span>
              <span v-if="scope.row.workOrderType == 5">{{
                scope.row.telephone
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="工单类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderType == 1">疑难工单</span>
              <span v-if="scope.row.workOrderType == 2">专项工单</span>
              <span v-if="scope.row.workOrderType == 3">贬损工单</span>
              <span v-if="scope.row.workOrderType == 4">重复基站</span>
              <span v-if="scope.row.workOrderType == 5">重复用户</span>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="工单所属区域" align="center">
          </el-table-column>
          <el-table-column label="工单状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.workOrderState == 0">待处理</span>
              <span v-if="scope.row.workOrderState == 1">已接收</span>
              <span v-if="scope.row.workOrderState == 2">已解决</span>
              <span v-if="scope.row.workOrderState == 3">未解决</span>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="投诉时间" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template slot-scope="scope">
              <div class="table-btn">
                <el-link @click="hanlesee(scope.row)" type="primary"
                  >查看</el-link
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <pagination
            v-show="total2 > 0"
            :total="total2"
            :page.sync="filterForm2.pageNumber"
            :limit.sync="filterForm2.pageSize"
            :page-sizes="[5, 10, 15, 20]"
            @pagination="getList2"
          />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="70%" top="5vh">
      <div slot="title" class="title">入网申请: {{ dialogData.title }}</div>
      <div class="status">
        <div class="statusTitle">工单流转状态</div>
        <div class="reset-steps">
          <div class="steps_item" v-for="(item, index) in step" :key="index">
            <div
              class="stepsIcon"
              :style="`background-color: ${
                ['#34C758', '#FFCB01', '#FF3A30', '#BBBBBB'][item.status]
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
        class="p-table"
        :cell-class-name="pTableCell"
        :header-cell-class-name="pTableHead"
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
            class="p-table"
            :cell-class-name="pTableCell"
            :header-cell-class-name="pTableHead"
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
    <el-dialog :visible.sync="dialogVisible2" width="30%">
      <div class="content">
        <div class="title">工单分类</div>
        <div>
          <div class="btngroup">
            <el-button @click="hanleaccept(1)">已规划工单</el-button>
            <el-button @click="hanleaccept(0)">待规划工单</el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getConstructionApi, acceptOrder } from "@/api/plan";
import FilterList from "@/mixins/FilterList";
import { number } from "echarts";
export default {
  mixins: [FilterList],
  data() {
    return {
      status: 2,
      orderId: null,
      step: [
        {
          status: 0,
          span: true,
          content: "分公司",
          day: "2021年11月30日",
          time: "12:00:00",
        },
        {
          status: 0,
          span: true,
          content: "分公司",
          day: "2021年11月30日",
          time: "12:00:00",
        },
        {
          status: 1,
          span: true,
          content: "分公司",
          day: "2021年11月30日",
          time: "12:00:00",
        },
        {
          status: 2,
          span: true,
          content: "分公司",
          day: "2021年11月30日",
          time: "12:00:00",
        },
        {
          status: 3,
          span: true,
          content: "分公司",
          day: "2021年11月30日",
          time: "12:00:00",
        },
        {
          status: 3,
          span: true,
          content: "分公司",
          day: "2021年11月30日",
          time: "12:00:00",
        },
        {
          status: 3,
          content: "分公司二",
          day: "2021年11月30日",
          time: "12:00:00",
        },
      ],
      dialogData: {
        title: "F武汉蔡甸_军山局BBU01_新能源汽车研究院OCQH-LTE单站验收报告",
      },
      list: [{}, {}],
      infoList: [
        { parentId: "投诉信息", isAdmin: 1 },
        { parentId: "专项行动", isAdmin: 1 },
      ],
      flag: false, //批量全选状态
      remarkForm: { aa: "暂无" },
      dialogVisible: false,
      dialogVisible2: false,
      filterForm: {
        workOrderNumber: null,
        workOrderState: 0,
        pageNumber: 1,
        pageSize: 10,
      },
      filterForm2: {
        pageNumber: 1,
        pageSize: 10,
        workOrderState: 1,
        isPlanned: 1,
      },
      list: [],
      list2: [],
      total: 0,
      total2: 0,
      serverList: {
        tabIndex: 0,
        tabs: ["已有规划", "无规划"],
      },
    };
  },
  created() {
    this.changePlanTab(0);
    this.getList();
    this.getList2();
  },
  mounted() {},
  methods: {
    accept(id) {
      this.orderId = id;
      this.dialogVisible2 = true;
      console.log(this.orderId);
    },
    hanleaccept(isPlanned) {
      console.log(this.orderId);
      let formData = new FormData();
      formData.append("isPlanned", isPlanned);
      formData.append("orderId", this.orderId);
      acceptOrder(formData).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.dialogVisible2 = false;
          this.getList();
          this.getList2();
        }
        console.log(res);
      });
    },
    hanlesee(row) {
      //查看
      this.$router.push({
        path: "/plan/detail",
        query: row,
      });
    },
    changePlanTab(index) {
      this.serverList.tabIndex = index;
      this.filterForm2.isPlanned = index == 1 ? 0 : 1;
      this.getList2();
    },
    getList() {
      getConstructionApi({}, this.filterForm).then((res) => {
        this.loadingList = false;
        if (res.code == 200) {
          this.total = res.data.total;
          this.filterForm.pageSize = res.data.size;
          this.filterForm.pageNumber = res.data.current;
          this.list = res.data.records;
          this.list.forEach((item) => {
            if (item.creationTime) {
              item.creationTime = item.creationTime.substring(0, 10);
            }
          });
        }
      });
    },
    getList2() {
      getConstructionApi({}, this.filterForm2).then((res) => {
        this.loadingList = false;
        if (res.code == 200) {
          this.total2 = res.data.total;
          this.filterForm2.pageSize = res.data.size;
          this.filterForm2.pageNumber = res.data.current;
          this.list2 = res.data.records;
          this.list2.forEach((item) => {
            if (item.creationTime) {
              item.creationTime = item.creationTime.substring(0, 10);
            }
          });
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
.title {
  font-size: 25px;
  text-align: center;
  font-weight: bold;
  line-height: 40px;
  margin-bottom: 30px;
}
.btngroup {
  display: flex;
  justify-content: center;
}
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
