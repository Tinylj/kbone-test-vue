<template>
	<div class="loginWapper lh-scroll-common" v-show="createFinished">
		<div class="content">
			<form v-if="tab_index==0">
				<div class="title-img">
					<img src="img/logo_top_181x32.png" @click="goHomePage">
				</div>
				<div class="middle-div">
                    <i class="lh-ui-font icon_user_blod"></i>
					<input autocomplete="off" v-model="ruleForm.username" placeholder="用户名/手机号/邮箱"/>
				</div>
				<div class="middle-div">
                    <i class="lh-ui-font icon_unlock_blod"></i>
					<input autocomplete="off" onfocus="this.type='password'" v-model="ruleForm.password" placeholder="密码"/>
				</div>
				<div class="sendbtn" v-bind:class="{active:(ruleForm.password && ruleForm.username)}"
					 @click="submitForm">
					立即登录
				</div>
				<div class="tool-div">
					<div class="left-div">
						<div style="margin-right: 1.6875rem">
							<el-checkbox v-model="ruleForm.rememberFiveDays">5天免登录</el-checkbox>
						</div>
						<div>
							<el-checkbox v-model="ifRememberUser">记住用户</el-checkbox>
						</div>
					</div>
					<div class="right-div">
						<a class="tool-a" @click="goForget()">忘记密码？</a>
					</div>
				</div>
				<div class="goBackBtn" @click="goTrail">没有账号？申请试用</div>
			</form>
			<template v-if="tab_index==1">
				<div class="title-big">
					找回密码
				</div>
				<div class="forget-pannel">
					<span v-bind:class="{active:(forget_index== 0)}" style="width: 33.3%;text-align: left">
						<span class="number">1</span>&nbsp;&nbsp;确认账号&nbsp;
						<div class="activeDiv" style="margin-left: -1.375rem">
						</div>
					</span>
					<span v-bind:class="{active:(forget_index== 1)}" style="width: 33.3%;text-align: center">
						<span class="number">2</span>&nbsp;&nbsp;安全验证&nbsp;
						<div class="activeDiv" style="margin-left: -0.675rem">
						</div>
					</span>
					<span v-bind:class="{active:(forget_index== 2)}" style="width: 33.3%;text-align: right">
						<span class="number">3</span>&nbsp;&nbsp;重置密码&nbsp;
						<div class="activeDiv">
						</div>
					</span>
				</div>
				<form v-show="forget_index== 0">
					<div class="forget-des">请在下方输入您的注册手机号或邮箱</div>
					<div class="middle-div">
                        <i class="lh-ui-font icon_user_blod forget-icon"></i>
						<input autocomplete="off" v-model="ruleForm_forget.username" placeholder="手机号码/邮箱"/>
					</div>
					<div class="sendbtn" style="margin-top: 78px" v-bind:class="{active:(ruleForm_forget.username)}" @click="forgetpwd">
						下一步
					</div>
					<div class="goBackBtn" @click="goBackLogin" style="margin-top: 2rem">返回登录</div>
				</form>
				<form v-show="forget_index== 1">
					<div class="forget-des">验证码已经发送至您的注册{{forgetShow.userNameType}}：<br/>{{forgetShow.username}}，请在下框输入验证信息</div>
					<div class="middle-div">
                        <i class="lh-ui-font icon_verification_blod forget-icon"></i>
						<input autocomplete="off" v-model="ruleForm_forget.code" placeholder="验证码"/>

						<a v-if="ruleForm_forget.showSend" class="tool-b" @click="forgetpwd">重新发送验证码</a>
						<span v-if="!ruleForm_forget.showSend" class="intervalSpan"><span>{{ruleForm_forget.timeCount}}s</span>后可重新发送</span>

					</div>
					<div class="sendbtn" style="margin-top: 60px" v-bind:class="{active:(ruleForm_forget.code)}" @click="secondStep">
						下一步
					</div>
					<div class="goBackBtn" @click="goBackLogin" style="margin-top: 2rem">返回登录</div>
				</form>
				<form v-show="forget_index== 2" v-on:submit.prevent="thirdStep">
					<div class="forget-des">请注意：您当前找回密码账号为：{{forgetShow.name}}<br/>
						{{forgetShow.userNameType}}为{{forgetShow.username}}，请在下框设置新密码</div>
					<div class="middle-div">
                        <i class="lh-ui-font icon_unlock_blod forget-icon"></i>
						<input autocomplete="off" onfocus="this.type='password'" v-model="ruleForm_forget.userPassword1" placeholder="密码为6-20位字母与数字组合"/>
					</div>
					<div class="middle-div">
                        <i class="lh-ui-font icon_unlock_blod forget-icon"></i>
						<input autocomplete="off" onfocus="this.type='password'" v-model="ruleForm_forget.userPassword2" placeholder="确认新密码"/>
					</div>
					<button type="submit" class="sendbtn" v-bind:class="{active:(ruleForm_forget.userPassword1 && ruleForm_forget.userPassword2)}">
						确认并返回登录
					</button>
					<div class="goBackBtn" @click="goBackLogin" style="margin-top: 2rem">取消修改</div>
				</form>
			</template>
			<template v-if="tab_index == 2">
				<form v-if="apply_index==0" v-on:submit.prevent="applyTrial">
					<div class="title-big">
						申请试用
					</div>
					<div class="title-small">您也可以移步<a @click="goContact">&nbsp;联系&nbsp;</a>页面，与我们联系</div>
					<div class="middle-div">
                        <i class="lh-ui-font icon_user_blod" style="font-size: 16px;"></i>
						<input autocomplete="off" v-model="ruleForm2.name" placeholder="姓名" maxlength="100" pattern="^[\u4e00-\u9fa5a-zA-Z]{1,100}$" title="限中英文"/>
					</div>
					<div class="middle-div">
                        <i class="lh-ui-font icon_phone" style="font-size: 17px;"></i>
						<input autocomplete="off" v-model="ruleForm2.telephone" placeholder="手机号" pattern="^1[3456789]\d{9}$" title="请输入正确的手机号"/>
					</div>
					<div class="middle-div">
                        <i class="lh-ui-font icon_mail" style="font-size: 14px;"></i>
						<input autocomplete="off" v-model="ruleForm2.mailAddress" placeholder="邮箱" pattern="^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$" title="请输入正确的邮箱格式"/>
					</div>
					<div class="middle-div">
                        <i class="lh-ui-font icon_company" style="font-size: 18px;"></i>
						<input autocomplete="off" v-model="ruleForm2.institution" placeholder="工作单位" maxlength="300"/>
					</div>
                    <div class="middle-div system-div">
                        <i class="lh-ui-font icon_system" style="font-size: 17px;"></i>
                        <!--<input autocomplete="off" v-model="ruleForm2.institution" placeholder="选择系统" maxlength="300"/>-->
                        <select2 :optionList="systemList" backType="value" select-type="2" v-model="ruleForm2.system" placeholder="选择系统"></select2>
                    </div>
					<span class="sendbtn2" @click="uploadImg">
								{{currentImgName?"重新上传":"上传名片"}}
							</span>
					<div class="uploadImgShow" v-if="currentImgName">
						<span class="span1 text-overflow" :title="currentImgName">{{currentImgName}}</span>
						<span class="span2" @click="deleteImg">
							<img class="img1" src="img/svg/icon_delete_14x14.svg">
							<img class="img2" src="img/svg/icon_delete_14x14_hover.svg">
						</span>
					</div>
					<button type="submit" class="sendbtn" style="margin-bottom: 2rem;margin-top: 1rem" v-bind:class="{active:(ruleForm2.name && ruleForm2.telephone && ruleForm2.mailAddress && ruleForm2.institution && ruleForm2.institution)}"
							:disabled="!ruleForm2.name || !ruleForm2.telephone || !ruleForm2.mailAddress || !ruleForm2.institution || !ruleForm2.system">
						提交
					</button>
					<div class="goBackBtn" @click="goBackLogin">返回登录</div>
				</form>
				<div class="apply-success-div" v-if="apply_index==1">
					<img src="img/success.png">
					<div class="success-div1">
						提交成功
					</div>
					<div class="success-div2">
						系统将于一个工作日后为您创建试用账号<br/>
						请及时查收您的电子邮件
					</div>
				</div>
			</template>
			<template v-if="tab_index==3">
				<div class="title-big">
					异地登录验证
				</div>
				<div class="forget-pannel">
					<span v-bind:class="{active:(place_index== 0)}" style="width: 50%;text-align:center ">
						<span class="number">1</span>&nbsp;&nbsp;确认账号&nbsp;
						<div class="activeDiv" style="margin-left: 0.75rem">
						</div>
							</span>
					<span v-bind:class="{active:(place_index== 1)}" style="width: 50%;text-align:center ">
						<span class="number">2</span>&nbsp;&nbsp;安全验证&nbsp;
						<div class="activeDiv" style="margin-left: 0.75rem">
						</div>
					</span>
				</div>
				<form v-show="place_index== 0">
					<div class="forget-des">请在下方输入您的注册手机号</div>
					<div class="middle-div">
						<img src="img/icon_name.svg">
						<input autocomplete="off" v-model="ruleForm_place.username" placeholder="手机号码"/>
					</div>
					<div class="sendbtn" style="margin-top: 65px"
						 v-bind:class="{active:(ruleForm_place.username)}" @click="sendPlaceCheck">
						提交
					</div>
					<div class="goBackBtn" @click="goBackLogin" style="margin-top: 2rem">返回登录</div>
				</form>
				<form v-show="place_index==1">
					<div class="forget-des">
						手机号验证码已经发送至您的注册手机：<br/>
						{{ruleForm_place.username}}，请在下框输入验证信息
					</div>
					<div class="middle-div">
						<img src="img/icon_name.svg">
						<input autocomplete="off" v-model="ruleForm_place.checkcode" placeholder="手机验证码"/>
						<a v-if="ruleForm_place.showSend" class="tool-b" @click="sendPlaceCheck">重新发送验证码</a>
						<span v-if="!ruleForm_place.showSend" class="intervalSpan"><span>{{ruleForm_place.timeCount}}s</span>后可重新发送</span>
					</div>
					<div class="sendbtn" style="margin-top: 65px"
						 v-bind:class="{active:(ruleForm_place.checkcode)}" @click="placeContinue">
						提交
					</div>
					<div class="goBackBtn" @click="goBackLogin" style="margin-top: 2rem">返回登录</div>
				</form>
			</template>
			<template v-if="loading">
				<div class="loading-div">
					<img src="img/loading.gif">
					<div class="loading-content">
						加载中
					</div>
				</div>
			</template>
		</div>
		<div class="footer">
			<span>© Copyrights&nbsp;联合见智&nbsp;2017-{{currentYear}}&nbsp;&nbsp;&nbsp;津ICP备17005731号</span><br/>
			<a target="_blank" rel="noopener" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=12010102000380">
				<img src="img/beian.png"/>&nbsp;津公网安备&nbsp;12010102000380号
			</a>
		</div>
		<form style="display: none" method="post" enctype="multipart/form-data">
			<input type="file" name="file" id="selectFileReal"/>
		</form>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import select2 from '../common/select'

export default {
  data() {
    return {
      currentYear: (new Date()).getFullYear(),
      tab_index: 0, // 0是登录框，1是忘记密码框，2是申请试用,3是异地登录验证框,
      apply_index: 0, // 申请试用下的页面。0 为申请页面  1为成功页面
      forget_index: 0, // 忘记密码下的页面
      place_index: 0, // 异地登录验证的tab
      loading: false,
      // 登录
      ruleForm: {
        username: '',
        password: '',
        rememberFiveDays: false,
      },
      // 申请试用
      ruleForm2: {
        name: '', // 用户
        mailAddress: '', // 邮箱
        telephone: '', // 电话
        institution: '', // 工作单位
        system: '', // 可选系统
      },
      ifRememberUser: false, // 记住用户
      systemList: [], // 可选系统列表
      // 忘记密码参数
      ruleForm_forget: {
        username: '', // 手机或邮箱
        code: '', // 第二步用的那个二维码
        userPassword1: '',
        userPassword2: '',
        showSend: false, // 显示验证码
        timeCount: '',
        interval: '',
      },
      // 忘记密码展示
      forgetShow: {
        userNameType: '', // 用户类型
        username: '', // 手机号或邮箱
        name: '', // 账号名称
      },

      // 异地登录验证
      ruleForm_place: {
        username: '',
        checkcode: '',
        showSend: false, // 显示验证码
        timeCount: '',
        interval: '',
      },

      currentImgName: '',
      selectFile: '',
      createFinished: '',
      // 密码验证正则   6-20位数字和字母组合的新密码
      regPassword: new RegExp('(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}'),
      // 手机号码验证正则
      regPhone: new RegExp('^1[3456789]\\d{9}$'),
      // 用户名验证   1-30位的英文/数字组合
      regName: new RegExp('^[0-9a-zA-Z]{1,30}$'),
      // regEmail
      regEmail: new RegExp("^[\\w!#$%&'*+\\/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?$")
    }
  },
  computed: {
    ...mapState(['copyRight'])
  },
  components: {
    select2
  },
  filters: {
  },
  methods: {
    // 获取可选择系统列表
    getSystemList() {
      this.ajaxGet(this.$store.state.lhInterface.trial.etPlatList).then((res) => {
        if (res.code == '5000') {
          this.systemList = res.data
        } else {
          this.$msg.error(res.message)
        }
      })
    },
    // 返回首页
    goBackHome() {
      window.location.href = this.$store.state.redirectUrl.homepage
    },
    // 去往申请试用
    goTrail() {
      this.tab_index = 2
      this.apply_index = 0
    },
    // 去往忘记密码
    goForget() {
      window.clearInterval(this.ruleForm_forget.interval)
      this.tab_index = 1
      this.forget_index = 0
      for (const a in this.ruleForm_forget) {
        this.ruleForm_forget[a] = ''
      }
      for (const a in this.forgetShow) {
        this.forgetShow[a] = ''
      }
    },
    // 调用腾讯验证码的请求
    submitForm() {
      if (this.ruleForm.username == '' || this.ruleForm.password == '' || this.ruleForm.code == '') {
        return
      }
      if (!(this.regPhone.test(this.ruleForm.username) || this.regName.test(this.ruleForm.username) || this.regEmail.test(this.ruleForm.username))) {
        this.$msg.warning('用户名不符合格式要求')
        return
      }
				const captcha1 = new TencentCaptcha( // eslint-disable-line
        '2014033945',
        (res) => {
          if (res.ret == 0) {
            this.realLogin(res)
          }
        }
      )
      captcha1.show() // 显示验证码
    },
    // 真实的请求
    realLogin(res) {
      const loginParams = {
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        randstr: res.randstr,
        ticket: res.ticket,
        rememberFiveDays: this.ruleForm.rememberFiveDays ? 'on' : 'off',
      }
      const cUser = this.ruleForm.username
      this.loading = true
      this.ajaxPost({
        url: this.$store.state.lhInterface.login.loginNew,
        params: loginParams
      }).then((res) => {
        this.loading = false
        if (res.code == '5000') {
          if (this.ifRememberUser) {
            this.$cookie.set('rememberUser', cUser, 5)
          } else {
            this.$cookie.delete('rememberUser')
          }
          if (this.$route.query.redirectUrl) {
            window.location.href = this.$route.query.redirectUrl + this.$route.hash
          } else {
            window.location.href = this.$store.state.redirectUrl.detailDashboard
          }
        }
        // 异地登录模式开启，嗷嗷嗷
        else if (res.code == '2068') {
          this.tab_index = 3
          this.place_index = 0
        } else {
          this.$msg.error(res.message)
        }
      })
    },
    // 申请处理
    applyTrial() {
      this.loading = true
      const formdata = new FormData()
      if (this.currentImgName) {
        formdata.append('file', this.selectFile)
      }
      formdata.append('name', this.ruleForm2.name)
      formdata.append('mailAddress', this.ruleForm2.mailAddress)
      formdata.append('telephone', this.ruleForm2.telephone)
      formdata.append('institution', this.ruleForm2.institution)
      formdata.append('platList', this.ruleForm2.system)
      this.ajaxPost({
        url: this.$store.state.lhInterface.trial.apply,
        params: formdata,
        type: 3
      }).then((res) => {
        this.loading = false
        if (res.code == '5000') {
          this.apply_index = 1
        } else {
          this.$msg.error(res.message)
        }
      })
    },
    // 去往联系
    goContact() {
      window.open(this.$store.state.redirectUrl.contact)
    },
    // 忘记密码
    forgetpwd() {
      if (this.ruleForm_forget.username == '' || this.ruleForm_forget.username == null) {
        return
      }
				const captcha2 = new TencentCaptcha('2014033945',// eslint-disable-line
        (res) => {
          if (res.ret == 0) {
            this.firstStep(res)
          }
        }
      )
      captcha2.show() // 显示验证码
    },
    // 第一步的提交
    firstStep(res) {
      const param = {
        ticket: res.ticket,
        randstr: res.randstr,
        username: this.ruleForm_forget.username,
      }
      this.forgetShow.userNameType = this.calUserNameType(this.ruleForm_forget.username)
      this.forgetShow.username = this.ruleForm_forget.username
      this.loading = true
      this.ajaxPost({
        url: this.$store.state.lhInterface.login.forgetpwd,
        params: param
      }).then((res) => {
        this.loading = false
        if (res.code == '5000') {
          this.forget_index = 1
          this.ruleForm_forget.showSend = false
          this.ruleForm_forget.timeCount = 60
          this.ruleForm_forget.interval = setInterval(() => {
            this.ruleForm_forget.timeCount--
            if (this.ruleForm_forget.timeCount <= 0) {
              window.clearInterval(this.ruleForm_forget.interval)
              this.ruleForm_forget.showSend = true
            }
          }, 1000)
        } else {
          this.$msg.error(res.message)
        }
      })
    },
    // 看一下是手机号还是邮箱
    calUserNameType(userName) {
      let backval = ''
      // 更新用户名类型
      if (/^1[3456789]\d{9}$/.test(userName)) {
        // 为手机号
        backval = '手机号'
      } else if (/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(userName)) {
        // 为邮箱
        backval = '邮箱'
      } else {
        backval = '用户'
      }
      return backval
    },
    // 下一步
    secondStep() {
      if (this.ruleForm_forget.code == '' || this.ruleForm_forget.code == null) {
        return
      }
      const param = {
        code: this.ruleForm_forget.code,
      }
      this.loading = true
      this.ajaxPost({
        url: this.$store.state.lhInterface.login.checkSmsCode,
        params: param
      }).then((res) => {
        this.loading = false
        if (res.code == '5000') {
          this.forget_index = 2
          this.forgetShow.name = res.data.name
          window.clearInterval(this.ruleForm_forget.interval)
        } else {
          this.$msg.error(res.message)
        }
      })
    },
    // 第三步
    thirdStep() {
      if (this.ruleForm_forget.userPassword1 == '' || this.ruleForm_forget.userPassword2 == '') {
        return
      }
      if (!this.regPassword.test(this.ruleForm_forget.userPassword1) || !this.regPassword.test(this.ruleForm_forget.userPassword2)) {
        this.$msg.warning('密码格式不正确')
        return
      }
      if (this.ruleForm_forget.userPassword1 != this.ruleForm_forget.userPassword2) {
        this.$msg.warning('两次密码输入不一致')
        return
      }
      const param = {
        userPassword1: this.ruleForm_forget.userPassword1,
        userPassword2: this.ruleForm_forget.userPassword2,
      }
      this.loading = true
      this.ajaxPost({
        url: this.$store.state.lhInterface.login.getNewPwd,
        params: param
      }).then((res) => {
        this.loading = false
        if (res.code == '5000') {
          this.$msg.success('密码修改成功')
          this.ruleForm.password = ''
          this.tab_index = 0
        } else {
          this.$msg.error(res.message)
        }
      })
    },
    // 发送验证码
    sendPlaceCheck() {
      if (this.ruleForm_place.username == '' || this.ruleForm_place.username == null) {
        return
      }
      const param = {
        username: this.ruleForm_place.username,
      }
      this.loading = true
      this.ajaxPost({
        url: this.$store.state.lhInterface.login.sendPlaceCheck,
        params: param
      }).then((res) => {
        this.loading = false
        if (res.code == '5000') {
          this.place_index = 1
          this.ruleForm_place.showSend = false
          this.ruleForm_place.timeCount = 60
          this.ruleForm_place.interval = setInterval(() => {
            this.ruleForm_place.timeCount--
            if (this.ruleForm_place.timeCount <= 0) {
              window.clearInterval(this.ruleForm_place.interval)
              this.ruleForm_place.showSend = true
            }
          }, 1000)
        } else {
          this.$msg.error(res.message)
        }
      })
    },
    // 继续登录
    placeContinue() {
      if (this.ruleForm_place.checkcode == '') {
        return
      }
      const param = {
        checkcode: this.ruleForm_place.checkcode,
      }
      this.loading = true
      this.ajaxPost({
        url: this.$store.state.lhInterface.login.loginContinue,
        params: param
      }).then((res) => {
        this.loading = false
        if (res.code == '5000') {
          window.location.href = this.$store.state.redirectUrl.detailDashboard
        } else {
          this.$msg.error(res.message)
        }
      })
    },
    // 返回登录
    goBackLogin() {
      this.tab_index = 0
      this.ruleForm.password = ''
    },
    // 上传名片
    uploadImg() {
      document.getElementById('selectFileReal').click()
    },
    // 删除图片
    deleteImg() {
      this.currentImgName = ''
    },
    // 去往200的首页
    goHomePage() {
      window.location.href = this.$store.state.redirectUrl.homepage
    },
    keyLogin(e) {
      if (e.keyCode == '13') {
        if (this.tab_index === 0) {
          // 回车登录
          this.submitForm()
        } else if (this.tab_index === 3 && this.place_index === 1) {
          // 异地回车登录
          this.placeContinue()
        }
      }
    }
  },
  created() {
    // 进来后给页面加上回车，销毁时再删除，这样回车时无需input处于焦点状态
    document.body.addEventListener('keypress', this.keyLogin)
    // 获取选择系统列表
    this.getSystemList()
    // 生命周期里至少要到created 之后。内部的双向绑定才会生效
    this.ajaxGet(this.$store.state.lhInterface.sysUser.checklogin).then((res) => {
      if (res.code == '5000') {
        if (this.$route.query.redirectUrl) {
          window.location.href = this.$route.query.redirectUrl + this.$route.hash
        } else {
          window.location.href = this.$store.state.redirectUrl.detailDashboard
        }
      } else if (res.code == '2066') {
        this.createFinished = true
        // 从外面异地登录回来的逻辑
        if (this.$route.query.showType == 'yd') {
          this.tab_index = 3
          this.place_index = 0
        }
      } else {
        this.createFinished = true
      }
    })
  },
  mounted() {
    // autoComeplate 似乎未能生效，在初始化的时候，将所有密码域的内容清空。
    this.ruleForm.username = this.$cookie.get('rememberUser')
    if (this.ruleForm.username) {
      this.ifRememberUser = true
    }
    document.getElementById('selectFileReal').onchange = (e) => {
      if (e.target.files.length < 1) {
        return
      }
      const _fileType = e.target.value.substring(e.target.value.lastIndexOf('.') + 1).toLowerCase()
      this.selectFile = e.target.files[0]// 被选中的 selectFile
      e.target.value = ''
      if (_fileType !== 'png' && _fileType !== 'jpg' && _fileType !== 'gif' && _fileType !== 'bmp' && _fileType !== 'jpeg') {
        this.$msg.error('上传图片格式不正确，请重新上传')
        return
      }
      if (this.selectFile.size > 2 * 1024 * 1024)// 最大为2mb
      {
        this.$msg.warning('您的文件大于2MB，无法上传')
        return
      }
      // what's the fuck??
				 this.currentImgName = this.selectFile.name
    }
  },
  beforeDestroy() {
    window.clearInterval(this.ruleForm_forget.interval)
  }
}
</script>

<style lang="less">
	.loginWapper {
		width: 100%;
		height: 100%;
		min-height: 630px;
		overflow-x: hidden;
		overflow-y: hidden;
		font-family: PingFang-SC-Regular,"Noto Sans SC";
		position: relative;
		.content {
			height: 100%;
			width: 100%;
			background-color: #ffffff;
			padding-left: 2.25rem;
			padding-right: 2.25rem;
			padding-bottom: 3.25rem;
			.title-img{
				padding-top: 4rem;
				img {
					width: 210px;
					height: 37px;
					margin: 0 auto;
					display: block;
				}
				padding-bottom: 2.5em;
			}
			.title-big {
				color: #3a416f;
				font-weight: bold;
				font-size: 1.6875rem;
				text-align: left;
				margin-top: 3rem;
			}
			.title-small {
				color: #96a3b4;
				margin-top: 0.75rem;
				margin-bottom: 1.5rem;
				text-align:left;
				a {
					color: #2093ff;
					cursor: pointer;
				}
			}
			//抽离出来
			.middle-div {
				width: 100%;
				height: 2.75rem;
				border-radius: 4px;
				position: relative;
				margin-bottom: 0.8125rem;
				img {
					position: absolute;
                    z-index: 2;
					width: 1.0625rem;
					height: 1.0625rem;
					left: 1.1875rem;
					top: 0.8125rem;
				}
                .lh-ui-font {
                    position: absolute;
                    height: 1rem;
                    left: 1.1875rem;
                    z-index: 2;
                    color: #9ea3a9;
                    display: inline-block;
                    width: 1.25rem;
                    top: 0;
                    text-align: center;
                    line-height: 2.75rem;
                }
                .forget-icon{
                    margin-left: -2px;
                }
				input {
					width: 100%;
					height: 100%;
					color: #324151;
					border: solid 1px #ebeff4;
					font-size: 1rem;
					background-color: #ebeff4;
					padding-left: 3.5625rem;
					border-radius: 4px;
					&:focus {
						background-color: white;
						border: solid 1px #2093ff;
					}
					//参考文章 https://harttle.land/2018/05/17/hover-active-focus-highlight-color.html
					&:hover {
						background-color: white;
						border: solid 1px #2093ff;
					}
					&:active {
						background-color: white;
						border: solid 1px #2093ff;
					}
				}

				input::-webkit-input-placeholder {
					color: #9ea3a9;
				}

				input:-moz-placeholder {
					color: #9ea3a9;
				}

				input::-moz-placeholder {
					color: #9ea3a9;
				}

				input:-ms-input-placeholder {
					color: #9ea3a9;
				}
			}
			.sendbtn {
				width: 100%;
				height: 2.75rem;
				background-color: rgba(32,147,255,0.4);
				border-radius: 4px;

				border: none;  //自定义边框
				outline: none;    //消除默认点击蓝色边框效果

				text-align: center;
				line-height: 2.75rem;
				font-size: 1rem;
				color: white;
				opacity: 1;
				cursor: not-allowed;

				/*&.active:hover {*/
				/*background-color: rgba(255,255,255,0.8);*/
				/*}*/
				/*&.active:active {*/
				/*background-color: rgba(255,255,255,0.8);*/
				/*}*/

				&.active {
					background-color: #2093ff;
					color: white;
					cursor: pointer;

				}
			}
			.sendbtn2 {
				width: 100%;
				height: 2.75rem;
				background-color: white;
				border-radius: 4px;

				border: solid 1px #2093ff;
				outline: none;    //消除默认点击蓝色边框效果

				text-align: center;
				line-height: 2.75rem;
				font-size: 1rem;
				color: #2677ed;
				opacity: 1;
				cursor: pointer;
				display: block;
			}
			//显示上传图片
			.uploadImgShow{
				height: 0.875rem;
				margin-top: 0.75rem;
				.span1{
					float: left;
					color:#a7b1bc;
					font-size: 12px;
					display: inline-block;
					max-width: 260px;
				}
				.span2{
					float: left;
					margin-left: 6px;
					cursor: pointer;
					img {
						height:0.875rem;
						width: 0.875rem;
					}
					.img1 {
						display: inline-block;
					}
					.img2 {
						display: none;
					}
					&:hover {
						.img1 {
							display: none;
						}
						.img2 {
							display: inline-block;
						}
					}
				}
			}
			.goBackBtn {
				color: #2093ff;
				font-size: 1rem;
				text-align: center;
			}
			.tool-div {
				height: 7rem;
				padding-top: 1.5rem;
				.left-div {
					float: left;
					>div {
						float: left;
					}
				}
				.right-div {
					float: right;
				}
				& /deep/ .el-checkbox__label{
					font-size: 0.8125rem;
				}
				& /deep/ .el-checkbox {
					color:#6f757d;
				}
				& /deep/ .el-checkbox__inner {
					width: 1.125rem;
					height: 1.125rem;
				}
				& /deep/ .el-checkbox__inner::after {
					left:0.375rem;
					top:0.1875rem;
				}
			}
			.tool-a {
				/*text-decoration: underline;*/
				color: #6f757d;
				display: inline-block;
				font-size: 0.8125rem;
			}
			.tool-b {
				color: #2677ed;
				display: inline-block;
				font-size: 12px;
				cursor: pointer;
				position: absolute;
				right: 10px;
				top: 11px;
			}
			.apply-success-div {
				img {
					display: block;
					margin: 0 auto;
					margin-top: 40%;
				}
				.success-div1 {
					margin-top: 36px;
					text-align: center;
					color: #2093ff;
					font-weight: bold;
					font-size: 20px;
				}
				.success-div2 {
					color: #96a3b4;
					text-align: center;
					font-size: 0.875rem;
					line-height: 1.5rem;
					margin-top: 1.5rem;
				}
			}
			.forget-pannel {
				font-size: 1rem;
				height: 1.875rem;
				color: #6f757d;
				margin-top: 2rem;
				> span {
					display: inline-block;
					position: relative;
					.activeDiv {
						width: 30px;
						height: 2px;
						background-color: #2093ff;
						position: absolute;
						display: none;
						bottom:0;
						left:3rem;
					}
				}

				.number {
					font-family: Impact, serif;
				}

				> .active {
					color: #2093ff;
					height: 30px;
					.activeDiv {
						display: block;
					}
				}
			}
			.forget-des{
				color:#96a3b4;
				font-size: 0.75rem;
				margin-top: 1.375rem;
				margin-bottom: 1.25rem;
				line-height: 1.125rem;
			}
			.intervalSpan {
				position: absolute;
				right: 0.625rem;
				top:0.75rem;
				color: #6f757d;
				display: inline-block;
				font-size: 0.75rem;
				span {
					color: #2677ed;
				}
			}
		}
		.footer {
			position: absolute;
			font-size: 0.6875rem;
			line-height: 1rem;
			color: #a7b1bc;
			text-align: center;
			bottom:0;
			width: 100%;
			height: 3.25rem;
			a{
				color:#a7b1bc;
			}
		}

		.loading-div {
			height: 100%;
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			background-color: white;
			z-index:2000;
			img{
				margin-top: 168px;
				margin-left: -moz-calc(~"50% - 9px");
				margin-left: -webkit-calc(~"50% - 9px");
				margin-left: calc(~"50% - 9px");

				margin-bottom: 24px;
			}
			.loading-content {
				font-size: 14px;
				color:#a7b1bc;
				text-align: center;
			}
		}
	}
    .system-div{
        .lh-select{
            width: 100%!important;
        }
        /deep/ .lh-select-text{
            background-color: #ebeff4;
            width: 100%;
            height: 2.75rem;
            line-height: 2.75rem;
            border: none;
            font-size: 1rem;
            padding-left: 3.5625rem;
            .dropdown-icon{
                top: 0;
            }
            .lh-select-placeholder{
                line-height: 2.75rem;
                color: #9ea3a9;
                font-size: 1rem;
            }
            .lh-select-node{
                font-size: 1rem;
                color: #324151;
                background: #dbe0e7;
                position: relative;
                height: 1.375rem;
                line-height: 1.375rem;
                padding-right: 1.25rem;
                margin-top: .5rem;
            }
            .lh-select-more{
                height: 1.375rem;
                line-height: 1.375rem;
                margin-top: .5rem;
                background: #dbe0e7;
            }
        }
    }
</style>
