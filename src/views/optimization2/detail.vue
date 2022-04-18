<template>
  <div class="ruTask-container">
    <el-card class="box-card searchLIst">
      <h4>工单编号：07102900002021062600158</h4>
      <h4>处理动态</h4>
      <div class="timeline">
        <div class="timeline-head">
          <span>处理时间节点</span>
          <span>处理科室</span>
          <span>当前状态</span>
          <span>处理结果</span>
        </div>
        <div class="timeline-item">
          <span>2021.01.01  13:00:00</span>
          <span>优化室</span>
          <span>已接收</span>
          <span>发往本地网</span>
        </div>
        <div class="timeline-item">
          <span>2021.01.01  13:00:00</span>
          <span>优化室</span>
          <span>已接收</span>
          <span class="active" @click="handle.show = true">填写处理结果</span>
        </div>
      </div>
      <h4>工单基本情况</h4>
      <div class="descriptions">
        <span class="descriptions-item">受理节点：C网投诉申告</span>
        <span class="descriptions-item">受理时间：2021/7/4 9:59:30</span>
        <span class="descriptions-item">本地网：襄阳</span>
        <span class="descriptions-item">联系人：张三</span>
        <span class="descriptions-item">投诉类别：有信号无法登录</span>
        <span class="descriptions-item">紧急程度：一般</span>
        <span class="descriptions-item">工单状态：已处理</span>
        <span class="descriptions-item">投诉子类别：单个位置</span>
        <span class="descriptions-item">解决状况：未解决待查修</span>
        <span class="descriptions-item">基站编号：1216</span>
        <span class="descriptions-item">派单处理时间：2021/6/26 14:00:16</span>
        <span class="descriptions-item">派单状态：已回单</span>
        <span class="descriptions-item">回访内容：非常满意</span>
        <span class="descriptions-item">预处理故障原因：疑似网络原因、城区室内弱覆盖</span>
      </div>
      <h4>投诉问题描述</h4>
      <div class="descriptions">
        <p>障碍现象：移动业务(前台专用)->4G业务->手机上网->网络质量->网速慢（多个位置）->非武汉</p>
        <p>投诉地址：湖北省襄阳市襄州区双沟镇双南村4组</p>
        <p>障碍描述：【4G开关是否开启】:是【周围用户是否正常】:不清楚【受理号码】:19972247936【故障预处理】:本地上网慢【故障场景】:所有位置【故障现象】
          :【故障发生时间】2021-06-23 18:42:31点【检测BOSS侧停开机状态】:开机【检测30天内在途工单】:30天内无在途单 【检查BOSS是否已经发送达量降速】:BOSS
          未发送达量降速【检查PGW是否已经发送达量降速】:用户不在线【检测HSS侧停开机状态】:开机【检测4G功能是否开通】:4G功能已开通【检测BOSS是否断网】:
          未断网 【检测是当前否有上网超阈值记录】:上网流量没有超断网阀值用户不在线，已建议用户检查手机网络数据开关及重启手机/换机换卡操作，用户未恢复，请核实处理</p>
      </div>
      <h4>周围基站数据</h4>
      <div class="btn-group-full" :stretch="true">
        <span
          v-for="(tab, index) in base.tabs"
          :key="index"
          class="tab-btn"
          :class="index === base.tabIndex ? 'active' : ''"
          @click="changeWorkTab(index)"
        >
          {{ tab }}</span>
      </div>
      <el-table
      class="p-table" :cell-class-name="pTableCell" :header-cell-class-name="pTableHead"
        :data="tableData"
        border
        style="width: 530px"
      >
        <el-table-column
          prop="date"
          label="日期"
          width="180"
        />
        <el-table-column
          prop="name"
          label="姓名"
          width="180"
        />
        <el-table-column
          prop="address"
          label="地址"
        />
      </el-table>
    </el-card>
    <el-dialog
      title="请填写处理结果"
      width="30%"
      :visible.sync="handle.show"
    >
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
            {{ tab }}</span>
        </div>
        <el-input class="input-result" type="textarea" placeholder="请输入解决结果" />
        <template v-if="handle.tabIndex == 1">
          <p>预计处理时间：</p>
          <el-date-picker
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
export default {
  data() {
    return {
      handle: {
        show: false,
        tabs: ['已解决', '未解决'],
        tabIndex: 0,
        time: ''
      },
      base: {
        tabIndex: 0,
        tabs: [
          '数据流量指标',
          '业务完整类指标',
          '设备可用性指标',
          '移动类管理指标',
          '资源负荷类指标',
          '呼叫介入类指标',
          '呼叫保持类指标',
          '移动管理类',
          '其他'
        ],
        currentData: []
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created() {
    this.changeWorkTab(0)
  },
  methods: {
    changeWorkTab(index) {
      this.base.tabIndex = index
    },
    changeHanleTab(index) {
      this.handle.tabIndex = index
    }
  }
}

</script>

<style scoped="scoped" lang="scss">
  .timeline{ font-size: 14px; }
  $lineColor: #34C758;
  .timeline-head, .timeline-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 30px;
    height: 36px;
    position: relative;
    &>a, &>span{
      flex: 1;
    }
    &::before{
      content: '';
      width: 16px;
      height: 16px;
      position: absolute;
      top: 11px;
      left: -23px;
      background: $lineColor;
      border-radius: 50%;
    }
    &::after{
      content: '';
      width: 2px;
      top: 20px;
      left: -16px;
      height: 30px;
      background: $lineColor;
      position: absolute;
    }
    &:last-child{
      &::after{
        content: none;
      }
    }
    .active{
      color: #409EFF;
      cursor: pointer;
      &:hover{
        text-decoration: underline;
      }
    }
  }
  .descriptions{
    font-size: 14px;
  }
  .descriptions-item{
    display: inline-block;
    min-width: 240px;
    margin-right: 40px;
    padding-bottom: 20px;
  }
  .btn-group-full {
    width: 100%;
    &.hanle-tabs{
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
  .input-result{
    margin-top: 20px;
  }
</style>
