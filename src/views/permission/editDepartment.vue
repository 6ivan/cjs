<template>
  <div class="app-container card">
    <h3>{{title}}</h3>
    <div class="box-card searchLIst">
      <el-form ref="elForm" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="组织编号" prop="organizeCode">
          <el-input
            v-model="form.organizeCode"
            placeholder="请输入组织编号"
            style="width: 25%"
          />
        </el-form-item>
        <el-form-item label="组织中文名" prop="organizeName">
          <el-input
            style="width: 25%"
            v-model="form.organizeName"
            placeholder="请输入组织中文名"
          />
        </el-form-item>
        <el-form-item label="组织级别" prop="organizeLevel">
          <el-input
            v-model="form.organizeLevel"
            placeholder="请输入组织级别"
            style="width: 25%"
          />
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId" v-if="!form.isRoot">
          <el-cascader
            style="width: 25%"
            v-model="form.parentId"
            :options="options"
            placeholder="请选择上级部门"
            :props="{
              checkStrictly: true,
              checkStrictly: true,
              multiple: false,
              expandTrigger: 'hover',
              value: 'organizeId',
              label: 'organizeName',
              children: 'children',
            }"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="是否根节点" prop="isRoot">
          <el-radio-group v-model="form.isRoot">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">不是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            controls-position="right"
            placeholder="请输入"
            :min="1"
            :max="10"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onCancel">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getDepartmentApi,
  updateDepartmentApi,
  getDepartmentDetileApi,
  getDepartmentTreeApi
} from "@/api/department";
export default {
  data() {
    return {
      title:'新建部门信息',
      form: {
        name: '',
        isRoot: 1,
        status: 1,
      },
      options: [],
      rules: {
        organizeCode: [
          {
            required: true,
            message: "请输入组织编号",
            trigger: "blur",
          },
        ],
        organizeName: [
          {
            required: true,
            message: "请输入组织中文名",
            trigger: "blur",
          },
        ],
        organizeLevel: [
          {
            required: true,
            message: "请输入组织级别",
            trigger: "blur",
          },
        ],
        parentId: [
          {
            required: true,
            message: "请选择上级部门",
            trigger: "change",
          },
        ],
        isRoot: [
          {
            required: true,
            message: "请选择是否根节点",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择部门状态",
            trigger: "change",
          },
        ],
        sort: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
          },
        ],
      },
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.title = '修改部门信息'
      //请求表格列表数据
      var param = {};
      param.userId = this.$route.query.id;
      getDepartmentDetileApi(this.$route.query.id)
        .then((res) => {
          this.form = res.data
        })
        .catch((error) => {
        });
    }
    this.iconList = elementIcons
    this.getList()
  },
  methods: {
    onSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        let params = {
          ...this.form
        };
        updateDepartmentApi(params).then((res) => {
          if (res.code == 200) {
            this.$router.back()
          }
        });
      });
    },
    onCancel() {
      this.$router.back()
    },
    handleChange(value) {
      this.form.parentId = value[value.length - 1]
    },
    getList() {
      getDepartmentTreeApi()
        .then((res) => {
          if (res.code == 200) {
            this.options = res.data;
          }
        })
        .catch((error) => {
        });
    },
  }
}
</script>
<style lang="scss" scoped>
h3 {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-left: -20px;
  padding-left: 20px;
}
</style>
