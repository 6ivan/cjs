<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form form-card"
      auto-complete="on"
      label-position="left"
    >
      <div class="card">
        <div class="title-container">
          <h3 class="title">云网优化调度支撑平台</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
        <div class="tips">
          <span style="margin-right: 20px" />
          <!-- <router-link style="color: #283443" :to="{ path: '/register' }"
            >立即注册</router-link
          > -->
          <!-- <span> password: any</span> -->
        </div>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { encrypt } from "@/utils/auth";
import {
  getErrer,
  getErrerMessage,
  login,
  getTokenApi,
  loginApi,
  clearCache,
} from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import request from "@/utils/request";
export default {
  name: "Login",
  // created() {
  //   console.log(
  //     getTokenApi().then((res) => {
  //       console.log(res);
  //     })
  //   );
  //   getTokenApi();
  // },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error("Please enter the correct user name"));
      // } else {
      callback();
      // }
    };
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 6) {
      //   callback(new Error("The password can not be less than 6 digits"));
      // } else {
      callback();
      // }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        // this.redirect = route.query && route.query.redirect;
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // setToken('123456')
    // 清redis 缓存接口
    // clearCache().then(response => {
    //     console.log(qqq)
    //   }).catch(error => {
    //     reject(error)
    //   })
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          const msg = {
            username: this.loginForm.username,
            password: encrypt(this.loginForm.password),
          };
          this.loading = true;
          // try {
          //   await request({
          //     url: '/szkj-usersystem/sys-user/login',
          //     method: 'get',
          //     params: {
          //       userName: this.loginForm.username,
          //       password: encrypt(this.loginForm.password)
          //     }
          //   })
          // } catch (e) {
          //   // TODO handle the exception
          // }
          // this.$store.commit("SET_TOKEN", "35FDD6B6337646A4B20740D014CD709A");
          this.$store
            .dispatch("user/login", msg)
            .then(() => {
              this.$store.dispatch("user/getMenuListByUser").then(() => {
                this.$router.push({ path: "/" }).catch(()=>{
                  console.log(1)
                })
                this.loading = false;
              });
            })
            .catch(() => {
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });

          // 离岸开发后 把登录打开
          // login({ userName: this.loginForm.username.trim(), password: this.loginForm.password })
          //   .then((response) => {

          //   })
          //   .catch((error) => {

          //   });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #283443;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background: url("../../../src/assets/123.png") no-repeat center / cover;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        // box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      color: #347cef;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.login-container .el-form-item {
  background: #fff;
  color: #283443;
  border: 1px solid #d3d3d3;
}
.login-container .el-input ::v-deep input {
  color: #283443 !important;
}
.login-container input::-webkit-input-placeholder {
  color: #c0c4cc;
}
.login-container input::-moz-input-placeholder {
  color: #c0c4cc;
}
.login-container input::-ms-input-placeholder {
  color: #c0c4cc;
}
</style>
