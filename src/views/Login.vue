<template>
  <div id="login">
    <form v-on:submit.prevent="submitForm()" method="POST" ref="login">
      <fieldset>
        <legend>로그인</legend>
        <h1>관리자 로그인</h1>
        <label class="label">
          <span class="icon">&#xe809;</span>
          <input type="text" v-model="param.userId" name="userId" placeholder="아이디를 입력해주세요" required />
        </label>
        <label class="label">
          <span class="icon">&#xe81c;</span>
          <input type="password" v-model="param.pwd" name="pwd" placeholder="비밀번호를 입력해주세요" required />
        </label>
        <label>
          <input type="checkbox" v-model="param.remember" name="remember" /> <span class="remember"> 아이디 저장</span>
        </label>
        <button type="submit">로그인</button>
      </fieldset>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useCookies } from "vue3-cookies";
import { useSettingStore } from '@src/store/store.setting';
import UserService from '@src/service/auth/UserService';
import { useAuthStore } from '@src/store/store.auth';
import { useAlertStore } from '@src/store/store.alert';
const alert = useAlertStore();

const { cookies } = useCookies();
const setting = useSettingStore();
const auth = useAuthStore();

interface LoginInfo {
  userId: string;
  pwd: string;
  remember?: boolean;
}
const settings = cookies.get('settings');
if(!settings) {
  setting.setState()
}
const param = reactive<LoginInfo>({
  userId: setting.userId,
  pwd: '',
});
const submitForm = () => {
  if(param.remember){
    setting.userId = param.userId;
  } else {
    setting.userId = '';
  }
  UserService.login(param).then(
    (res) => {
      if(res) {
        setting.setState();
        auth.loginSuccess(res.data);
      } else {
        auth.loginFail();
        alert.open({title: null, message: '회원정보와 일치하지 않습니다.' });
      }
    },
    (err) => {
      console.log(err);
    },
  );
};
</script>

<style scoped>
#login {width:100%; height:100%; padding-top:100px;}
#login form {width:400px; margin:0 auto; border-radius:10px; overflow:hidden; background:#fff;}
#login form fieldset {width:100%; padding:30px 0;}
#login form fieldset h1 {text-align:center; padding:20px 0; font-size:14px; color:#333;}
#login form fieldset img {width:50px; display:block; margin:0 auto;}
#login form fieldset img {width:50px; display:block; margin:0 auto;}
#login form fieldset label {width:80%; margin:10px auto; display: block; padding:5px;}
#login form fieldset .label {background:#eee; border:1px solid #ddd; border-radius:3px;}
#login form fieldset .label input {width:calc(100% - 40px); border:1px solid #eee; background:#eee;}
#login form fieldset .label input:focus {outline:1px solid #eee;}
#login form fieldset .remember {display:inline-block; padding-left:3px;}
#login form fieldset button {display:block; width:80%; clear:both; background:#3e22bc; border:1px solid #3e22bc; margin:10px auto; color:#fff; line-height:35px; height:40px; font-size:14px;text-shadow:1px 1px 1px rgba(0,0,0,0.3);}
#login form fieldset button:hover {background:#ff712a;}
</style>
