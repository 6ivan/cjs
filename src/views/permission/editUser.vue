<template>
  <div class="app-container card">
    <h3>{{ title }}</h3>
    <div class="content">
      <div class="searchLIst">
        <div class="title">基本信息</div>
        <el-form ref="formData" :model="form" label-width="120px" :rules="rules">
          <el-form-item label="用户编号" prop="userCode">
            <el-input v-model="form.userCode" placeholder="请输入用户编码" />
          </el-form-item>
          <el-form-item label="显示名" prop="displayName">
            <el-input v-model="form.displayName" placeholder="请输入显示名" />
          </el-form-item>
          <el-form-item label="登录名" prop="loginName">
            <el-input v-model="form.loginName" placeholder="请输入登录名" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择类型"
              style="width: 100%"
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
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="form.sort"
              controls-position="right"
              placeholder="请输入"
              :min="1"
              :max="99"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handelConfirm">提交</el-button>
            <el-button @click="onCancel">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="searchLIst2">
        <div class="title">用户详细信息</div>
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
          <el-form-item label="真实姓名">
            <el-input v-model="form.realName" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select
              v-model="form.gender"
              placeholder="请选择性别"
              style="width: 100%"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话">
            <el-input @blur="verificationPhone" v-model="form.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input @blur="verificationEmail" v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-form>
      </div>
      <div class="searchLIst3">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
          <el-form-item label="QQ">
            <el-input v-model="form.qq" placeholder="请输入QQ" />
          </el-form-item>
          <el-form-item label="微信">
            <el-input v-model="form.wechat" placeholder="请输入微信" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input
              v-model="form.address"
              placeholder="请输入地址"
              type="textarea"
              :rows="3"
              maxlength=200
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  saveOrUpdateUser,
  selectPage,
  getDetileApi
  // FilterList,
} from "@/api/user";
import {validEmail,validPhone } from '../../utils/validate'
export default {
  data() {
    return {
      rules: {
        userCode: [
          {
            required: true,
            message: "请输入用户编码",
            trigger: "blur",
          },
        ],
        displayName: [
          {
            required: true,
            message: "请输入显示名",
            trigger: "blur",
          },
        ],
        loginName: [
          {
            required: true,
            message: "请输入登录名",
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
        sort: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
          },
        ],
      },
      id: "",
      title: '新增用户信息',
      options: [{
        value: '1',
        label: '系统用户'
      }, {
        value: '2',
        label: '外部用户'
      }],
      options1: [{
        value: 0,
        label: '男'
      }, {
        value: 1,
        label: '女'
      }],
      form: {
        userCode:'',
        type: '1',
        unit: [],
        status: true,
        role: '',
        userDetail: {},
        email:'',
        phone:'',
        displayName:'',
        loginName:''
      }
    }
  },
  created() {
    console.log(this.form)
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.title = '修改用户信息'
      //请求表格列表数据
      var param = {};
      param.userId = this.$route.query.id;
      getDetileApi(this.$route.query.id)
        .then((res) => {
          this.form = res.data
          this.form = { ...this.form, ...this.form.userDetail }
        })
        .catch((error) => {
          this.loadingList = false;
          // getErrer(error, this);
        });
    }
  },
  methods: {
    handelConfirm() {
      if(this.form.email !== ""){
        if(!validEmail(this.form.email)){
          this.$message.error("请输入正确的邮箱！")
          return
        }
      }
      if(this.form.phone !==""){
         if(!validPhone(this.form.phone)){
          this.$message.error("请输入正确的手机号码！")
          return
          }
      }
     
      this.$refs["formData"].validate((valid) => {
        if (!valid) return;
        let params = {
          userCode: this.form.userCode,
          displayName: this.form.displayName,
          loginName: this.form.loginName,
          type: this.form.type,
          sort: this.form.sort,
          userDetail: {
            realName: this.form.displayName,
            gender: this.form.gender,
            phone: this.form.phone,
            email: this.form.email,
            qq: this.form.qq,
            wechat: this.form.wechat,
            address: this.form.address,
          },
        };
        if (this.$route.query.id) {
          params.userId = this.$route.query.id
        }
        saveOrUpdateUser(params).then((res) => {
          if (res.code == 200) {
            if(this.$route.query.id){
              this.$message({
              type: "success",
              message: "修改成功!",
            });
            }else{
              this.$message({
              type: "success",
              message: "新建成功!",
            });
            }
            
            this.$router.back()
          }
        });
      });
    },
    onCancel() {
      this.$router.back()
    },
    verificationEmail(){
      if(this.form.email=="")return
      console.log( validEmail(this.form.email))
      if(!validEmail(this.form.email)){
        this.$message.error("请输入正确的邮箱！")
      }
    },
    verificationPhone(){
       if(this.form.phone=="")return
        console.log( validPhone(this.form.email))
        if(!validPhone(this.form.phone)){
        this.$message.error("请输入正确的手机号码！")
      }
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
.content {
  display: flex;
}
.searchLIst {
  width: 33%;
  /* margin-right: 20px; */
}
h3 {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-left: -20px;
  padding-left: 20px;
}
.searchLIst2 {
  width: 33%;
}
.searchLIst3 {
  width: 33%;
  margin-top: 40.7px;
}
</style>
