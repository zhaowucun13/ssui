ss.set(['code'],function(out){
	ss.code({
		el:ss.getDom('#ss_use_first'),
		id:'ss_use_first',
		title:'下载项目 --> GitHub',
		explain:'项目各文件路径的介绍，帮助你更好地了解ssui',
		renderOut:function(ins){
			var titleDom = ins.sourceObj.el.querySelector('.title_slogin');
			titleDom.innerHTML = '';
			ss.crtDom('p','','下载项目 --> ',titleDom).appendDom(function(dom){
				ss.crtDom('span','','GitHub',dom,{
					cn:['textDecoration','cursor','color'],
					cv:['underline','pointer','rgb(26, 173, 22)']
				},[
					'click',function(){
						window.location.href = 'https://github.com/zhaowucun13/ssui#';
					}
				])
			})
		}
	})
})