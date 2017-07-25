ss.set(['code','api','dtPage'],function(out){

	ss.code({
		el:ss.getDom('#ss_dtPage_example'),
		id:'dtPage',
		title:'基本代码',
		explain:'配合表格使用，用于分页',
		example:function(dom){
			dom.style.height = '70px';
			ss.dtPage.render({
				el: dom,
				page: 10,
				totalPage: 13
			}); 

		}
	})

	ss.api({
		el:ss.getDom('#ss_dtPage_api'),
		list:[
			{attr:'el',explain:'分页挂载的dom元素',type:'dom对象',defaultVal:'无，必填'},
			{attr:'page',explain:'当前页数',type:'Number数字',defaultVal:'无，必填'},
			{attr:'totalPage',explain:'总页数，一般由接口返回',type:'Number数字',defaultVal:'无，必填'},
		],
		title:'API',
		explain:'Loading为自身模块，通过简单的方法调用，便可显示加载动画'
	})

	
})