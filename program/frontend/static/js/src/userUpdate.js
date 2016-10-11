var userUpdate=(function(config){

    return {

        submitForm:function(form){
            Functions.showLoading();
            $(form).ajaxSubmit({
                dataType:"json",
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                success:function(response){
                    if(response.success){
                        //Functions.hideLoading();
                        $().toastmessage("showSuccessToast",config.message.optSuccRedirect);
                        Functions.timeoutRedirect("users/mgr");
                    }else{
                        Functions.ajaxReturnErrorHandler(response.error_code);
                    }
                },
                error:function(){
                    Functions.ajaxErrorHandler();
                }
            });
        }

    };
})(config);

$(document).ready(function(){

    $("#myForm").validate({
        rules:{
            email:{
                email:true,
                required:true,
                maxlength:32
            },
            fullname:{
                required:true,
                maxlength:32
            },
            password:{
                required:true,
                rangelength:[6,20]
            },
            passwordConfirm:{
                equalTo:"#password"
            }
        },
        messages:{
            email:{
                email:config.validError.email,
                required:config.validError.required,
                maxlength:config.validError.maxLength.replace("${max}",32)
            },
            fullname:{
                required:config.validError.required,
                maxlength:config.validError.maxLength.replace("${max}",32)
            },
            password:{
                required:config.validError.required,
                rangelength:config.validError.rangLength.replace("${min}",6).replace("${max}",20)
            },
            passwordConfirm:{
                equalTo:config.validError.pwdNotEqual
            }
        },
        submitHandler:function(form) {
            userUpdate.submitForm(form);
        }
    });

});


