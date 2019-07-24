ss.set(['code','api','menu'],function(out){

	var menuData_cur = {
		heeler: [
			{
				leader: '账户管理',
				isFirst: true,
				mn_code: 'mn_account_manageer',
				heeler: [
					{
						leader: '用户列表',
						txt: 'account_info',
						sourceCode: '_mu_accountInfo',
						heeler: []
					},
					{
						leader: '客户列表',
						txt: 'cus_info',
						sourceCode: '_mu_cusinfo',
						heeler: []
					},
					{
						leader: '角色管理',
						txt: 'role_manager',
						sourceCode: '_mu_roleManager',
						heeler: []
					}
				]
			},
			{
				leader: '供应商管理',
				isFirst: true,
				mn_code: 'mn_supplier_manageer',
				heeler: [{
					leader: '供应商管理',
					txt: 'sup_info',
					sourceCode: '_mu_supinfo',
					heeler: []
				}]
			},
			{
				leader: '卡片管理',
				isFirst: true,
				mn_code: 'mn_card_manageer',
				heeler: [
					{
						leader: '流量卡管理',
						txt: 'm2mCard',
						sourceCode: '_mu_m2mCard_flow_info',
						heeler: []
					},
					{
						leader: '语音卡管理',
						txt: 'm2mCard_voice_info',
						sourceCode: '_mu_m2mCard_voice_info',
						heeler: []
					}
				]
			}
		]
	}


	ss.code({
		el:ss.getDom('#ss_lmenu_example'),
		id:'menu',
		title:'基本代码',
		explain:'项目依赖的菜单模块',
		example:function(dom){
			dom.style.width = '200px';
			dom.style.height = '300px';
			//菜单
			ss.menu({
				el: dom,
				name: 'ssui管理平台', //系统名字
				sourceData: menuData_cur, //资源数据
			});
		}
	})

	ss.api({
		el:ss.getDom('#ss_menu_api'),
		list:[
			{attr:'el',explain:'菜单追加到的dom上面',type:'dom对象',defaultVal:'document.body'},
			{attr:'name',explain:'系统的名字',type:'String字符串',defaultVal:'ssui管理系统'},
			{attr:'sourceData',explain:'菜单依赖的数据，遵循一定的规格',type:'Array数组',defaultVal:'无，必填'},
		],
		title:'API',
		explain:'Menu为项目依赖模块，配合路由模块一起构建项目'
	})

	
})