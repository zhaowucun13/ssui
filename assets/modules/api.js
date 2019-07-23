/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out){
    function Api(obj) {
        this.sourceObj = obj;
        this.init();
    }
    Api.prototype = {
        constructor:Api,
        init: function(){
            var self = this, obj = self.sourceObj;
            self.render();
        },
        //dom渲染
        render: function(){
            var self = this, obj = self.sourceObj;
            ss.crtDom('div','','',obj.el,{
                cn:['width'],
                cv:['95%']
            })
            .appendDom(function(dom){
                //案例展示
                if(obj.example){
                    ss.crtDom('div','','',dom,{
                        cn:['height','border','borderBottom'],
                        cv:['100px','1px solid #ccc','none']
                    })
                }
                //描述
                ss.crtDom('div','','',dom,{
                    cn:['height','border','backgroundColor','padding','color','fontSize'],
                    cv:['auto','1px solid #d1d5da','#fafafa','15px','#314659','14px']
                }).appendDom(function(dom){
                    //标题
                    ss.crtDom('p','',obj.title||'',dom,{
                        cn:['backgroundColor','display','borderLeft','padding'],
                        cv:['#fff','inline-block','2px solid #ccc','2px 10px']
                    })
                    //描述
                    ss.crtDom('p','',obj.explain||'',dom,{
                        cn:['marginTop','fontSize'],
                        cv:['10px','14px']
                    })
                })
                //列表内容
                ss.crtDom('div','','',dom,{
                    cn:['border','borderTop','padding'],
                    cv:['1px solid #d1d5da','none','6px 0px']
                })
                .appendDom(function(dom){
                    self.renderList(dom)
                })
            })
        },
        //api简单的列表展示
        renderList: function(dom){
            var self = this, obj = self.sourceObj;
            //无配置数据
            if(!obj.list){
                ss.crtDom('p','','请提供list属性数据',dom,{
                    cn:['color','padding'],
                    cv:['rgb(49, 70, 89)','10px 15px']
                });
                return
            };
            var widthArr = ['15%','50%','20%','15%'];
            var _colorArr = ['#003a8c','#314659','#c41d7f','#314659'];
            var _attrArr = ['attr','explain','type','defaultVal'];
            //配置数据
            ss.crtDom('div','','',dom,{
                cn:['padding'],
                cv:['15px']
            }).appendDom(function(dom){
                //标题
                ss.crtDom('ul','','',dom,{
                    cn:['padding','backgroundColor'],
                    cv:['10px','#efefef']
                }).appendDom(function(dom){
                    ['属性','说明','类型','默认值'].forEach(function(item,index){
                        ss.crtDom('li','',item,dom,{
                            cn:['display','verticalAlign','width','color','fontSize'],
                            cv:['inline-block','top',widthArr[index],'#5c6b77','14px']
                        })
                    })
                });
                //各项内容
                (obj.list || []).forEach(function(item,index1){
                    ss.crtDom('ul','','',dom,{
                        cn:['padding','borderBottom'],
                        cv:['15px 10px','1px solid #efefef']
                    }).appendDom(function(dom){
                        _attrArr.forEach(function(item2,index2){
                            ss.crtDom('li','',item[item2],dom,{
                                cn:['display','verticalAlign','width','color','fontSize'],
                                cv:['inline-block','top',widthArr[index2],_colorArr[index2],'14px']
                            })
                        })
                    });

                })

            })

        }
    }



    out('api', function(obj){
        return new Api(obj)
    });
})



