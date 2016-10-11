/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午4:12
 * To change this template use File | Settings | File Templates.
 */
var app=angular.module("app",["services","controllers","directives","models"]);

app.config(["$locationProvider","$httpProvider","App",
    function($locationProvider,$httpProvider,App){

        //禁止ajax的缓存,高版本才可以用
        //$httpProvider.defaults.cache=false;

        //ajax的一些默认配置，全局启用loading
        $httpProvider.defaults.transformRequest.push(function (data) {
            App.showLoading();

            return data;
        });

        $httpProvider.defaults.transformResponse.push(function (data) {
            App.hideLoading();

            return data;
        });

        //对返回的数据进行拦截，直接全局处理出错信息
        $httpProvider.interceptors.push(function ($q) {
            return {
                request:function(config){

                    //消除服务端缓存的影响
                    if(config.method=='GET'&&config.url.indexOf("views")==-1){
                        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                        config.url = config.url+separator+'noCache=' + new Date().getTime();
                    }

                    return config||$q.reject(config);
                },
                response: function (res) {
                    //console.log(res);
                    if(typeof res.data.success!="undefined"&&res.data.success==false){
                        App.ajaxReturnErrorHandler(res.data);
                        return $q.reject(res.data);
                    }else{
                        return res;
                    }
                },
                responseError: function (res) {
                    App.ajaxErrorHandler();
                    return $q.reject(res);
                }
            };
        });

    }]);

//在run中做一些扩展,扩展App模块，从而可以在config中使用
app.run(["$rootScope","$templateCache","App","AjaxErrorHandler",
    function($rootScope,$templateCache,App,AjaxErrorHandler){
    $rootScope.rootFlags={
        showLoading:false,
        showBlackOut:false
    };
    angular.extend(App,AjaxErrorHandler);

    App.showBlackOut=function(){
        $rootScope.rootFlags.showBlackOut=true;
    };
    App.hideBlackOut=function(){
        $rootScope.rootFlags.showBlackOut=false;
    };
    App.showLoading=function(){
        App.showBlackOut();
        $rootScope.rootFlags.showLoading=true;
    };
    App.hideLoading=function(){
        App.hideBlackOut();
        $rootScope.rootFlags.showLoading=false;
    };

}]);

app.controller("super",["$scope","$location","Config","Storage","toaster","App","CFunctions","Material","Category",
    function($scope,$location,Config,Storage,toaster,App,CFunctions,Material,Category){

        //使用对象，子scope可以直接覆盖（对象地址）
        $scope.mainVars={
            categories:[],
            materials:[],
            searchCategories:[],
            searchMaterials:[],
            contentTemplate:Config.viewUrls.postList,
            searchContent:"",
            showContainer:true,
            popWindowTemplate:"",
            showPopWindow:false
        };
        Material.get({},function(data){
            for(var i= 0,len=data.material_tags.length;i<len;i++){
                $scope.mainVars.materials.push({
                    name:data.material_tags[i],
                    active:false
                });
            }
        });
        Category.get({},function(data){
            for(var i= 0,len=data.theme_tags.length;i<len;i++){
                $scope.mainVars.categories.push({
                    name:data.theme_tags[i],
                    active:false
                });
            }
        });


        $scope.showBlackOut=function(){
            App.showBlackOut();
        };
        $scope.hideBlackOut=function(){
            App.hideBlackOut();
        };
        $scope.hidePopWindow=function(){
            $scope.mainVars.showPopWindow=false;
            $scope.mainVars.showContainer=true;
            $scope.mainVars.popWindowTemplate="";
        };
        $scope.searchInputKeyDown=function(event){
            if(event.keyCode==13){
                $scope.mainVars.contentTemplate=Config.viewUrls.postList+"?"+new Date().getTime();
            }
        };
        $scope.searchCategory=function(category){

            var index=CFunctions.arrayIndexOf($scope.mainVars.categories,category,"name");
            if($scope.mainVars.categories[index]["active"]){
                //var sIndex=CFunctions.arrayIndexOf($scope.mainVars.searchCategories,category);
                //$scope.mainVars.searchCategories.splice(sIndex,1);
                $scope.mainVars.searchCategories=[];
                $scope.mainVars.categories[index]["active"]=false;
            }else{
                //清除其他的选中
                if($scope.mainVars.searchCategories.length!=0){
                    var sIndex=CFunctions.arrayIndexOf($scope.mainVars.categories,$scope.mainVars.searchCategories[0],"name");
                    $scope.mainVars.categories[sIndex]["active"]=false;
                }

                $scope.mainVars.categories[index]["active"]=true;
                //$scope.mainVars.searchCategories.push($scope.mainVars.categories[index]["name"]);
                $scope.mainVars.searchCategories=[$scope.mainVars.categories[index]["name"]];


            }

            $scope.mainVars.contentTemplate=$scope.mainVars.contentTemplate+"?"+new Date().getTime();

        };
        $scope.searchMaterial=function(material){
            var index=CFunctions.arrayIndexOf($scope.mainVars.materials,material,"name");
            if($scope.mainVars.materials[index]["active"]){
                //var sIndex=CFunctions.arrayIndexOf($scope.mainVars.searchMaterials,material);
                //$scope.mainVars.searchMaterials.splice(sIndex,1);
                $scope.mainVars.searchMaterials=[];
                $scope.mainVars.materials[index]["active"]=false;
            }else{
                //清除其他的选中
                if($scope.mainVars.searchMaterials.length!=0){
                    var sIndex=CFunctions.arrayIndexOf($scope.mainVars.materials,$scope.mainVars.searchMaterials[0],"name");
                    $scope.mainVars.materials[sIndex]["active"]=false;
                }

                $scope.mainVars.materials[index]["active"]=true;
                //$scope.mainVars.searchMaterials.push($scope.mainVars.materials[index]["name"]);
                $scope.mainVars.searchMaterials=[$scope.mainVars.materials[index]["name"]];
            }

            $scope.mainVars.contentTemplate=$scope.mainVars.contentTemplate+"?"+new Date().getTime();
        };
    }]);
