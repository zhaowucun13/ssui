/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out){
    function Router(obj) {
        this.sourceObj = obj;
        //是否启动默认值
        this.isStartDefautlVal = false;
        this.getHash();
        this.open();
    }
    Router.prototype = {
        constructor:Router,
        open:function () {
            var self = this, obj = self.sourceObj;
            //hash值变化->装载
            window.addEventListener('hashchange', function () {
                self.togoHash()
            });
            self.isStartDefautlVal ? (window.location.href = '#/'+self.getHash()) : self.togoHash();
        },
        //路由跳转
        togoHash:function () {
            var self = this,obj = self.sourceObj;
            var curHash = self.getHash(); //当前hash值
            var loadSrc = '../view/'+curHash+'/'+curHash;//相对ss.js的文件路径
            var curHtmlUrl = ss.getPath(loadSrc+'.html');//当前html地址
            self.ajaxHtmlFn(curHtmlUrl, function (htmlTxt) {
                //记载html文本，赋值dom元素
                var viewDom = obj.viewWrap ? (ss.getDom(obj.viewWrap)) : (ss.getDom('#ss_view'));
                viewDom.innerHTML = htmlTxt;
                //装载js
                var curJsUrl = ss.getPath(loadSrc+'.js');//当前路由的js地址
                ss.loadMd({
                    url:curJsUrl,
                    mdname:''
                })
            })
        },
        //获取当前hash值
        getHash:function () {
            var self = this,obj = self.sourceObj;
            var hashStr = window.location.hash;
            if(!obj.defaultHash){
                ss.error('请设置路由默认值');
                return;
            };
            hashStr || (self.isStartDefautlVal=true);
            return hashStr?hashStr.slice(2):obj.defaultHash;
        },
        //加载html
        ajaxHtmlFn:function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                xhr.status == 200 && xhr.readyState == 4 && callback(xhr.responseText);
            }
        }
    }
    out('router', function(obj){
        return new Router(obj)
    });
})



