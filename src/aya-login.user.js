// ==UserScript==
// @name        Aya login
// @namespace   super-bit-sr3k-login
// @author      'o1'*5
// @description BIT Srun3k Login Enhancer.
// @include     http://10.0.0.55/*
// @version     2.3.9
// @grant       none
// ==/UserScript==

/**
 * 某bit的超srun3k校园网登录
 */
window.onload = 0;
var aya = new function () {
  console.log('あやや　始まるよ　!!');

  /**
   * 启用自动登录：修改 imbakabakabaka 和 23333 为自己的用户名和密码即可……
   * 关闭自动登录：将用户名留空即可
   */
  var id = {
    'username':'imbakabakabaka',/**< 用户名 */
    'password':'23333'          /**< 密码   */
  };
  
  /**
   * 页面原本自动保存下来的用户名和密码
   */
  var preserveId = {
    'uname':'',
    'pass':''
  };

  /** 主题
   *  都是JSON String
   */
  var theme = {
    bodyHTML:"",
    CSS:"",
    Javascript:""
  };

  /**
   * 跳转到登录页面之前的地址
   * 存在   : 之前的地址
   * 不存在 : ''
   * ://……?url=ORIGINAL_LOCATION
   * ://……?ORIGINAL_LOCATION
   */
  var original_location = (function (){
    var url = window.location.toString().match(/\?(?:url=)?(https?:\/\/.*)$/);
    if (url) {
      return url[1] || false;
    } else {
      return false;
    }
  })();
  $('original_location:' + original_location);
  
  /** 联网状态
   * 有三种取值，写入值的时候同时在 window 上触发对应事件
   * true:已经联网，触发 aya-online 事件
   * false:已经断网，触发 aya-offline 事件
   * "wtf":未知/正在确定联网状态，触发 aya-wtfline 事件
   * 其它取值：静默失败
   */
  Object.defineProperty(this,'isOnline',{
    configurable:true,
    enumerable:true,
    set:function (value) {
      if      (value === true)  { this.value = value; document.body.setAttribute('class', 'online') ; window.dispatchEvent(new Event('aya-online'));  $('aya.isOnline : now online'); }
      else if (value === false) { this.value = value; document.body.setAttribute('class', 'offline'); window.dispatchEvent(new Event('aya-offline')); $('aya.isOnline : now offline');}
      else if (value === 'wtf') { this.value = value; document.body.setAttribute('class', 'wtfline'); window.dispatchEvent(new Event('aya-wtfline')); $('aya.isOnline : now wtfline');}
    },
    get:function () { return this.value; }
  });

  /** 用来设置三个联网状态的对应三个函数 */
  this.setOnline  = (function () { this.isOnline = true ; }).bind(this);
  this.setWTFline = (function () { this.isOnline = 'wtf'; }).bind(this);
  this.setOffline = (function () { this.isOnline = false; }).bind(this);

  this.onLoginFinish = (function () {
    this.setWTFline();
    setTimeout(function () {detectOnlineStatus();}, 2100);
    setTimeout(function () {detectOnlineStatus();}, 5500);
  }).bind(this);

  this.onLogoutFinish = (function () {
    this.setWTFline();
    setTimeout(function () {detectOnlineStatus();}, 2100);
    setTimeout(function () {detectOnlineStatus();}, 5500);
  }).bind(this);

  /**
   * 创建具有多个选项的对话框
   * @param promot 对话框内容
   * @param actions 对话框按钮列表，存放了按钮的标题和操作，形如[ {"title":String,"action":Function},...]
   * @param overlayAction 可选，点击对话框外区域的操作，默认为关闭对话框
   */
  this.dialog = function (promot, actions, overlayAction) {
    function closeDialog() {
      elDia.setAttribute('class','') ;
      elDiaOverlay.setAttribute('class','');
      setTimeout(function () {elDiaOverlay.remove(); elDia.remove();}, 200);
    }

    var elDiaOverlay = document.createElement('div');
    elDiaOverlay.setAttribute('id','ayaya-dialog-overlay');
    elDiaOverlay.addEventListener('click',(!!overlayAction ? overlayAction : function () {}));
    elDiaOverlay.addEventListener('click',closeDialog);

    var elDia = document.createElement('div');
    elDia.setAttribute('id','ayaya-dialog');

    var elPromot = document.createElement('p');
    elPromot.textContent = promot;
    elDia.appendChild(elPromot);

    var elButtonsWrap = document.createElement('div');
    elDia.appendChild(elButtonsWrap);

    for (var i = 0;i < actions.length;i++) {
      var elBut = document.createElement('input');
      console.log(actions[i]);
      elBut.setAttribute('type', 'button');
      elBut.setAttribute('value', actions[i].title);
      elBut.addEventListener('click',actions[i].action);
      elBut.addEventListener('click',closeDialog);
      elButtonsWrap.appendChild(elBut);
    }

    document.body.appendChild(elDiaOverlay);
    document.body.appendChild(elDia);
    setTimeout(function () { elDiaOverlay.setAttribute('class','active'); elDia.setAttribute('class','active'); },200);
  };

  /**
   * 确认函数
   * 如果只有一个参数，直接调用 window.confirm
   * 否则调用 aya.dialog
   * @param promot 提示信息内容
   * @param actions 存放操作的数组，形如[ {"title":String,"action":Function},...]
   */
  this.confirm = (function (promot,actions) {
    if (arguments.lentgh === 1) {
      return confirm(promot);
    }
    else {
      this.dialog(promot, actions);
    }
  }).bind(this);

  /**
   * 提示信息函数
   * 显示一个包含提示信息，只有一个按钮的对话框。
   * @param promot 提示信息内容
   * @param actionFunc 可选，按钮操作，默认为无操作
   * @param actionTitle 可选，按钮标题，默认为 OK
   */
  this.alert = (function (promot, actionFunc, actionTitle) {
    var act = {
      'title':  (!!actionTitle) ? actionTitle : 'OK',
      'action': (!!actionFunc) ? actionFunc : function () {}
    };
    this.dialog(promot, [act], actionFunc);
  }).bind(this);

  /** 神奇的 $ */
  function $ (i) {console.log(i);}

  /** 来吧，全新的登录界面_(:з」∠)_ */
  function brandNewBody () {
    console.log('=>theming body');
    clearOut();
    fillBody();
  }

  /** 清空整个页面 */
  function clearOut () {
    /** 清空页面 */
    console.log('=>deleting body content');
    document.body.innerHTML = "";
    /** 删除原有的样式表 */
    console.log('=>deleting body style');
    Array.prototype.filter.call(document.querySelectorAll('style,link[rel="stylesheet"],stylesheet,link[type="text/css"]'),function (el,idx,arr) {el.remove();});
  }

  /** 用主题填充页面 */
  function fillBody () {
    var frag = document.createDocumentFragment();
    
    (function (ww) {
      ww.innerHTML = theme.bodyHTML;
      Array.prototype.filter.call(ww.childNodes,function (el) { frag.appendChild(el); });
    })(document.createElement("ww"));
    
    var theme_css = frag.appendChild(document.createElement('style'));
    theme_css.setAttribute('type','text/css');
    theme_css.textContent = theme.CSS;

    var theme_js = frag.appendChild(document.createElement('script'));
    theme_js.setAttribute('type','application/javascript');
    theme_js.textContent = theme.Javascript;

    document.body.appendChild(frag);
  }

  /** 自动登录 */
  function autoLogin() {
    if ((id.username !== 'imbakabakabaka') && (id.username !== '')) {
      console.log('aoto login...');
      document.form1.uname.value = id.username;
      document.form1.pass.value = id.password;
      window.do_login();
    }
    else if ( (preserveId.uname!== '') && (preserveId.pass !== '') ) {
      document.form1.uname.value = preserveId.uname;
      document.form1.pass.value = preserveId.pass;
    }
  }

  /**
   * 检测是否已经连上外网
   * 检测：调用 aya.setWTFline()
   * 连上：调用 aya.setOnline()
   * 断网：调用 aya.setOffline()
   * 连续执行最小间隔：3000 ms
   */
  function detectOnlineStatus() {
    $("detectOnlineStatus() : into");
    if ( aya.isOnline === true) { return; }
    else { aya.setWTFline(); }
    var magi = document.createElement('script');
    magi.setAttribute('type', 'application/javascript');
    magi.setAttribute('src', 'http://cdnjscn.b0.upaiyun.com/libs/hogan.js/3.0.0/hogan.min.js'+'?'+performance.now()+performance.now()+performance.now());
    window.document.body.appendChild(magi);
    var checker = setInterval(function () {
      if ((!!window.Hogan) && (aya.isOnline !== true)) { clearInterval(checker);aya.setOnline(); }
      else { $('detectOnlineStatus() : suck'); }
    }, 100);
    setTimeout(function () {
      clearInterval(checker);
      magi.remove();
      window.Hogan = false;
      if (aya.isOnline !== true){
        aya.setOffline();
      }
    } ,3000);  //3s to determine network status
  }

  /**
   * 直接注销
   * 真正的注销操作
   */
  function doLogout(){
    $('doLogout() : into');
    var uname=document.form1.uname.value;
    var pass=document.form1.pass.value;
    var con="";
    if(uname === "") {
      con=postData("/cgi-bin/do_logout", "get", "");
    } else {
      var drop=(document.form1.drop.checked===true)?1:0;
      var data="username="+window.trim(uname)+"&password="+pass+"&drop="+drop+"&type=1&n=1";
      con=postData("/cgi-bin/force_logout", "post", data);
    }
    //alert(con);
    switch(con) {
      case "user_tab_error":
        aya.alert("认证程序未启动");
        break;

      case "username_error":
        aya.alert("用户名错误", function () { document.form1.uname.focus(); });
        break;

      case "password_error":
        aya.alert("密码错误", function () { document.form1.pass.focus(); });
        break;

      case "logout_ok":
        aya.alert("注销成功，请等1分钟后登录。", function () { aya.onLogoutFinish(); });
        break;

      case "logout_error":
        aya.alert("您不在线上");
        break;

      default:
        aya.alert(con);
        break;
    }
  }

  /**
   * 覆盖原来的登录,注销
   * 登录操作完成之后调用 aya.onLoginFinish()
   * 注销操作完成之后调用 aya.onLogoutFinish()
   */
  function overwriteFunctions () {
    window.do_login = function  () {
      var uname=document.form1.uname.value;
      var pass=document.form1.pass.value;
      if(uname === '请输入用户名' || uname === '用户名') {
        uname = '';
      }
      if(pass === '请输入密码' || pass === '密码') {
        pass = '';
      }
      if(uname==="") {
        aya.alert("请填写用户名", function () { document.form1.uname.focus(); });
        return;
      }
      if(pass==="") {
        aya.alert("请填写密码", function () { document.form1.pass.focus(); });
        return;
      }
      //密码md5加密传送
      var pass1=hex_md5(pass);
      var pass2=pass1.substr(8,16);

      var drop = (document.form1.drop.value == 1) ? 1 : 0;
      var data="username="+window.trim(uname)+"&password="+pass2+"&drop="+drop+"&type=1&n=100";

      var con=postData("/cgi-bin/do_login", "post", data);
      //alert(con);
      var p=/^[\d]+$/;
      if(p.test(con)) {
        document.form1.uid.value=con;
        if(document.form1.save_me.checked) {//写COOKIE
          setCookie("srun_login",uname+"|"+pass);
        }
        else {
          delCookie("srun_login");
        }
        $('fin login');
        aya.onLoginFinish();
        return;
      }
      var info = login_info(con);
      if(info !== '') {
        aya.alert(info);
      } else {
        aya.alert("找不到认证服务器");
      }
    };

    window.force_logout = function () {
      var uname=document.form1.uname.value;
      var pass=document.form1.pass.value;
      if(uname === '请输入用户名') {
        uname = '';
      }
      if(pass === '请输入密码') {
      pass = '';
      }
      if(uname && pass) {
        aya.confirm(
          "如果您的用户名有多个用户在线上，这些用户都将被强制下线，是否继续？",
          [
          { title:"是",
            action:function () { doLogout(); }
          },
          {
            title:"取消",
            action:function(){}
          }
          ]
        );
      }
    };
    
    // Portal functions
    //srun portal login
    Object.defineProperty(window,'do_chk',{
      configurable:false,
      enumerable:true,
      writable:false,
      value:function (frm) {
        if(frm.uname.value==="")
        {
          alert("请填写您的帐号");
          frm.uname.focus();
          return false;
        }
        
        if(frm.pass.value==="")
        {
          alert("请填写您的密码");
          frm.pass.focus();
          return false;
        }
        delCookie("srun_login");
        if(frm.save_me.checked) //写COOKIE
        {
          setCookie("srun_login",frm.uname.value+"|"+frm.pass.value+"|"+frm.user_ip.value+"|"+frm.mac.value+"|"+frm.nas_ip.value+"|"+frm.ac_id.value);
        }
        else
        {
          setCookie("srun_login",frm.uname.value+"||"+frm.user_ip.value+"|"+frm.mac.value+"|"+frm.nas_ip.value+"|"+frm.ac_id.value);
        }
        
        var d = "action=login&username="+trim(frm.uname.value)+"&password="+frm.pass.value+"&ac_id="+frm.ac_id.value+"&type=1&wbaredirect="+frm.wbaredirect.value+"&mac="+frm.mac.value+"&user_ip="+frm.user_ip.value;
        
        var res = postData("/cgi-bin/srun_portal","post", d);
        
        var p = /help.html/;
        var p1 = /login_ok/;
        if(p.test(res) || p1.test(res))
        {
          aya.setOnline();
        }
        else
        {
          aya.setOffline();
          aya.alert(res);
        }
        
        return false;
      }
    });
  }
  
  /**
   * 跳转到重定向之前的页面 
   * 支持 http(s) 协议的链接
   */
  function ayaJump () {
    if (original_location) window.location = original_location;
  }


  /**
   * 魔法开始～～
   */
  window.Hogan = false;  /**< 用来检测联网状态的对象 */
  var bulletinHTML = ''; /**< 通知公告内容 */
  var maska;             /**< 隐藏整个页面 */  
  
  window.addEventListener('aya-online', ayaJump);
  window.addEventListener('load', function (e) {
    document.head.innerHTML+='<style id="maska" type=text/css>body{visibility: hidden !important;background: none !important;}</style>';
  });
  window.addEventListener('load',function (e) {
    maska = document.getElementById('maska');
    /** 获取页面自动保存的用户名和密码 */
    preserveId.uname = document.form1.uname.value;
    preserveId.pass = document.form1.pass.value;
    
    console.log('setting wtf line');
    aya.setWTFline();     /**< 设置链接状态未知 */
    
    console.log('new body');
    brandNewBody();
    
    console.log('overiting functions');
    overwriteFunctions();
    
    console.log('detect online status');
    detectOnlineStatus();
    
    console.log('auto logging');
    autoLogin();
    
    /** 如果是跳转到登录页面的，就持续检测联网状态，连上网之后就跳转回去 */
    if (original_location) { setInterval(function () {detectOnlineStatus();}, 3100); }
  });
}();
