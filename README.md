<p align=center style="background-color: #fff;">
  <a href="#">
    <img src="https://raw.githubusercontent.com/zhaowucun13/ssui/master/assets/images/gh_ssui_logo.jpg" alt="layui" width="360">
  </a>
</p>

## 

* 本着降低开发门槛的目的，我尝试了摒弃各种前端工具，甚至是HTML、CSS的编写

* 对项目的js文件进行模块化管理，特别是内置的layout布局/munu菜单/router路由等模块，可以快速生成基础SPA项目

* 可以说，她是为服务端开发人员量身定做，只需专注于JS的配置，从而达到由数据去驱动渲染，让你的页面更加信手捏来

<div style="margin-top:50px;"></div>



<img src="https://raw.githubusercontent.com/zhaowucun13/ssui/master/assets/images/gh_ssui_logo.jpg" alt="layui" width="30">查看文档 --> [传送门](http://47.107.154.57) 

1、项目预览

* 项目各文件路径的介绍，帮助你更好地了解ssui


```

  ├─css  //css目录
  ├─images  //图片资源目录（包括ico等文件）
  ├─incoming  //第三方资源引入目录
  ├─modules  //ssui依赖的组件库（包括主文件ssui.js）
  │  ├─ajax
  │  ├─api
  │  ├─code
  │  ├─layout
  │  ├─router
  │  └─ssui.js
  ├─private  //项目私有文件
  │  ├─menuData.js //依赖菜单
  │  └─app.js //项目启动配置入口
  ├─view  //项目各页面
  │  └─code //强制：命名与hash值一致
  │     ├─code.hmtl //路由跳转，默认加载
  │     ├─code.js //路由跳转，默认加载
  │     └─code.txt //配合code模块使用默认命名
  └─index.html  //文件主html
  
```

<div style="margin-top:30px;"></div>

2、模块相关 

* 与CMD规范的模块体系类似，ssui里面的每个js都要以模块的方式存在，通过简单的set|out方法来定义与抛出，然后在app.js中配置路径

* 注：view的各页面默认配置路径，无需在app.js中配置

* 注：第三方库也需配置：如jq： incoming: { jquery: '../incoming/jquery-3.3.1.min.js' }

<p style="background:#eee;padding:10px;padding-left:25px;">定义模块</p>

```
代码演示：通过ss.set的方法快速定义一个模块，若要依赖其它模块，则在第一个参数以数组的形式引入

ss.set(['code'],function(out){
  
  var module = {};

  out('module',module) // 抛出一个名为module的模块

})
  
```
<p style="background:#eee;padding:10px;padding-left:25px;">配置模块</p>

```
代码演示：在app.js中配置路径后，便可在项目中任意引用，路径以ssui.js文件为相对路径配置

ss.config({
	private: {
		'menuData': '../private/menuData.js',//定义的menuData模块
		'ssuiLayout': '../private/ssuiLayout.js',//定义的ssuiLayout模块
	}
});
  
```


<div style="margin-top:30px;"></div>

3、核心方法

<p style="background:#eee;padding:10px;padding-left:25px;">创建dom元素</p>

```

  ss.crtDom(
    '',  //类型（div、span、...）
    '',  //class类名
    '',  //文本
    dom,  //追加到的父级dom
    // 样式和属性
    {
      cn:[],  //样式名称
      cv:[],  //样式值
      an:[],  //属性名称
      av:[]   //属性值
    },
    //  绑定的事件
    [
      'click',function(dom, e){
        //  dom: 当前创建的dom对象
        //  e  : 事件对象 
        code...  
      }
    ]
  )
  
```







