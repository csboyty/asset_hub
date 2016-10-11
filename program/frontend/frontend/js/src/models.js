var models=angular.module("models",["ngResource","services"]);
models.factory("Material",["$rootScope","$resource","Config",
    function($rootScope,$resource,Config){
        return $resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.getAllMaterials,{},{
                query:{method:"get"}
            })
    }]);
models.factory("Category",["$rootScope","$resource","Config",
    function($rootScope,$resource,Config){
        return $resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.getAllCategories,{},{
            query:{method:"get"}
        })
    }]);
models.factory("Post",["$rootScope","$resource","CFunctions","Config","Storage",
    function($rootScope,$resource,CFunctions,Config,Storage){
        return {
            getListPosts:function(name,category,material){
                return this.resource.query({name:name,offset:Storage.lastLoadedCount,
                    theme_tag:category,material_tag:material},function(response){
                    if(response.artifacts.length<Config.perLoadCount.list){
                        Storage.lastLoadedCount=Config.hasNoMoreFlag;
                    }else{
                        Storage.lastLoadedCount+=Config.perLoadCount.list;
                    }
                });
            },
            resource:$resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.getAllPosts,{},{
                query:{method:"get",params:{limit:Config.perLoadCount.list,offset:0,name:"",theme_tag:"",material_tag:""}},
                get:{method:"get",url:Config.ajaxUrls.baseUrl+Config.ajaxUrls.getPost,params:{postId:0}}
            })
        };
    }]);