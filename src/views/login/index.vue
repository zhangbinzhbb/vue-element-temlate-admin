<template>
  <div class="login-container">
    <div class="login-layout">
      <div class="login-head">
        <img
          class="logo"
          src="https://s.weituibao.com/1582958061265/mlogo.png"
        />
        <div class="name">
          <div class="title">乐摇摇</div>
          <div class="tips">后台管理系统</div>
        </div>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('login.password')"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye-off' : 'eye-on'"
              />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
        >
          {{ $t("login.logIn") }}
        </el-button>

        <div style="position: relative">
          <div class="tips">
            <span>{{ $t("login.username") }} : admin</span>
            <span>{{ $t("login.password") }} : {{ $t("login.any") }}</span>
          </div>
          <div class="tips">
            <span style="margin-right: 18px">
              {{ $t("login.username") }} : editor
            </span>
            <span>{{ $t("login.password") }} : {{ $t("login.any") }}</span>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { validUsername } from "@/utils/validate";
import SocialSign from "./components/SocialSignin";

export default {
  name: "Login",
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "111111",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
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
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
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
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      height: 47px;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      -webkit-appearance: none;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }
  .el-form-item {
    border-radius: 5px;
    color: #454545;
    border: 1px solid #ccc;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  .login-layout {
    width: 420px;
    height: 500px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 21px 41px 0 rgba(0, 0, 0, 0.2);
    .login-head {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 0 20px 0;
      img {
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
      .title {
        font-size: 28px;
        color: #1baeae;
        font-weight: bold;
      }
      .tips {
        font-size: 12px;
        color: #999;
      }
    }
  }
  .login-form {
    width: 70%;
    margin: 0 auto;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #ccc;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 6px;
    font-size: 16px;
    color: #ccc;
    cursor: pointer;
    user-select: none;
  }
}
</style>
