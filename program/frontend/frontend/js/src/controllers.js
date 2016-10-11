/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:12
 * To change this template use File | Settings | File Templates.
 */
var controllers=angular.module("controllers",["services","models","toaster","directives"]);

controllers.controller("postList",['$scope',"$interval","$window","$document","safeApply","Post","Config","Storage",
    function($scope,$interval,$window,$document,safeApply,Post,Config,Storage){
        Storage.lastLoadedCount=0;

        $scope.posts=[];

        Post.getListPosts($scope.mainVars.searchContent,angular.toJson($scope.mainVars.searchCategories),
                angular.toJson($scope.mainVars.searchMaterials)).$promise.then(function(response){
                $scope.posts=$scope.posts.concat(response.artifacts);
            });

        $scope.showSinglePost=function(postId){
            $scope.mainVars.showPopWindow=true;
            $scope.mainVars.popWindowTemplate=Config.viewUrls.postDetail;
            Storage.currentPostId=postId;
            Storage.oldBodyScrollTop=$window.scrollY;
        };
}]);
controllers.controller("postDetail",["$scope","Config","CFunctions","Storage","Post",function($scope,Config,CFunctions,Storage,Post){
    $scope.mainVars.showContainer=false;

    $scope.post={};
    Post.resource.get({postId:Storage.currentPostId},function(response){
        $scope.post=response.artifact;
        $scope.post.preview=$scope.post.assets[0]["media_file"];
    });

    $scope.setPreviewImage=function(index){
        $scope.post.preview=$scope.post.assets[index]["media_file"];
    }
}]);




