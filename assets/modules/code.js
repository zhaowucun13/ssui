/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(['ajax'],function(out){
    //工具
    var _tool = {
        //转换<code></code>格式的文本
        transTplTxt: function(str){
            var _tplObj = {};
            (str||'').split('</code>').forEach(function(item){
                if(item.trim()){
                    var _reg = /<code\s*\S*id="(\S*)"\S*>/;
                    _reg.exec(item) && (
                        _tplObj[_reg.exec(item)['1']] = item.replace(_reg,'').replace(/(^\s*)/,"")
                    )
                }
            });
            return _tplObj
        },
        //获取对应文本
        getTxt: function(cbFn){
            //当前hash值
            var curHash = location.hash.slice(2);
            ss.ajax({
                url:ss.getPath('../view/'+curHash+'/'+curHash+'.txt'),
                success:function(res){
                    cbFn && cbFn(_tool.transTplTxt(res))
                }
            })
        }
    };
    function Code(obj) {
        this.sourceObj = obj;
        this.init();
    }
    Code.prototype = {
        constructor:Code,
        init: function(){
            var self = this, obj = self.sourceObj;
            _tool.getTxt(function(tplObj){
                self.render(tplObj);
            })
        },
        //dom渲染
        render: function(tplObj){
            var self = this, obj = self.sourceObj;
            ss.crtDom('div','','',obj.el,{
                cn:['width'],
                cv:['95%']
            })
            .appendDom(function(dom){
                //案例展示
                if(obj.example){
                    ss.crtDom('div','','',dom,{
                        cn:['border','borderBottom','padding'],
                        cv:['1px solid #ccc','none','15px 15px']
                    }).appendDom(function(dom){
                        //案例标题
                        ss.crtDom('p','','案例',dom,{
                            cn:['backgroundColor','display','borderLeft','padding','marginBottom'],
                            cv:['#fff','inline-block','2px solid #ccc','2px 10px','10px']
                        })
                        //案例内容
                        ss.crtDom('div','exampleWrap','',dom,{
                            cn:['position','overflowY'],
                            cv:['relative','auto']
                        }).appendDom(function(dom){
                            obj.example(dom)
                        })
                    })
                }
                //描述
                ss.crtDom('div','','',dom,{
                    cn:['height','border','backgroundColor','padding','color','fontSize'],
                    cv:['auto','1px solid #d1d5da','#fafafa','15px','#314659','14px']
                }).appendDom(function(dom){
                    //标题
                    ss.crtDom('p','title_slogin',obj.title||'标题',dom,{
                        cn:['backgroundColor','display','borderLeft','padding'],
                        cv:['#fff','inline-block','2px solid #ccc','2px 10px']
                    })
                    //描述
                    ss.crtDom('p','',obj.explain||'描述',dom,{
                        cn:['marginTop','fontSize'],
                        cv:['10px','14px']
                    })
                })
                //pre代码内容
                ss.crtDom('div','','',dom,{
                    cn:['border','borderTop','padding'],
                    cv:['1px solid #d1d5da','none','6px 0px']
                })
                .appendDom(function(dom){
                    var preDom = ss.crtDom('pre','pre',tplObj[obj.id],dom,{
                        cn:['fontSize','position','paddingLeft','fontFamily','color','margin'],
                        cv:['16px','relative','50px','unset','#24292e','0px']
                    })
                    ss.crtDom('ul','','',preDom,{
                        cn:['position','top','left','fontFamily','color','fontSize'],
                        cv:['absolute','0px','15px','unset','rgba(27,31,35,.3)','14px']
                    })
                    .appendDom(function(dom){
                        for(var i=0; i<Math.floor((preDom.offsetHeight/21)); i++ ){
                            ss.crtDom('li','',i+1,dom,{
                                cn:['height','lineHeight'],
                                cv:['21px','21px']
                            })
                        }
                    })
                })
            });
            //渲染完毕回调
            obj.renderOut && obj.renderOut(self);
        }
    }
    out('code', function(obj){
        return new Code(obj)
    });
})



