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
          <el-form-item
            label="工单编号"
            prop="workOrderNumber"
            :rules="{
              required: true,
              message: '工单编号不能为空',
              trigger: 'blur',
            }"
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
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card v-if="stepVisible" class="box-card card">
      <h4 class="statusTitle">工单进度流程：</h4>
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
      <h4 class="statusTitle">工单处理动态：</h4>
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
        <el-table-column prop="no" label="部门" align="center" />
        <el-table-column prop="level" label="实施动作" align="center" />
        <el-table-column prop="time" label="实施时间" align="center" />
        <el-table-column prop="care" label="实施成效" align="center" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getOrderNumberDetails } from "@/api/server";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  create() {},
  data() {
    return {
      serverList: {
        currentData: [],
      },
      filterForm: {
        workOrderNumber: null,
      },
      stepVisible: false,
      handle: {
        show: false,
        tabs: ["已解决", "未解决"],
        tabIndex: 0,
        time: "",
      },
      step: [
        {
          content: "首次投诉",
          status: 0,
          day: "2022-01-01",
          time: "22:23:00",
        },
        {
          content: "处理分析",
          status: 0,
          day: "2022-01-01",
          time: "22:23:00",
        },
        {
          content: "本地网介入",
          status: 0,
          day: "2022-01-01",
          time: "22:23:00",
        },
        {
          content: "规划设计",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "建设施工",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "维护调试",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "优化调试",
          status: 3,
          day: "",
          time: "",
        },
        {
          content: "建设完成",
          status: 3,
          day: "",
          time: "",
        },
      ],
    };
  },
  methods: {
    searchBtn() {
      this.$refs["filterForm"].validate((valid) => {
        if (valid) {
          this.getList();
        }
      });
    },
    getList() {
      getOrderNumberDetails({
        workOrderNumber: this.filterForm.workOrderNumber,
      }).then((res) => {
        this.stepVisible = true;
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
        this.step[3].content = res.data.orgName + "接收";
        this.step[3].day = res.data.acceptanceTime?.split("T")[0];
        this.step[3].time = res.data.acceptanceTime?.split("T")[1];
        this.step[3].status = res.data.workOrderState > 0 ? "0" : "3";
        // //5.派往本地网
        // this.step[4].day = res.data.sendLocalTime?.split("T")[0];
        // this.step[4].time = res.data.sendLocalTime?.split("T")[1];
        // this.step[4].status = res.data.workOrderState > 1 ? "0" : "3";
        // //6.解决/未解决
        // this.step[5].day = res.data.handleTime?.split("T")[0];
        // this.step[5].time = res.data.handleTime?.split("T")[1];
        // this.step[5].content = res.data.workOrderState == 2 ? "解决" : "未解决";
        // this.step[5].status =
        //   res.data.workOrderState == 2
        //     ? "0"
        //     : res.data.workOrderState != 2 && res.data.workOrderState != 3
        //     ? "3"
        //     : "2";
        // //7.投诉反馈/完单反馈
        // this.step[6].day = res.data.handleTime?.split("T")[0];
        // this.step[6].time = res.data.handleTime?.split("T")[1];
        // this.step[6].content =
        //   (res.data.workOrderState == 2 || res.data.workOrderState == 3) &&
        //   (res.data.workOrderSource == 1 || res.data.workOrderSource == 2)
        //     ? "投诉反馈"
        //     : (res.data.workOrderState == 2 || res.data.workOrderState == 3) &&
        //       res.data.workOrderSource == 3
        //     ? "完单反馈"
        //     : "未反馈";
        // this.step[6].status =
        //   this.step[6].content == "投诉反馈" ||
        //   this.step[6].content == "完单反馈"
        //     ? "0"
        //     : "3";

        this.serverList.currentData = [];
        if (this.orderInfo.workOrderState == 0) {
          this.serverList.currentData.push({
            no: "客服",
            level: "已派发",
            time: this.orderInfo.creationTime,
            care: "已下发" + this.orderInfo.orgName,
          });
        } else if (this.orderInfo.workOrderState == 1) {
          this.serverList.currentData.push({
            no: "客服",
            level: "已派发",
            time: this.orderInfo.creationTime,
            care: "已下发" + this.orderInfo.orgName,
          });
          this.serverList.currentData.push({
            no: this.orderInfo.orgName,
            level: "已接收",
            time: this.orderInfo.acceptanceTime,
            care: "处理中",
          });
        } else if (this.orderInfo.workOrderState == 2) {
          this.serverList.currentData.push({
            no: "客服",
            level: "已派发",
            time: this.orderInfo.creationTime,
            care: "已下发" + this.orderInfo.orgName,
          });
          this.serverList.currentData[1] = {
            no: this.orderInfo.orgName,
            level: "已接收",
            time: this.orderInfo.acceptanceTime,
            care: "发往本地网",
          };
          this.serverList.currentData.push({
            no: "本地网",
            level: "已接收",
            time: this.orderInfo.sendLocalTime,
            care: "处理中",
          });
        } else if (this.orderInfo.workOrderState == 3) {
          this.serverList.currentData = [
            {
              no: "客服",
              level: "level",
              time: this.orderInfo.creationTime,
              care: "已下发" + this.orderInfo.orgName,
            },
            {
              no: this.orderInfo.orgName,
              level: "已拒绝",
              time: this.orderInfo.acceptanceTime,
              care: "",
            },
          ];
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.timeline {
  font-size: 14px;
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
