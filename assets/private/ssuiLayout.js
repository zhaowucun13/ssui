ss.set(['svg'],function(out){

    var ssuiLayout = {
        //整体渲染
        render: function(){
            var self = this;
            ss.crtDom('div','','',window.document.body,{
                cn:['position','height','width'],
                cv:['relative','100%','100%']
            }).appendDom(function(dom){
                //header头部
                ss.crtDom('div','header','',dom,{
                    cn:['padding','position','height','backgroundColor','zIndex','boxShadow'],
                    cv:['0px 20px','relative','60px','#fff',10,'0 1px 2px rgba(150,150,150,.3)']
                }).appendDom(function(dom){
                    self.renderHeader(dom)
                });
                //头部下面内容
                ss.crtDom('div','','',dom,{
                    cn:['position','paddingLeft','height'],
                    cv:['relative','330px','calc(100% - 60px)']
                }).appendDom(function(dom){
                    //左侧菜单
                    ss.crtDom('div','','',dom,{
                        cn:['width','height','overflowY','position','top','left','borderRight'],
                        cv:['300px','100%','auto','absolute','0px','0px','1px solid #ccc'],
                        an:['id'],av:['ly_aside']
                    });
                    //右侧内容
                    ss.crtDom('div','','',dom,{
                        cn:['height','overflowY'],
                        cv:['100%','auto'],
                        an:['id'],av:['view']
                    }).appendDom(function(dom){
                        ss.crtDom('div','','',dom,{
                            an:['id'],av:['ss_view']
                        })
                    });
                })

            })
        },
        // 头部渲染
        renderHeader: function(dom){
            //左logo图片
            ss.crtDom('div','','',dom,{
                cn:['display','verticalAlign','width','textAlign','height','lineHeight'],
                cv:['inline-block','top','50%','left','100%','60px']
            }).appendDom(function(dom){
                ss.crtDom('img','','',dom,{
                    cn:['width'],cv:['50px'],
                    an:['src'],av:['./assets/images/logo.png']
                })
            });
            //右github图标
            ss.crtDom('div','','',dom,{
                cn:['display','verticalAlign','width','textAlign','height','lineHeight'],
                cv:['inline-block','top','50%','right','100%','60px']
            }).appendDom(function(dom){
                ss.crtDom('a','',ss.svg.github(32),dom,{
                    cn:['display','width','height','position','verticalAlign','marginBottom'],
                    cv:['inline-block','32px','32px','relative','middle','3px'],
                    an:['target','href'],
                    av:['_blank','https://github.com/zhaowucun13/ssui#']
                })


            });
        }
    };

    out('ssuiLayout',ssuiLayout);
})

