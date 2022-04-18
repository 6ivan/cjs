<!--权限管理-->
<template>
  <div class="build-container">
    <div class="box-card searchLIst card" >
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
          <el-form-item label="基站名称" prop="stationName">
            <el-input
              v-model="filterForm.stationName"
              placeholder="请输入基站名称"
              :maxlength="30"
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
    </div>
    <div class="box-card card">
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
          prop="stationNumber"
          label="基站号"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="stationName" label="基站名称" align="center">
        </el-table-column>
        <el-table-column prop="orgName" label="所属本地网" align="center">
        </el-table-column>
                  <el-table-column label="当前进度" align="center">
            <template slot-scope="scope">
              <div>
                {{ statusList[parseInt(scope.row.status)] }}
              </div>
            </template>
          </el-table-column>
        <el-table-column prop="createTime" label="工单抵达时间" align="center">
        </el-table-column>
        <el-table-column prop="checkTime" label="审核时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-link type="primary" @click="link(scope.row)">查看</el-link>
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
    </div>
        <el-dialog :visible.sync="dialogVisible" width="70%" top="5vh">
      <div slot="title" class="title">入网申请: {{ remarkForm.name }}</div>
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
            <span v-if="index != step.length - 1" class="lineActive"></span>
            <div class="steps_remark">
              <div class="day">{{ item.day }}</div>
              <div class="time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>

     <div class="statusTitle" style="margin-top: 30px;">基本情况</div>
      <div class="baseInfo">
        <div class="remarkInfo">
          基站号：
          {{ remarkForm.aa }}
        </div>
        <div class="remarkInfo">
          基站名称：
          {{ remarkForm.bb }}
        </div>
        <div class="remarkInfo">
          申请时间：
          {{ remarkForm.cc }}
        </div>
        <div class="remarkInfo">
          发送时间：
          {{ remarkForm.dd }}
        </div>
      </div>
        <div style=" margin-top: -15px;" class="remarkInfo repoet">
        检验报告：
        <div class="footer" style=" margin-top: 0px;" @click="open(remarkForm.fileName)">
          <div class="img">
            <img
              v-if="lastName == 'pdf'"
              src="../../assets/404_images/pdf.png"
              alt=""
            />
            <img
              v-if="lastName == 'xlsx'"
              src="../../assets/404_images/excel.png"
              alt=""
            />
            <img
              v-if="lastName == 'doc' || lastName == 'docx'"
              src="../../assets/404_images/word.png"
              alt=""
            />
          </div>
          <div class="remarkFormName"> {{ remarkForm.name }}</div>
        </div>
      </div>
        <div style=" margin-top: -15px;" class="remarkInfo" v-if="remarkForm.check">
        疑似故障说明：
        <span>
          {{ remarkForm.check }}
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {} from "@/api/department";
import FilterList from "@/mixins/FilterList";
import {
  getProcessApi,
  getConstructionApi,
  putStatusApi,
} from "@/api/construction";
export default {
  mixins: [FilterList],
  data() {
    return {
      list: [{}, {}],
      flag: false, //批量全选状态
      remarkForm: {},
      title: "",
      dialogList: {},
            step: [],
        lastName: "",
      dialogVisible: false,
            statusList: [
        "",
        "待审核",
        "已通过",
        "已拒绝",
        "已挂起",
        "已建成",
        "监测失败",
        "监测成功",
      ],
    };
  },
  methods: {
        open(a) {
      window.open(a);
    },
    getList() {
      var param = {};
      if (this.filterForm.orgId) {
        param.orgId = this.filterForm.orgId;
      }
      if (this.filterForm.stationName) {
        param.stationName = this.filterForm.stationName;
      }
      getConstructionApi(param, this.page, this.size, 3).then((res) => {
        this.loadingList = false;
        if (res.code == 200) {
          this.total = res.data.total;
          this.size = res.data.size;
          this.page = res.data.current;
          this.list = res.data.records;
          this.list.forEach((item) => {
            if(item.createTime){
              item.createTime = item.createTime.substring(0, 10);
            }
            
          });
          this.list.forEach((item) => {
            if( item.checkTime){
               item.checkTime = item.checkTime.substring(0, 10);
            }
           
          });
        }
      });
    },
    splitFileName(text) {
      var arr = text.split("/"); //通过分隔字符串，成字符串数组
      var last = arr[arr.length - 1]; //取最后一个，就是文件名
      var arr1 = last.split("."); //通过分隔字符串，成字符串数组
      var last1 = arr1[arr1.length - 1]; //取最后一个，就是文件
      this.lastName = last1;
      var pattern = /\.{1}[a-z]{1,}$/;
      if (pattern.exec(last) !== null) {
        return last.slice(0, pattern.exec(last).index);
      } else {
        // return aa;
      }
    },
   link(row) {
      this.dialogVisible = true;
      getProcessApi(row.id).then((res) => {
        this.step = res.data.step;
        this.remarkForm.aa = row.stationNumber;
        this.remarkForm.bb = row.stationName;
        this.remarkForm.cc = row.applyDate;
        this.remarkForm.dd = row.createTime;
        this.remarkForm.name = this.splitFileName(row.filePath);
        this.remarkForm.fileName = row.filePath;
        this.remarkForm.check = row.checkDetail;
      });
    },
    open1() {
      this.$confirm("是否同意该基站进行建设", "系统提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          putStatusApi(this.dialogList.id, 2).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.titlt;
    this.getList();
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.repoet{
  display: flex;
    align-items:flex-start;
  line-height: 25px;
}
.day{
  text-align: center;
}
.title{
  font-size: 22px;
}
.statusTitle{
  font-size: 18px;
}
.baseInfo{
  display: flex;
  .remarkInfo{
    margin-right: 50px;
  }
}
.footer {
  cursor: pointer;
  margin-right: 30px;
  display: flex;
}
.footer a {
  line-height: 25px;
}
.img img {
  height: 25px;
  margin-right: 10px;
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
  width: 170px;
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
.build-container {
  height: 100%;
  overflow-y: auto;
}
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
.construction_pic {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}


.content > div {
  margin-top: 30px;
}
.btngroup {
  padding: 30px;
}
</style>
