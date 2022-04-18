<template>
  <div class="ruTask-container">
    <div class="p-dbox">
      <h3 v-if="detailObj.workOrderNumber">
        工单编号：{{ detailObj.workOrderNumber || "--" }}
      </h3>
      <h3>处理动态</h3>
      <div class="timeline">
        <div class="timeline-head">
          <span>处理时间节点</span>
          <span>处理科室</span>
          <span>当前状态</span>
          <span>处理结果</span>
        </div>
        <div class="timeline-item" v-for="(item, k) in timeList" :key="k">
          <span>{{ item.time }}</span>
          <span>{{ item.keshi }}</span>
          <span>{{ item.stateText }}</span>
          <template v-if="item.state == 0">
            <span v-if="item.finish">{{ item.result }}</span>
            <el-popconfirm
              v-else
              confirm-button-text="确定"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定接收？"
              @onConfirm="acceptWorkOrder"
            >
              <span slot="reference" class="active">接收</span>
            </el-popconfirm>
          </template>
          <template v-if="item.state == 1">
            <span v-if="item.finish">{{ item.result }}</span>
            <el-popconfirm
              v-else
              confirm-button-text="确定"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定催收？"
              @onConfirm="cuiWorkOrder"
            >
              <span slot="reference" class="active">催收</span>
            </el-popconfirm>
          </template>
          <template v-if="item.state == 4">
            <span v-if="item.finish">{{ item.result }}</span>
            <span v-else class="active" @click="chuliShow = true"
              >填写处理结果</span
            >
          </template>
          <template v-if="item.state == 2 || item.state == 3">
            <span>{{ item.result }}</span>
          </template>
          <!-- 0：未接受、1已接受 23已完单 -->
          <!-- <span v-if="item.workOrderState==1" class="active" @click="chuliShow = true">填写处理结果</span> -->
        </div>
      </div>
    </div>
    <div class="p-dbox">
      <h3>工单基本情况</h3>
      <div class="descriptions">
        <span class="descriptions-item"
          >受理节点：{{ detailObj.acceptanceNode || "--" }}</span
        >
        <span class="descriptions-item"
          >受理时间：{{ detailObj.acceptanceTime | formatDate }}</span
        >
        <span class="descriptions-item"
          >本地网：{{ detailObj.acceptancePlace || "--" }}</span
        >
        <span class="descriptions-item"
          >联系人：{{ detailObj.contacts || "--" }}</span
        >
        <span class="descriptions-item"
          >投诉类别：{{
            $webConfig.complaintCategory[detailObj.complaintCategory]
          }}</span
        >
        <span class="descriptions-item"
          >紧急程度：{{
            $webConfig.degreeUrgency[detailObj.degreeUrgency]
          }}</span
        >
        <span class="descriptions-item"
          >工单状态：{{
            $webConfig.workOrderState[detailObj.workOrderState]
          }}</span
        >
        <span class="descriptions-item"
          >投诉子类别：{{ $webConfig.subCategory[detailObj.subCategory] }}</span
        >
        <span class="descriptions-item"
          >解决状况：{{ detailObj.resolutionState }}</span
        >
        <span class="descriptions-item"
          >基站编号：{{ detailObj.baseNumber }}</span
        >
        <span class="descriptions-item"
          >派单处理时间：{{ detailObj.handleTime | formatDate }}</span
        >
        <span class="descriptions-item"
          >派单状态：{{
            $webConfig.dispatchState[detailObj.dispatchState]
          }}</span
        >
        <span class="descriptions-item"
          >回访内容：{{ detailObj.returnContent }}</span
        >
        <span class="descriptions-item"
          >预处理故障原因：{{ detailObj.pretreatmentReason }}</span
        >
      </div>
    </div>
    <div class="p-dbox">
      <h3>投诉问题描述</h3>
      <div class="descriptions">
        <p>障碍现象：{{ detailObj.faultPhenomenon }}</p>
        <p>投诉地址：{{ detailObj.complaintAddress }}</p>
        <p>障碍描述：{{ detailObj.describes }}</p>
      </div>
    </div>
    <div class="p-dbox">
      <h3>周围基站数据</h3>
      <div class="btn-group-full" :stretch="true">
        <span
          v-for="(tab, index) in base.tabs"
          :key="index"
          class="tab-btn"
          :class="index == base.tabIndex ? 'active' : ''"
          @click="changeWorkTab(index)"
        >
          {{ tab }}</span
        >
      </div>
      <el-table
        class="p-table"
        :cell-class-name="pTableCell"
        :header-cell-class-name="pTableHead"
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="stationName" label="基站名称" align="center" />
        <el-table-column
          prop="workOrderNumber"
          label="基站编号"
          align="center"
        />
        <el-table-column
          prop="stationAddress"
          label="基站位置
"
          align="center"
        />
        <el-table-column
          prop="creationTime"
          label="申请日期
"
        />
      </el-table>
    </div>
    <el-dialog title="请填写处理结果" width="50%" :visible.sync="chuliShow">
      <div>
        <p>处理结果：</p>
        <div class="btn-group-full hanle-tabs" :stretch="true">
          <span
            v-for="(tab, index) in chuliTab"
            :key="index"
            class="tab-btn"
            :class="{ active: tab.id == chuliState }"
            @click="changechuliTab(index)"
          >
            {{ tab.text }}
          </span>
        </div>
        <el-input
          class="input-result"
          v-model="chuliCont"
          type="textarea"
          placeholder="请输入解决结果"
        />
        <template v-if="chuliState == 3">
          <p>预计处理时间：</p>
          <!-- <el-date-picker v-model="chuliTime" type="date" placeholder="选择日期" /> -->
          <el-date-picker
            v-model="chuliTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
          />
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chuliShow = false">取 消</el-button>
        <el-button type="primary" @click="chuliConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      workOrderState2: {
        //处理状态
        0: "未接受",
        1: "已接受",
        2: "已完成",
        3: "已完成",
      },
      // 处理tab
      chuliTab: [
        {
          id: "2",
          text: "已解决",
        },
        {
          id: "3",
          text: "未解决",
        },
      ],
      chuliState: 2,
      chuliTime: "",
      chuliShow: false, //处理弹框
      chuliCont: "", //结果
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
          stationName: "武汉蔡甸基站",
          workOrderNumber: "WHCD-DXJZ-OOO1",
          stationAddress: "武汉市蔡甸区",
          creationTime: "2022年1月20日",
        },
        {
          stationName: "武汉洪山基站",
          workOrderNumber: "WHCD-DXJZ-OOO2",
          stationAddress: "武汉市洪山区",
          creationTime: "2022年1月20日",
        },
      ],
      detail: [],
      detailObj: {},
      detailData: {},
      timeListInit: [
        {
          time: this.getDate(3),
          keshi: "客服部",
          stateText: "已派发",
          state: 0,
          result: "发往本地网",
          result2: "接收", //未完成
          finish: true,
        },
        {
          time: this.getDate(2),
          keshi: "优化部",
          stateText: "已接收",
          state: 1,
          result: "一线监测", //完成
          result2: "催收", //未完成
          finish: true,
        },
        {
          time: this.getDate(1),
          keshi: "本地网",
          stateText: "已接收",
          state: 4,
          result: "天线需要进行调试",
          result2: "填写处理结果", //未完成
          finish: true,
        },
        {
          time: this.getDate(0),
          keshi: "本地网",
          stateText: "已解决",
          state: 2,
          result: "已完结，反馈客服",
          result2: "", //未完成
          finish: true,
        },
      ],
      timeList: [],
    };
  },
  created() {
    this.changeWorkTab(0);
    this.detailData = this.$route.query;
    console.log(this.detailData);
    this.getDetail();
  },
  methods: {
    // 确定处理弹框
    chuliConfirm() {
      if (!this.chuliCont) {
        this.$message.warning("请输入处理结果");
        return;
      }
      if (this.chuliState == 3 && !this.chuliTime) {
        this.$message.warning("请选择处理时间");
        return;
      }
      let data = {
        workOrderState: this.chuliState,
        workOrderId: this.detailData.workOrderId,
        orgIdList: [5],
        returnContent: this.chuliState == 2 ? this.chuliCont : null, //回访内容（已解决）
        describes: this.chuliState == 3 ? this.chuliCont : null, //障碍描述（未解决）
        pretreatmentTime:
          this.chuliState == 3 ? new Date(this.chuliTime + " 08:00:00") : null,
      };
      this.$http
        .post("/szkj-datamiddleground/order/resolveWorkOrder", data)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getDetail();
            this.chuliShow = false;
          }
        });
    },
    // 获取详情
    getDetail() {
      this.$http
        .post("/szkj-datamiddleground/order/getOrgAndWorkVO", {
          workOrderNumber: this.detailData.workOrderNumber,
          orgIdList: [5],
        })
        .then((res) => {
          if (res.code == 200) {
            this.detail = res.data;
            this.detailObj = this.detail[0];
            let workOrderState = this.detailObj.workOrderState; // 0待处理，1处理中，2已解决，3未解决 4催单 0：未接受、1已接受  23已完单
            if (workOrderState == 0) {
              this.timeList = JSON.parse(JSON.stringify(this.timeListInit));
              this.timeList.length = 1;
              this.timeList[0].finish = false;
            } else if (workOrderState == 1) {
              this.timeList = JSON.parse(JSON.stringify(this.timeListInit));
              this.timeList.length = 2;
              this.timeList[1].finish = false;
            } else if (workOrderState == 2 || workOrderState == 3) {
              this.timeList = JSON.parse(JSON.stringify(this.timeListInit));
            } else if (workOrderState == 4) {
              this.timeList = JSON.parse(JSON.stringify(this.timeListInit));
              this.timeList.length = 3;
              this.timeList[2].finish = false;
            }
          }
        });
    },
    // 接收
    acceptWorkOrder() {
      this.$http
        .post("/szkj-datamiddleground/order/acceptWorkOrder", {
          workOrderId: this.detailObj.workOrderId,
          orgId: this.detailData.orgId,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message("操作成功");
            this.getDetail();
          }
        })
        .catch((e) => {});
    },
    // 催收  修改工单
    cuiWorkOrder() {
      this.$http
        .post("/szkj-datamiddleground/order/setWorkOrderForm", {
          workOrderId: this.detailObj.workOrderId,
          workOrderState: 4,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getDetail();
          }
        })
        .catch((e) => {});
    },
    changeWorkTab(index) {
      this.base.tabIndex = index;
    },
    changechuliTab(index) {
      this.chuliState = this.chuliTab[index].id;
    },
    getDate(num = 0) {
      let date = new Date(); //1. js获取当前时间
      let hour = date.getHours(); //2. 获取当前分钟
      date.setHours(hour - num); //3. 设置当前时间+10分钟：把当前分钟数+10后的值重新设置为date对象的分钟数
      let y = date.getFullYear();
      let m =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let f =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let s =
        date.getSeconds() < 10 ? "0" + date.getseconds() : date.getSeconds();
      let formatdate = y + "-" + m + "-" + d + " " + h + ":" + f + ":" + s;
      return formatdate;
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
.ruTask-container {
  height: 100%;
}

.timeline {
  font-size: 14px;
}

$lineColor: #34c758;

.timeline-head,
.timeline-item {
  display: flex;
  align-items: center;
  margin-left: 30px;
  height: 36px;
  position: relative;

  & > a,
  & > span {
    flex-shrink: 0;
    flex-grow: 0;
    width: 25%;
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
</style>
