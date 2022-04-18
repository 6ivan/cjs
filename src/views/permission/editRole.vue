<template>
  <div class="app-container card">
    <h3>{{ title }}</h3>
    <div class="content">
      <div class="searchLIst">
        <div class="title">基本信息</div>
        <el-form ref="elForm" :model="form" label-width="120px" :rules="rules">
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="form.roleCode" placeholder="请输入角色编码" style="width: 25%"/>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名称" style="width: 25%"/>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择类型"
              style="width: 25%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否管理员" prop="isAdmin">
            <el-radio-group v-model="form.isAdmin">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">不是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="form.sort"
              controls-position="right"
              placeholder="请输入"
              :min="1"
              :max="99"
            ></el-input-number>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="onCancel">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoleApi, updateRoleApi, getRoleDetileApi } from "@/api/role";
export default {
  data() {
    return {
      rules: {
        roleCode: [
          {
            required: true,
            message: "请输入角色编码",
            trigger: "blur",
          },
        ],
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
          },
        ],
        isAdmin: [
          {
            required: true,
            message: "请选择是否管理员",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择是否启用",
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
      options: [{
        value: 1,
        label: '系统角色'
      }, {
        value: 2,
        label: '第三方系统角色'
      }],
      form: {
        type: 1,
        isAdmin: 0,
        status: 1
      },
      title: '新增角色'
    }
  },
  created() {
    if (this.$route.query.id) {
      this.title = '编辑角色'
      var param = {};
      param.userId = this.$route.query.id;
      getRoleDetileApi(this.$route.query.id)
        .then((res) => {
          this.form = res.data
        })
        .catch((error) => {
          // getErrer(error, this);
        });
    }
  },
  methods: {
    onSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        let params = {
          ...this.form
        };
        updateRoleApi(params).then((res) => {
          if (res.code == 200) {
            this.$router.back()
          }
        });
      });
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.title {
  margin-left: 40px;
  margin-bottom: 20px;
  font-size: 18px;
}
h3 {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-left: -20px;
  padding-left: 20px;
}
</style>
