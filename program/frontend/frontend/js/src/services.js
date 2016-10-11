/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-23
 * Time: 下午3:38
 * To change this template use File | Settings | File Templates.
 */
var services=angular.module("services",["ngResource","toaster"]);

/* *
 * constant类型的service中的值不会被改变，value定义的service中的值可以被改变
 */
services.constant("Config",{
    perLoadCount:{
        list:10
    },
    imageSuffix:{
        smallPreview:"-300x200"
    },
    distance:50000,
    hasNoMoreFlag:-1,//作品、评论、资源等没有更多的标志,当没有更多的时候将其的loadId设置为-1
    tabNames:{
        list:"list",
        map:"map"
    },
    scrollType:{
        post:"post",
        town:"town"
    },
    viewUrls:{
        "postList":"views/postList.html",
        "postDetail":"views/postDetail.html"
    },
    messages:{  //错误提示
        errorTitle:"错误提示",
        successTitle:"成功提示",
        keywordNoResult:"搜索该地点无数据！",
        networkError:"网络连接失败，请稍后重试！",
        systemError:"系统发生错误，请稍后重试！"
    },
    ajaxUrls:{
        baseUrl:"http://121.40.16.252/asset_hub/",
        getAllPosts:"artifacts/search",
        getAllMaterials:"tags/material_tags",
        getAllCategories:"tags/theme_tags",
        getPost:"artifacts/:postId"
    }
});
services.constant("App",{
    version:"1.0"
});
services.service("AjaxErrorHandler",["toaster","Config",function(toaster,Config){
    this.ajaxReturnErrorHandler=function(errorCode){
        var message="";
        switch(errorCode){

            case "UNEXPECTED_ERROR":
                message=Config.messages.systemError;
                break;
            default :
                message=Config.messages.loadDataError;
                break;
        }
        toaster.pop('error',Config.messages.errorTitle,message,null,null);
    };

    this.ajaxErrorHandler=function(){
        toaster.pop('error',Config.messages.errorTitle,Config.messages.networkError,null,null);
    };
}]);

services.service("CFunctions",["$rootScope",
    function($rootScope){
        this.getFileInfo=function(fileName){
            var extPos=fileName.lastIndexOf(".");
            var pathPost=fileName.lastIndexOf("/");
            return {
                filePath:pathPost!=-1?fileName.substring(0,pathPost+1):"",
                filename:fileName.substring(pathPost+1,extPos),
                ext:fileName.substring(extPos+1)
            }
        };
        this.arrayIndexOf=function(array,content,key){
            for(var i= 0,len=array.length;i<len;i++){
                if(key){
                    if(array[i][key]==content){
                        return i;
                    }
                }else{
                    if(array[i]==content){
                        return i;
                    }
                }

            }

            return -1;
        }


    }]);


services.service("Storage",function(){
    this.lastLoadedCount=0;
    this.currentPostId=0;
    this.oldBodyScrollTop=0;
    this.scrollTimer=null;
});

services.factory('safeApply', ["$rootScope",function($rootScope) {
    return function(scope, fn) {
        fn = angular.isFunction(fn) ? fn : angular.noop;
        scope = scope && scope.$apply ? scope : $rootScope;
        fn();
        if (!scope.$$phase) {
            scope.$apply();
        }
    }
}]);


