(function(win){
    var Play = {};

    Play.imgsLoad = function (arcList,callback) {
        var imgsObj = {};
        var length  = arcList.length;
        var count = 0;

        arcList.forEach(function(src){

           var imgObj = new Image();
           imgObj.src = "../images/"+src+".png";
           imgsObj[src] = imgObj;

           imgObj.onload = function(){
               count++;
               if(count>=length){
                   callback(imgsObj);
               }
           };
        });
        
    };




    win.Play = Play;
})(window);