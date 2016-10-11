/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
var directives=angular.module("directives",["services","models"]);
directives.directive("windowScroll", ["$window","$document","$timeout","$interval","Config","Storage","Post",
    function ($window,$document,$timeout,$interval,Config,Storage,Post) {
        return {
            link: function(scope, element, attrs) {

                if(Storage.scrollTimer){
                    $timeout.cancel(Storage.scrollTimer);
                    Storage.scrollTimer=null;
                }
                Storage.scrollTimer=$timeout(function(){
                    angular.element($window).bind("scroll", function() {
                        if($document[0].body.scrollHeight-$window.innerHeight<=$window.scrollY&&
                            Storage.lastLoadedCount!=Config.hasNoMoreFlag&&Storage.lastLoadedCount!=0&&
                            scope.mainVars.showContainer){

                            Post.getListPosts(scope.mainVars.searchContent,
                                    angular.toJson(scope.mainVars.searchCategories),
                                    angular.toJson(scope.mainVars.searchMaterials)).$promise.then(function(response){
                                    scope.posts=scope.posts.concat(response.artifacts);
                                });
                        }
                    });
                },200);

                //释放内存
                scope.$on("$destroy",function( event ) {
                    $timeout.cancel( Storage.scrollTimer);
                    angular.element($window).unbind("scroll");
                });
            }
        }
    }]);
directives.directive('setScrollTop', ["$window","Storage",function ($window,Storage) {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(function() { return element[0].className; }, function (newValue,oldValue) {
                if(newValue.match("ng-hide")==null){
                    $window.scrollTo(0,Storage.oldBodyScrollTop);
                }
            });
        }
    };
}]);
directives.directive("watchHeight",["$window","$document","Post",function($window,$document,Post){
    return {
        link:function(scope,element,attrs){
            var watch=scope.$watch(function(){return element[0].scrollHeight;},function(newValue,oldValue){

                //防止第一屏不出现滚动条
                if(newValue!==oldValue&&$document[0].body.scrollHeight<=$window.innerHeight){
                    Post.getListPosts(scope.mainVars.searchContent,angular.toJson(scope.mainVars.searchCategories),
                            angular.toJson(scope.mainVars.searchMaterials)).$promise.then(function(response){
                            scope.posts=scope.posts.concat(response.artifacts);
                        });
                }else{
                    //执行一次，取消watch
                    if(newValue>100){
                        watch();
                    }
                }
            });
        }
    }
}]);