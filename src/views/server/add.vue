<template>
  <div class="app-container">
    <h3>新建工单</h3>
    <el-card class="box-card searchLIst card1">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="工单名称/编号">
          <el-input
            v-model="form.workOrderNumber"
            type="text"
            placeholder="请输入工单名称/编号"
          />
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select v-model="form.workOrderType" placeholder="请选择工单类型">
            <el-option
              v-for="(item, index) in options.type"
              :key="index"
              :label="item"
              :value="index + 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工单内容">
          <el-input
            v-model="form.faultPhenomenon"
            type="textarea"
            placeholder="请输入工单内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            ref="pictureUpload"
            :on-success="onsuccess"
            :action="baseURL + action"
            list-type="picture-card"
            :auto-upload="true"
            :headers="headers"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="工单派发">
          <el-checkbox-group v-model="form.orgIds">
            <el-checkbox
              v-for="(item, index) in options.distribute"
              :key="index"
              :label="item.organizeId"
            >
              {{ item.organizeName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="工单时限">
          <el-date-picker
            v-model="form.date1"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="工单区域">
          <el-select v-model="form.region" placeholder="请选择工单区域">
            <el-option
              v-for="item in options.returnTerrain"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onCancel">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { addManualOrder, returnTerrain } from "@/api/server";
import { getDepartmentApi } from "@/api/department";
import { getToken } from "@/utils/auth";
import FilterList from "@/mixins/FilterList";
export default {
  mixins: [FilterList],
  data() {
    return {
      action: "/szkj-datamiddleground/order/station-access-apply/uploadFile",
      headers: {
        accessToken: getToken(),
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      options: {
        type: ["疑难工单", "专项工单", "贬损工单"], // "重复基站", "重复用户"
        distribute: ["网优部", "维护部", "建设部", "规划部"],
        returnTerrain: [],
      },
      fileslist: [],
      form: {
        orgIds: [],
        region: "",
        workOrderType: [],
        region: "",
        workOrderNumber: "",
        // date1: "",
        // date2: "",
        faultPhenomenon: "",
      },
    };
  },
  created() {
    getDepartmentApi({}, 1, 10).then((res) => {
      if (res.code == 200) {
        console.log(res.data);
        this.options.distribute = res.data.records.filter(
          (item) => item.organizeLevel == 1
        );
        console.log(this.options.distribute);
        // res.data.records;
      } else {
        // getErrerMessage(res, "getAuthorityManagement", this);
      }
    });
    returnTerrain().then((res) => {
      this.options.returnTerrain = res.data;
    });
  },
  methods: {
    onSubmit() {
      let data = {
        filePath: this.$refs.pictureUpload.uploadFiles
          .map((item) => item.response.data)
          .join(),
        workOrderNumber: this.form.workOrderNumber,
        region: this.form.region,
        faultPhenomenon: this.form.faultPhenomenon,
        workOrderType: this.form.workOrderType,
      };
      addManualOrder({ orgIds: this.form.orgIds.join() }, data).then((res) => {
        if (res.code == 200) {
          this.$message.success("新增成功");
          this.$router.back();
        }
      });
    },
    onsuccess(res) {
      // this.fileslist.push(res.data);
    },
    handleRemove(file) {
      let uploadFiles = this.$refs.pictureUpload.uploadFiles;
      for (var i = 0; i < uploadFiles.length; i++) {
        if (uploadFiles[i]["url"] == file.url) {
          uploadFiles.splice(i, 1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    onCancel() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
<style>
.el-upload-list--picture-card .el-upload-list__item,
.el-upload--picture-card {
  width: 120px;
  height: 120px;
  line-height: 120px;
}
</style>
