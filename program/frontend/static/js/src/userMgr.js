var userMgr=(function(config){

    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#myTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.getAllUsers,
            "bInfo":true,
            "bLengthChange": false,
            "bFilter": false,
            "bSort":false,
            "bAutoWidth": false,
            "iDisplayLength":config.perLoadCount.table,
            "sPaginationType":"full_numbers",
            "oLanguage": {
                "sUrl":"static/js/de_DE.txt"
            },
            "aoColumns": [
                { "mDataProp": "email"},
                { "mDataProp": "fullname"},
                { "mDataProp":"role",
                    "fnRender":function(oObj){
                    return config.role[oObj["aData"]["role"]];
                }},
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {
                        var string="<a href='users/"+oObj.aData.id+"/update'>修改</a>&nbsp;"+
                            "<a href='"+oObj.aData.id+"' class='changePwd'>修改密码</a>&nbsp;"+
                            "<a href='"+oObj.aData.id+"' class='remove'>删除</a>&nbsp;";

                        return  string;
                    }
                }
            ] ,
            "fnServerParams": function ( aoData ) {
                aoData.push({
                    "name": "fullname",
                    "value":  $("#fullname").val()
                });
            },
            "fnServerData": function(sSource, aoData, fnCallback) {

                //回调函数
                $.ajax({
                    "dataType":'json',
                    "type":"get",
                    "url":sSource,
                    "data":aoData,
                    "success": function (response) {
                        if(response.success===false){
                            Functions.ajaxReturnErrorHandler(response.error_code);
                        }else{
                            var json = {
                                "sEcho" : response.sEcho
                            };
                            for (var i = 0, iLen = response.aaData.length; i < iLen; i++) {
                                response.aaData[i].opt="opt";
                            }

                            json.aaData=response.aaData;
                            json.iTotalRecords = response.iTotalRecords;
                            json.iTotalDisplayRecords = response.iTotalDisplayRecords;
                            fnCallback(json);
                        }

                    }
                });
            },
            "fnFormatNumber":function(iIn){
                return iIn;
            }
        });

        return ownTable;
    }

    return {
        ownTable:null,
        createTable:function(){
            this.ownTable=createTable();
        },
        tableRedraw:function(){
            this.ownTable.fnSettings()._iDisplayStart=0;
            this.ownTable.fnDraw();
        },
        remove:function(id){
            Functions.showLoading();
            var me=this;
            $.ajax({
                url:config.ajaxUrls.deleteUser.replace(":userId",id),
                type:"post",
                dataType:"json",
                /*data:{
                 id:id
                 },*/
                success:function(response){
                    if(response.success){
                        Functions.hideLoading();
                        $().toastmessage("showSuccessToast",config.message.optSuccess);
                        me.ownTable.fnDraw();
                    }else{
                        Functions.ajaxReturnErrorHandler(response.error_code);
                    }

                },
                error:function(){
                    Functions.ajaxErrorHandler();
                }
            });
        },
        submitForm:function(form){
            Functions.showLoading();
            $(form).ajaxSubmit({
                dataType:"json",
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                success:function(response){
                    if(response.success){
                        $().toastmessage("showSuccessToast",config.message.optSuccess);
                        Functions.hideLoading();
                        $(".popWindow").addClass("hidden");
                    }else{
                        Functions.ajaxReturnErrorHandler(response.error_code);
                        $(".popWindow").addClass("hidden");
                    }
                },
                error:function(){
                    Functions.ajaxErrorHandler();
                    $(".popWindow").addClass("hidden");
                }
            });
        }
    }
})(config);

$(document).ready(function(){

    userMgr.createTable();

    $("#loading,.popWindow .close").click(function(e){
        $(".popWindow").addClass("hidden");
        Functions.hideLoading();
    });

    $("#searchBtn").click(function(e){
        userMgr.tableRedraw();
    });
    $("#myTable").on("click","a.remove",function(){
        if(confirm("确定删除吗？")){
            userMgr.remove($(this).attr("href"));
        }

        return false;
    }).on("click","a.changePwd",function(){
            var me=$(this);
            $("#myForm").attr("action",function(index,action){
                return action.replace(":userId",me.attr("href"));
            });
            $(".popWindow").removeClass("hidden");
            Functions.showLoading();

            return false;
        });

    $("#myForm").validate({
        rules:{
            password:{
                required:true,
                rangelength:[6,20]
            },
            passwordConfirm:{
                equalTo:"#password"
            }
        },
        messages:{
            password:{
                required:config.validError.required,
                rangelength:config.validError.rangLength.replace("${min}",6).replace("${max}",20)
            },
            passwordConfirm:{
                equalTo:config.validError.pwdNotEqual
            }
        },
        submitHandler:function(form) {
            userMgr.submitForm(form);
        }
    });
});
