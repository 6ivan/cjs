<template>
  <div class="app-container">
    <h3>修改权限配置</h3>
    <el-card class="box-card searchLIst">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="权限名称">
          <el-input v-model="form.menuName" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限路径">
          <el-input v-model="form.path" placeholder="请输入权限级别" />
        </el-form-item>
        <el-form-item label="菜单顺序">
          <el-input v-model="form.orderNum" placeholder="请输入菜单顺序" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-checkbox :checked="form.visible" @change="changeVlaue">是否显示</el-checkbox>
        </el-form-item>

        <el-form-item label="图标">
          <e-icon-picker>
            <template #prepend="{ icon }">
              <e-icon :icon-name="icon" class="e-icon" />
            </template>
            <template #icon="{ icon }">
              <e-icon :icon-name="icon" class="e-icon" />
            </template>
            <!-- <e-icon :icon-name="icon"/> -->
          </e-icon-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onCancel">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getDetileApi, putPowerApi } from '@/api/power'
export default {
  data() {
    return {
      form: {
        name: '',
        level: 1,
        code: ''
      },
      icon: '',
      id: ''
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getDetile()
  },
  methods: {
    changeVlaue(val) {
      console.log(val)
      this.form.visible = val
    },
    getDetile() {
      getDetileApi(this.id).then(res => {
        this.form = res.data
        this.form.visible = Boolean(res.data.visible)
      })
    },
    onSubmit() {
      // this.$message("submit!");
      const data = this.form
      data.visible = Number(this.form.visible)
      putPowerApi(data).then(res => {
        this.$message.success(res.msg)
      })
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>
