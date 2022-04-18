<!--权限管理-->
<template>
  <div class="local-container">
    <div class="card">
      <div class="first-step" v-show="stepIndex == 1">
        <div class="btn-group-full" :stretch="true">
          <span
            v-for="(tab, index) in tabs"
            @click="changePlanTab(index)"
            :key="index"
            class="tab-btn"
            :class="index === tabIndex ? 'active' : ''"
          >
            {{ tab }}</span
          >
        </div>
        <div class="bg1">
          <el-upload
            class="upload-demo"
            :action="baseURL + action"
            :before-upload="beforeAvatarUpload"
            accept=".pdf, .doc, .docx, .xls, .xlsx"
            :on-success="onsuccess"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传excel word pdf文件，且不超过100M
            </div>
          </el-upload>
        </div>
        <div class="bg2">
          <el-button @click="stepNext">下一步</el-button>
        </div>
      </div>
      <div class="next-step" v-show="stepIndex == 2">
        <div class="title">
          <div class="title-text">申请清单确认</div>
          <div class="btn-group2">
            <el-button size="small" @click="stepIndex = 1">返回上级</el-button
            ><el-button :loading="loading" size="small" @click="submit"
              >确认上传</el-button
            >
          </div>
        </div>
        <div class="content">
          <el-form
            :rules="rules"
            ref="elForm"
            label-width="80px"
            :model="formLabelAlign"
            class="content"
          >
            <el-form-item label="基站名称" prop="stationName">
              <el-input v-model="formLabelAlign.stationName"></el-input>
            </el-form-item>
            <el-form-item label="基站站号" prop="stationNumber">
              <el-input v-model="formLabelAlign.stationNumber"></el-input>
            </el-form-item>
            <el-form-item label="基站地址" prop="stationAddress">
              <el-input v-model="formLabelAlign.stationAddress"></el-input>
            </el-form-item>
            <el-form-item label="申请日期" prop="applyDateStr">
              <el-date-picker
                v-model="formLabelAlign.applyDateStr"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="line"></div>
        <div class="footer" @click="open(filesName)">
          <div class="img">
            <img
              v-if="lastName == 'pdf'"
              class="pic_item"
              src="../../assets/404_images/pdf.png"
              alt=""
            />
            <img
              v-if="lastName == 'xlsx'"
              class="pic_item"
              src="../../assets/404_images/excel.png"
              alt=""
            />
            <img
              v-if="lastName == 'doc' || lastName == 'docx'"
              class="pic_item"
              src="../../assets/404_images/word.png"
              alt=""
            />
          </div>
          <a> {{ filesName ? splitFileName(filesName) : "" }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartmentApi, submitApi } from "@/api/construction";
import { getToken } from "@/utils/auth";
import FilterList from "@/mixins/FilterList";
import getPageTitle from '@/utils/get-page-title';
export default {
  mixins: [FilterList],
  data() {
    return {
      stepIndex: 1,
      fileList: [],
      action: "",
      rules: {
        stationName: [
          {
            required: true,
            message: "请输入基站名称",
            trigger: "blur",
          },
        ],
        stationNumber: [
          {
            required: true,
            message: "请输入基站站号",
            trigger: "blur",
          },
        ],
        stationAddress: [
          {
            required: true,
            message: "请输入基站地址",
            trigger: "blur",
          },
        ],
        applyDateStr: [
          {
            required: true,
            message: "请选择日期",
            trigger: "blur",
          },
        ],
      },
      filesName: null,
      formLabelAlign: {},
      tabIndex: 0,
      lastName: "",
      loading: false,
      tabs: ["LTA宏站", "SA宏站", "SA室内站"],
    };
  },
  methods: {
    demo() {
      // let data = [
      //   [
      //     {
      //       name: "4g",
      //       value: 90,
      //     },
      //     {
      //       name: "5g",
      //       value: 90,
      //     },
      //   ],
      //   [
      //     {
      //       name: "5g",
      //       value: 90,
      //     },
      //   ],
      // ];
      // const next_data = data.reduce(
      //   (acc, cur, index) => {
      //     let next_acc = acc;
      //     if (index === 0) {
      //       cur.map((item) => {
      //         next_acc.c.push(item.name);
      //       });
      //     }
      //     let arr = [];
      //     cur.map((item) => {
      //       arr.push(item.value);
      //     });
      //     next_acc.s.push({
      //       data: arr,
      //     });

      //     return next_acc;
      //   },
      //   {
      //     c: [],
      //     s: [],
      //   }
      // );
    },
    open(a) {
      window.open(a);
    },
    changePlanTab(index) {
      this.tabIndex = index;
    },
    splitFileName(text) {
      console.log(text, 1111);
      var arr = text.split("/"); //通过分隔字符串，成字符串数组
      var last = arr[arr.length - 1]; //取最后一个，就是文件名
      var arr1 = last.split("."); //通过分隔字符串，成字符串数组
      var last1 = arr1[arr1.length - 1]; //取最后一个，就是文件
      this.lastName = last1;
      console.log(last1);
      var pattern = /\.{1}[a-z]{1,}$/;
      if (pattern.exec(last) !== null) {
        return last.slice(0, pattern.exec(last).index);
      } else {
        // return aa;
      }
      
    },
    onsuccess(files, fileList) {
      this.filesName = files.data;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    beforeAvatarUpload(file) {
      console.log(file);
      var FileExt = file.name.replace(/.+\./, "");
      if (
        ["pdf", "doc", "docx", "xlsx"].indexOf(FileExt.toLowerCase()) === -1
      ) {
        this.$message.error("上传头像图片只能是excel、word、pdf格式!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 100MB!");
        return false;
      }
      return isLt2M;
    },
    stepNext() {
      if (this.filesName) {
        this.stepIndex = 2;
      } else {
        this.$message.error("请先上传文件");
      }
    },
    submit() {
      this.loading = true;
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        let params = {
          ...this.formLabelAlign,
          filePath: this.filesName,
          stationType: this.stepIndex + 1,
        };
        console.log(params);
        submitApi(params)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.loading = false;
              this.$message.success("文件已上传，请耐心等待上传结果");
              this.$router.push("/local/history");
            }
          })
          .catch(() => {
            console.log(123);
            this.loading = false;
          });
      });
    },
  },
  created() {
    this.action =
      "/szkj-datamiddleground/order/station-access-apply/uploadFile?accessToken=" +
      getToken();

    this.demo();
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.local-container {
  color: #444;
}
.btn-group-full {
  width: 450px;
  display: flex;
  height: 30px;
  .tab-btn {
    flex: 1;
    border: 1px solid #409eff;
    color: #409eff;
    line-height: 30px;
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
.btn-group {
  display: flex;
  width: 450px;
  justify-content: space-between;
  margin-top: 30px;
}
.title {
  display: flex;
  justify-content: space-between;
  .title-text {
    font-size: 25px;
  }
}
.content {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  .el-form-item {
    margin-right: 100px;
  }
}
.bg1 {
  width: 500px;
  margin-top: 30px;
  .el-button {
    width: 450px;
  }
}
.bg2 {
  width: 500px;
  margin-top: 30px;
  .el-button {
    width: 450px;
  }
}
.footer {
  cursor: pointer;
  margin-right: 30px;
  display: flex;
  a {
    line-height: 25px;
  }
}
.img {
  img {
    height: 25px;
    margin-right: 10px;
  }
}
</style>
