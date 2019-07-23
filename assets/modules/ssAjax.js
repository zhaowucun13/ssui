/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(['c3Loading'],function(out){
    function ss_ajax(obj){
        this.sourceObj = obj;
        this.domWrap = {};//dom容器
        this.scope={};//scope参数容器
        this.init();//初始化
    };
    ss_ajax.fn = function(){
    	
    };
    ss_ajax.prototype = {
        constructor:ss_ajax,
        init:function(){
            var self = this,obj = self.sourceObj;
        },
        ajax:function(obj,success,complete,beforeSend){
            var tempObj = obj;
            tempObj.success = function(data){
                if(data.result == 'success'){
                    success(data);
                }
                else{
                    data['data'] && ss.layer.msg(data['data']);
                    data['errorMsg'] && ss.layer.msg(data['errorMsg']);
                    !data['data'] && !data['errorMsg'] && ss.layer.msg('接口有误！');
                }
            };
            tempObj.beforeSend = function(request) {
                ss.c3Loading.show();
                beforeSend && beforeSend(request);
            };
            tempObj.complete = function(xhr){
                ss.c3Loading.hidden();
                complete && complete();
                xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
                //登陆时效性，接口约定：重定向->index.html
                xhr.responseText.indexOf('lg_login_pw_label')!=-1 &&
                layer.confirm('登陆已失效，请重新登陆！', function(index){
                    location.href='index.html';
                });
            }
            $.ajax(tempObj);
        },
        eAjax:function(qObj,oObj){
            var self = this,obj = self.sourceObj;
            oObj['isJson'] && (qObj['data'] = JSON.stringify(qObj['data']));//json方式传输赋值
            oObj['isJson'] && (qObj['dataType']='json');//dataType值为json
            //获得数据
            self.ajax(
                qObj
                ,
                //success
                function(data){
                    oObj['success'] && oObj['success'](data);
                },
                //complete
                function(){
                    oObj['complete'] && oObj['complete']();
                },
                //beforeSend
                function(request){
                    oObj['isJson'] &&
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                    oObj['beforeSend'] && oObj['beforeSend'](request);
                }
            );
        }
    }
    out('ajax',function(obj){
        return new ss_ajax(obj);
    });
})
