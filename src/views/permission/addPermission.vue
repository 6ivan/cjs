<template>
  <div class="app-container card">
    <h3>新增权限</h3>
    <div class="box-card searchLIst">
      <el-form ref="elForm" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="上级权限" prop="parentId">
          <el-cascader
            style="width: 25%"
            v-model="form.parentId"
            :options="parentMenuOptions"
            placeholder="请选择上级权限"
            :props="{
              checkStrictly: true,
              checkStrictly: true,
              multiple: false,
              expandTrigger: 'hover',
              value: 'menuId',
              label: 'menuName',
              children: 'children',
            }"
            clearable
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="本级权限名称" prop="menuName">
          <el-input
            v-model="form.menuName"
            placeholder="请输入本级权限名称"
            style="width: 25%"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number
            v-model="form.orderNum"
            controls-position="right"
            placeholder="请输入显示顺序"
            :min="1"
            :max="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input
            v-model="form.path"
            placeholder="请输入路由地址"
            style="width: 25%"
          />
        </el-form-item>
        <el-form-item label="菜单编号" prop="menuCode">
          <el-input
            v-model="form.menuCode"
            placeholder="请输入菜单编号"
            style="width: 25%"
          />
        </el-form-item>

        <el-form-item label="类型" prop="menuType">
          <el-select
            v-model="form.menuType"
            placeholder="请选择类型"
            style="width: 25%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="显示状态" prop="visible">
          <el-radio-group v-model="form.visible">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuStatus">
          <el-radio-group v-model="form.menuStatus">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标">
          <div style="width: 25%; height: 40px" class="chooseIcons">
            <el-popover placement="bottom" width="450" trigger="click">
              <span
                slot="reference"
                style="
                  display: inline-block;
                  width: 100%;
                  height: 40px;
                  line-height: 40px;
                "
              >
                <i :class="form.icon" style="font-size: 20px"></i>
                {{ chooseIcons }}
              </span>
              <div class="iconList">
                <i
                  v-for="item in iconList"
                  :key="item"
                  :class="item"
                  @click="setIcon(item)"
                  style="font-size: 20px"
                ></i>
              </div>
            </el-popover>
          </div>
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
import { elementIcons } from '@/utils/icon'
import { getDetileApi, putPowerApi } from '@/api/power'
import { getPowerApi } from '@/api/power'
export default {
  data() {
    return {
      rules: {
        menuName: [
          {
            required: true,
            message: "请选择菜单名称",
            trigger: "change",
          },
        ],
        orderNum: [
          {
            required: true,
            message: "请输入显示顺序",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            message: "请输入路由地址",
            trigger: "blur",
          },
        ],
        menuCode: [
          {
            required: true,
            message: "请输入菜单编号",
            trigger: "blur",
          },
        ],
        menuType: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
          },
        ],
        visible: [
          {
            required: true,
            message: "请选择显示状态",
            trigger: "change",
          },
        ],
        menuStatus: [
          {
            required: true,
            message: "请选择菜单状态",
            trigger: "change",
          },
        ],
      },
      options: [{
        value: 1,
        label: '目录'
      }, {
        value: 2,
        label: '菜单'
      }, {
        value: 3,
        label: '按钮',
      },
      {
        value:4,
        label:'接口'
      }
      ],
      options1: [{
        value: 0,
        label: '显示'
      }, {
        value: 1,
        label: '隐藏'
      }],
      options3: [{
        value: 0,
        label: '正常'
      }, {
        value: 1,
        label: '停用'
      }],
      parentMenuOptions: [],
      parentMenu: [],
      form: {
        visible: 0,
        menuStatus: 0
      },
      icon: '',
      id: '',
      chooseIcons: null,
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.title = '修改用户信息'
      //请求表格列表数据
      var param = {};
      param.userId = this.$route.query.id;
      getDetileApi(this.$route.query.id)
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
    setIcon(icon) {
      console.log(icon)
      this.form.icon = icon;//将i的样式设为选中的样式el-icon-xxx
      this.chooseIcons = ""
    },
    handleChange(value) {
      this.form.parentId = value[value.length - 1]
    },
    getList() {
      getPowerApi({}).then((res) => {
        console.log(res)
        if (res.code == 200) {
          this.parentMenuOptions = res.data
        }
      })
    },
    onSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        let params = {
          ...this.form
        };
        putPowerApi(params).then((res) => {
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
<style lang="scss" scoped>
.iconList {
  width: 400px;
  height: 300px;
  overflow-y: scroll; //y轴显示滚动条
  overflow-x: hidden; //x轴溢出隐藏
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap; //一定要换行
  i {
    display: inline-block;
    width: 60px;
    height: 45px;
    color: #000000;
    font-size: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    margin: 5px;
    &:hover {
      // color: $ft;
      // border-color: $ft;
    }
  }
}
.chooseIcons {
  border: #dcdfe6 1px solid;
  border-radius: 4px;
  padding: 0 20px;
}
h3 {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-left: -20px;
  padding-left: 20px;
}
</style>
