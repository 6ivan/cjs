<template>
  <div class="ruTask-container">
    <div class="box-card searchLIst">
      <div class="status">
        <div class="card">
          <h3 v-if="orderInfo.workOrderNumber">
            工单编号：{{ orderInfo.workOrderNumber || "--" }}
          </h3>
          <div class="statusTitle">工单流转状态</div>
          <div class="reset-steps">
            <div v-for="(item, index) in step" :key="index" class="steps_item">
              <div
                class="stepsIcon"
                :style="`background-color: ${
                  ['#34C758', '#FFCB01', '#FF3A30', '#BBBBBB'][item.status]
                };`"
              >
                {{ item.content }}
              </div>
              <span v-if="index != step.length - 1" class="lineActive" />
              <div class="steps_remark">
                <div class="day">{{ item.day }}</div>
                <div class="time">{{ item.time }}</div>
              </div>
            </div>
          </div>
          <h4>工单基本情况</h4>
          <div class="descriptions">
            <span class="descriptions-item"
              >受理节点：{{ orderInfo.acceptanceNode }}</span
            >
            <span class="descriptions-item"
              >受理时间：{{ orderInfo.acceptanceTime | formatDate }}</span
            >
            <span class="descriptions-item"
              >本地网：{{ orderInfo.organizeName }}</span
            >
            <span class="descriptions-item"
              >联系人：{{ orderInfo.contacts }}</span
            >
            <span class="descriptions-item"
              >投诉类别：{{
                $webConfig.complaintCategory[orderInfo.complaintCategory]
              }}</span
            >
            <span class="descriptions-item"
              >紧急程度：{{
                $webConfig.degreeUrgency[orderInfo.degreeUrgency]
              }}</span
            >
            <span class="descriptions-item"
              >工单状态：{{
                $webConfig.workOrderState[orderInfo.workOrderState]
              }}</span
            >
            <span class="descriptions-item"
              >投诉子类别：{{
                $webConfig.subCategory[orderInfo.subCategory]
              }}</span
            >
            <span class="descriptions-item"
              >解决状况：{{ orderInfo.resolutionState }}</span
            >
            <span class="descriptions-item"
              >基站编号：{{ orderInfo.baseNumber }}</span
            >
            <span class="descriptions-item"
              >派单处理时间：{{ orderInfo.handleTime | formatDate }}</span
            >
            <span class="descriptions-item"
              >派单状态：{{
                $webConfig.dispatchState[orderInfo.dispatchState]
              }}</span
            >
            <span class="descriptions-item"
              >回访内容：{{ orderInfo.returnContent }}</span
            >
            <span class="descriptions-item"
              >预处理故障原因：{{ orderInfo.pretreatmentReason }}</span
            >
          </div>
          <h4>投诉问题描述</h4>
          <div class="descriptions">
            <p>障碍现象：{{ orderInfo.faultPhenomenon }}</p>
            <p>投诉地址：{{ orderInfo.complaintAddress }}</p>
            <p>障碍描述：{{ orderInfo.describes }}</p>
          </div>
        </div>
        <div
          v-if="!orderInfo.workOrderState && orderInfo.workOrderState != 0"
          class="card"
        >
          <el-row>
            <el-col :span="12">
              <el-form
                ref="elForm"
                :rules="rules"
                label-width="86px"
                :model="filterForm"
              >
                <h4>投诉分发</h4>
                <el-form-item label=" " prop="orgIds">
                  <el-checkbox-group v-model="filterForm.orgIds">
                    <el-checkbox
                      v-for="(item, index) in distributes"
                      :key="index"
                      :label="item.organizeId"
                    >
                      {{ item.organizeName }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="子原因">
                  <el-input
                    v-model="filterForm.workOrderNumber"
                    type="text"
                    placeholder="请输入子原因"
                  />
                </el-form-item>
                <el-form-item label="分拣建议">
                  <el-input
                    v-model="filterForm.workOrderNumber"
                    type="text"
                    placeholder="请输入分拣建议"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    style="margin-left: 100px"
                    @click="handleDistribute"
                    >确认分发</el-button
                  >
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div
          v-else-if="
            orderInfo.workOrderState == 0 ||
            orderInfo.workOrderState == 1 ||
            orderInfo.workOrderState == 4
          "
          class="card"
        >
          <h4>部门动态</h4>
          <!-- .replace("T", "")  -->
          <p>{{ orderInfo.acceptanceTime }} 已提交至{{ orderInfo.orgName }}</p>
          <div style="display: flex; align-items: center">
            <el-button @click="cuipan" type="primary" style="margin-right: 10px"
              >催办</el-button
            >
            <span style="color: #909399; font-size: 14px"
              >工单24小时内无进度反馈可进行工单催办</span
            >
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="请填写处理结果" width="30%" :visible.sync="handle.show">
      <div>
        <p>处理结果：</p>
        <div class="btn-group-full hanle-tabs" :stretch="true">
          <span
            v-for="(tab, index) in handle.tabs"
            :key="index"
            class="tab-btn"
            :class="index === handle.tabIndex ? 'active' : ''"
            @click="changeHanleTab(index)"
          >
            {{ tab }}</span
          >
        </div>
        <el-input
          class="input-result"
          type="textarea"
          placeholder="请输入解决结果"
        />
        <template v-if="handle.tabIndex == 1">
          <p>预计处理时间：</p>
          <el-date-picker
            :picker-options="pickerOptions0"
            v-model="handle.time"
            type="date"
            placeholder="选择日期"
          />
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handle.show = false">取 消</el-button>
        <el-button type="primary" @click="handle.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartmentApi } from "@/api/department";
import { getOrderNumberDetails, addDistribute, prompt } from "@/api/server";
export default {
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      filterForm: {
        workOrderNumber: null,
        orgIds: [],
      },
      rules: {
        orgIds: [
          {
            required: true,
            message: "请选择要分化的部门",
            trigger: "change",
          },
        ],
      },
      orderInfo: {},
      workOrderNumber: null,
      distributes: [],
      handle: {
        show: false,
        tabs: ["已解决", "未解决"],
        tabIndex: 0,
        time: "",
      },
      step: [
        {
          content: "工单接收",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "原因判断",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "工单派发",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "优化接收",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "派往本地网",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "处理完成",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "投诉反馈",
          status: 3,
          day: "",
          time: "",
        },
      ],
      base: {
        tabIndex: 0,
        tabs: [
          "数据流量指标",
          "业务完整类指标",
          "设备可用性指标",
          "移动类管理指标",
          "资源负荷类指标",
          "呼叫介入类指标",
          "呼叫保持类指标",
          "移动管理类",
          "其他",
        ],
        currentData: [],
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  created() {
    getDepartmentApi({}, 1, 10).then((res) => {
      if (res.code == 200) {
        console.log(res.data);
        this.distributes = res.data.records.filter(
          (item) => item.organizeLevel == 1
        );
      } else {
        // getErrerMessage(res, "getAuthorityManagement", this);
      }
    });
    this.workOrderNumber = this.$route.query.id;
    this.getList();
  },
  methods: {
    getList() {
      getOrderNumberDetails({ workOrderNumber: this.workOrderNumber }).then(
        (res) => {
          this.orderInfo = res.data;
          //1.用户投诉/开始处理
          this.step[0].content =
            res.data.workOrderSource == 1 || res.data.workOrderSource == 2
              ? "用户投诉"
              : res.data.workOrderSource == 3
              ? "开始处理"
              : "";
          this.step[0].day = res.data.creationTime?.split("T")[0];
          this.step[0].time = res.data.creationTime?.split("T")[1];
          this.step[0].status = res.data.creationTime ? "0" : "3";
          //2.原因判断
          this.step[1].day = res.data.creationTime?.split("T")[0];
          this.step[1].time = res.data.creationTime?.split("T")[1];
          this.step[1].status = res.data.workOrderState >= 0 ? "0" : "3";

          //3.工单派发
          this.step[2].day = res.data.receivingTime?.split(" ")[0];
          this.step[2].time = res.data.receivingTime?.split(" ")[1];
          this.step[2].status = res.data.workOrderState >= 0 ? "0" : "3";

          //4.{orgName}接收
          this.step[3].content = (res.data.orgName || "部门") + "接收";
          this.step[3].day = res.data.acceptanceTime?.split("T")[0];
          this.step[3].time = res.data.acceptanceTime?.split("T")[1];
          this.step[3].status = res.data.workOrderState > 0 ? "0" : "3";
          //5.派往本地网
          this.step[4].day = res.data.sendLocalTime?.split("T")[0];
          this.step[4].time = res.data.sendLocalTime?.split("T")[1];
          this.step[4].status = res.data.workOrderState > 1 ? "0" : "3";
          //6.解决/未解决
          this.step[5].day = res.data.handleTime?.split("T")[0];
          this.step[5].time = res.data.handleTime?.split("T")[1];
          this.step[5].content =
            res.data.workOrderState == 2 ? "解决" : "未解决";
          this.step[5].status =
            res.data.workOrderState == 2
              ? "0"
              : res.data.workOrderState != 2 && res.data.workOrderState != 3
              ? "3"
              : "2";
          //7.投诉反馈/完单反馈
          this.step[6].day = res.data.handleTime?.split("T")[0];
          this.step[6].time = res.data.handleTime?.split("T")[1];
          this.step[6].content =
            (res.data.workOrderState == 2 || res.data.workOrderState == 3) &&
            (res.data.workOrderSource == 1 || res.data.workOrderSource == 2)
              ? "投诉反馈"
              : (res.data.workOrderState == 2 ||
                  res.data.workOrderState == 3) &&
                res.data.workOrderSource == 3
              ? "完单反馈"
              : "未反馈";
          this.step[6].status =
            this.step[6].content == "投诉反馈" ||
            this.step[6].content == "完单反馈"
              ? "0"
              : "3";
        }
      );
    },
    handleDistribute() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          let formdata = new FormData();
          formdata.append("id", this.orderInfo.workOrderId);
          formdata.append("orgIds", this.filterForm.orgIds.join());

          addDistribute(formdata).then((res) => {
            if (res.code == 200) {
              this.$message.success("分发成功");
              this.$router.back();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    cuipan() {
      let _this = this;
      this.$confirm("是否确认催单?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          console.log("进来了 ");
          let formdata = new FormData();
          formdata.append("id", _this.orderInfo.workOrderId);
          return prompt(formdata);
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("催办成功");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    changeWorkTab(index) {
      this.base.tabIndex = index;
    },
    changeHanleTab(index) {
      this.handle.tabIndex = index;
    },
  },
};
</script>

<style scoped lang="scss">
.timeline {
  font-size: 14px;
}
$lineColor: #34c758;
.detail-reason {
  font-size: 14px;
  padding: 4px 20px;
  border: #ccc solid 1px;
  margin-top: 20px;
}
.timeline-head,
.timeline-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 30px;
  height: 36px;
  position: relative;
  & > a,
  & > span {
    flex: 1;
  }
  &::before {
    content: "";
    width: 16px;
    height: 16px;
    position: absolute;
    top: 11px;
    left: -23px;
    background: $lineColor;
    border-radius: 50%;
  }
  &::after {
    content: "";
    width: 2px;
    top: 20px;
    left: -16px;
    height: 30px;
    background: $lineColor;
    position: absolute;
  }
  &:last-child {
    &::after {
      content: none;
    }
  }
  .active {
    color: #409eff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
.descriptions {
  font-size: 14px;
}
.descriptions-item {
  display: inline-block;
  min-width: 240px;
  margin-right: 40px;
  padding-bottom: 20px;
}
.btn-group-full {
  width: 100%;
  &.hanle-tabs {
    width: 250px;
  }
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
.input-result {
  margin-top: 20px;
}

.time,
.time {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}
.steps_item {
  width: 170px;
}
.remarkInfo {
  margin: 20px 0;
  font-size: 16px;
}
.remarkInfo div {
  font-size: 14px;
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
.reset-steps {
  margin-top: 15px;
  display: flex;
  font-size: 14px;
  // justify-content: space-between;
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
.day {
  text-align: center;
}
</style>
