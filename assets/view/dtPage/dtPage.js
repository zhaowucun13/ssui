ss.set(['code','api','dtPage'],function(out){

	ss.code({
		el:ss.getDom('#ss_loading_example'),
		id:'loading',
		title:'基本代码',
		explain:'缓冲动画loading，一般配合请求接口使用',
		example:function(dom){
			dom.style.height = '300px';
			

		}
	})

	ss.api({
		el:ss.getDom('#ss_loading_api'),
		list:[
			{attr:'show',explain:'显示loading动画',type:'-',defaultVal:'-'},
			{attr:'close',explain:'关闭loading动画',type:'-',defaultVal:'-'},
			{attr:'el',explain:'动画的上下文',type:'dom对象',defaultVal:'document.body'},
		],
		title:'API',
		explain:'Loading为自身模块，通过简单的方法调用，便可显示加载动画'
	})

	
})