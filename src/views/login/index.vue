<!--
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 18:24:27
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
-->
<template>
  <div class="login">
    <el-form class="form" :model="model" :rules="rules" ref="loginForm">
      <h1 class="title">尚品甄选-后台系统</h1>
      <el-form-item prop="userName">
        <el-input
          class="text"
          v-model="model.userName"
          prefix-icon="User"
          clearable
          :placeholder="$t('login.username')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="text"
          v-model="model.password"
          prefix-icon="Lock"
          show-password
          clearable
          :placeholder="$t('login.password')"
        />
      </el-form-item>
      <el-form-item prop="captcha">
        <div class="captcha">
          <el-input
            class="text"
            v-model="model.captcha"
            prefix-icon="Picture"
            clearable
            :placeholder="$t('login.captcha')"
          />
          <img :src="model.codeValue" @click="getValidateCode" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="btn"
          size="large"
          @click="submit"
        >{{ btnText }}</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="change-lang">
    <change-lang />
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
  watch,
  onMounted,
} from 'vue'
import { Login, GetCaptcha } from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
import ChangeLang from '@/layout/components/Topbar/ChangeLang.vue'
import useLang from '@/i18n/useLang'
import { useApp } from '@/pinia/modules/app'

export default defineComponent({
  components: { ChangeLang },
  name: 'login',
  setup() {
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this
    const router = useRouter()
    const route = useRoute()
    const { lang } = useLang()
    watch(lang, () => {
      state.rules = getRules()
    })
    const getRules = () => ({
      userName: [
        {
          required: true,
          message: ctx.$t('login.rules-username'),
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: ctx.$t('login.rules-password'),
          trigger: 'blur',
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t('login.rules-regpassword'),
          trigger: 'blur',
        },
      ],
      captcha: [
        {
          required: true,
          message: ctx.$t('login.rules-captcha'),
          trigger: 'blur',
        }
      ],
    })

    //钩子函数onMounted, 页面打开后马上执行
    onMounted(() => {
      //发送ajax请求，获取图片验证码
      state.getValidateCode()
    })

    const state = reactive({
      model: {
        userName: 'admin',
        password: '111111',
        codeKey: '', //验证码对应的key
        codeValue: '', //验证码的图片base64
        captcha: '', //输入框填写的验证码
      },
      rules: getRules(),
      loading: false,
      btnText: computed(() =>
        state.loading ? ctx.$t('login.logining') : ctx.$t('login.login')
      ),
      loginForm: ref(null),
      getValidateCode: async () => {
        //发送ajax请求，获取图片验证码
        const { code, data, message } = await GetCaptcha()
        if (code === 200) {
          //验证码对应的key
          state.model.codeKey = data.codeKey
          //验证码的图片
          state.model.codeValue = 'data:image/png;base64,' + data.codeValue
        } else {
          //错误提示
          ctx.$message.error(message)
        }
      },
      submit: () => {
        //避免重复点击-如果正在加载中，则直接返回停止
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          //如果表单验证通过
          if (valid) {
            //开始加载层
            state.loading = true
            //发送ajax请求，完成登录
            const { code, data, message } = await Login(state.model)
            if (+code === 200) {
              //登录成功

              //提示消息
              ctx.$message.success({
                message: ctx.$t('login.loginsuccess'),
                duration: 1000,
              })

              //获取路径中的redirect参数，去上一个页面
              const targetPath = decodeURIComponent(route.query.redirect)
              if (targetPath.startsWith('http')) {
                // 如果路径是http开头，则直接跳转过去
                window.location.href = targetPath
              } else if (targetPath.startsWith('/')) {
                // 如果是/开头，则使用路由跳转到当前项目的页面
                router.push(targetPath)
              } else {
                // 否则跳转到当前项目的首页
                router.push('/')
              }

              //将响应的数据data（token令牌），保存到localStorage对象中，浏览器保存了
              useApp().initToken(data)
            } else {
              //重新加载验证码
              state.getValidateCode()
            }
            //关闭加载层
            state.loading = false
          }
        })
      },
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.login {
  transition: transform 1s;
  transform: scale(1);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #2d3a4b;
  .form {
    width: 520px;
    max-width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    margin: 160px auto 0;
    :deep {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        background: rgba(0, 0, 0, 0.1);
      }
      .el-input-group--append > .el-input__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .el-input-group--prepend > .el-input__wrapper {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    .title {
      color: #fff;
      text-align: center;
      font-size: 24px;
      margin: 0 0 24px;
    }
    .text {
      font-size: 16px;
      :deep(.el-input__inner) {
        color: #fff;
        height: 48px;
        line-height: 48px;
        &::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
      }
    }
    .btn {
      width: 100%;
    }
  }
}
.change-lang {
  position: fixed;
  right: 20px;
  top: 20px;
  :deep {
    .change-lang {
      height: 24px;
      &:hover {
        background: none;
      }
      .icon {
        color: #fff;
      }
    }
  }
}
.captcha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.captcha img {
  cursor: pointer;
  margin-left: 10px;
  width: 220px;
}
</style>
