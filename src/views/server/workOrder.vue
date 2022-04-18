<!--客服部-工单分拣-->
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
          <el-form-item class="btn-box">
            <el-button type="primary" @click="$router.push('add')"
              >新增工单</el-button
            >
          </el-form-item>
          <el-form-item
            :rules="{
              required: true,
              message: '工单编号不能为空',
              trigger: 'blur',
            }"
            label="工单编号"
            prop="workOrderNumber"
          >
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
            <!-- <el-button @click="refreshBtn">重置</el-button> -->
          </el-form-item>
          <el-form-item prop="status" />
        </el-form>
      </div>
    </el-card>
    <div class="box-card">
      <div class="card">
        <h3 class="section-title">
          <span>待分拣工单</span>
        </h3>
         <div class="construction_pic card">
        <div class="pic_i pic4" @click="$router.push('/server/warn')">
          <div class="pic_cen">
            <div class="pic_num">{{ count1 }}</div>
            <div class="pic_text">预警工单</div>
          </div>
        </div>
        <div class="pic_i pic3" @click="$router.push('/server/grid')">
          <div class="pic_cen">
            <div class="pic_num">{{ count2 }}</div>
            <div class="pic_text">栅格预警工单</div>
          </div>
        </div>
              <div class="pic_i pic1" @click="$router.push('/server/manual')">
          <div class="pic_cen">
            <div class="pic_num">{{ count3 }}</div>
            <div class="pic_text">手工工单</div>
          </div>
        </div>
      </div>
      </div>
      <div class="card">
        <div class="btn-group-full mt-30" :stretch="true">
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
          ref="multipleTable"
          v-loading="tableLoading"
          :data="serverList.currentData"
          :row-key="(row) => row.id"
          tooltip-effect="dark"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            prop="workOrderNumber"
            label="工单编号"
            align="center"
          />
          <el-table-column label="预警类型" align="center">
            <template slot-scope="scope">
              <!-- @click="jumpDetail(scope.row)" -->
              <div>
                {{ workOrderType[scope.row.workOrderType] || "--" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="工单所属区域" align="center" />
          <el-table-column
            prop="subCategory"
            label="投诉子类别"
            align="center"
          />
          <el-table-column label="预警对象" align="center">
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.workOrderType == 1 ||
                  scope.row.workOrderType == 2 ||
                  scope.row.workOrderType == 3
                "
              >
                {{ scope.row.region }}
              </div>
              <div v-else-if="scope.row.workOrderType == 4">
                {{ scope.row.baseNumber }}
              </div>
              <div v-else-if="scope.row.workOrderType == 5">
                {{ scope.row.telephone }}
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="complaintTime"
            label="投诉时间"
            align="center"
          />
          <el-table-column label="工单状态" align="center">
            <template slot-scope="scope">
              <div>
                {{ workOrderState[scope.row.workOrderState] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template slot-scope="scope">
              <div class="table-btn">
                <el-link
                  type="primary"
                  @click="
                    $router.push({
                      path: 'detail',
                      query: {
                        id: scope.row.workOrderNumber,
                      },
                    })
                  "
                  >查看</el-link
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
    </div>
  </div>
</template>

<script>
import {
  getPageWaitWorkList,
  quantityStatistics,
  getOrderList,
} from "@/api/server";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  data() {
    return {
      count1: 0,
      count2: 0,
      count3: 0,
      filterForm: {
        workOrderNumber: null,
        workOrderSource: 1, //1预警单，2栅格预警单，3手工工单
        pageNumber: 1,
        pageSize: 10,
      },
      workOrderType: {
        // 工单类型
        1: "疑难工单",
        2: "专项工单",
        3: "贬损工单",
        4: "重复基站",
        5: "重复用户",
      },
      workOrderState: {
        // 工单类型
        0: "待处理",
        1: "已接受",
        2: "已解决",
        3: "未解决",
      },
      serverList: {
        tabIndex: 0,
        tabs: ["预警工单", "栅格预警工单", "手工工单"],
        currentData: [],
      },
    };
  },
  created() {
    this.getList();
    quantityStatistics().then((res) => {
      res.data.forEach((item) => {
        if (item.workOrderSource == 1) {
          this.count1 = item.total;
        }
        if (item.workOrderSource == 2) {
          this.count2 = item.total;
        }
        if (item.workOrderSource == 3) {
          this.count3 = item.total;
        }
      });
    });
  },
  mounted() {},
  methods: {
    searchBtn() {
      this.$refs["filterForm"].validate((valid) => {
        if (valid) {
          this.$router.push({
            path: "detail",
            query: { id: this.filterForm.workOrderNumber },
          });
        }
      });
    },
    getList() {
      // let formData = new FormData();
      // formData.append("pageNumber");
      // formData.append("pageSize");
      getPageWaitWorkList(this.filterForm, true).then((res) => {
        this.serverList.currentData = res.data.records;
        res.data.records.forEach((item) => {
          if (item.createTime) {
            item.createTime = item.createTime.substring(0, 10);
          }
        });
        this.filterForm.pageNumber = res.data.current;
        this.filterForm.pageSize = res.data.size;
        this.total = res.data.total;
        console.log(res);
      });
    },
    getList1() {
      // let formData = new FormData();
      // formData.append("pageNumber");
      // formData.append("pageSize");
      getOrderList(this.filterForm, true).then((res) => {
        this.serverList.currentData = res.data.records;
        this.filterForm.pageNumber = res.data.current;
        this.filterForm.pageSize = res.data.size;
        this.total = res.data.total;
        console.log(res);
      });
    },
    changePlanTab(index) {
      this.serverList.tabIndex = index;
      this.filterForm.workOrderSource = index + 1;
      if (index == 2) {
        this.getList1();
      } else {
        this.getList();
      }

      // this.serverList.currentData = this.serverList.list[index];
    },
  },
};
</script>
<style lang="scss" scoped>
.construction_pic {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
}
.pic_i {
  margin-right: 80px;
  width: 300px;
  height: 153px;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px;
  .pic_cen {
    margin-bottom: 6px;
    .pic_text {
      display: block;
      margin-top: 6px;
      font-size: 18px;
      margin-left: 85px;
    }
    .pic_num {
      font-weight: 600;
      font-size: 40px !important;
      margin-left: 85px;
      font-size: 46px;
    }
  }
}
.pic1 {
  color: rgb(130, 152, 254);
  background-image: url("../../assets/404_images/icon9.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.pic2 {
  color: rgb(255, 157, 151);
  background-image: url("../../assets/404_images/icon8.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.pic3 {
  color: rgb(255, 193, 126);
  background-image: url("../../assets/404_images/icon7.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.pic4 {
  color: rgb(161, 207, 255);
  background-image: url("../../assets/404_images/icon5.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  .section-title-more {
    font-size: 14px;
    color: #999;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
.btn-group-full {
  width: 360px;
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
.workorder-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.workorder-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border: 1px #ccc solid;
  border-radius: 6px;
  min-width: 200px;
  text-align: center;
  width: 30%;
}
.workorder-item-label {
  color: #999;
  font-size: 14px;
}
.workorder-item-value {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #323232;
}
.construction_pic {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}
.stats-block {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  margin-right: 30px;
  border: 1px rgba(187, 187, 187, 100) solid;
}
.stats-text {
  font-size: 20px;
  margin-bottom: 8px;
}
.stats-label {
  font-size: 14px;
}
</style>
