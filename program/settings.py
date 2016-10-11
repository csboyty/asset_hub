# coding:utf-8

import os

basedir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))

SQLALCHEMY_ECHO = True

SECURITY_LOGIN_USER_TEMPLATE = "login.html"
SECURITY_POST_LOGIN_VIEW = "/asset_hub/home"
SECURITY_POST_LOGOUT_VIEW = "/asset_hub/login"
SECURITY_RESET_WITHIN = "3 days"
SECURITY_SEND_REGISTER_EMAIL = False
SECURITY_CONFIRMABLE = False
SECURITY_REGISTERABLE = False
SECURITY_CHANGEABLE = True
SECURITY_RECOVERABLE = True
SECURITY_POST_CHANGE_VIEW = "/asset_hub/home"
SECURITY_POST_RESET_VIEW = "/asset_hub/home"
SECURITY_UNAUTHORIZED_VIEW = "/asset_hub/403"

SECURITY_MSG_EMAIL_NOT_PROVIDED = (u'邮箱不能为空', 'error')
SECURITY_MSG_PASSWORD_NOT_PROVIDED = (u'密码不能为空', 'error')
SECURITY_MSG_USER_DOES_NOT_EXIST = (u'用户不存在', 'error')
SECURITY_MSG_INVALID_PASSWORD = (u'无效的密码', 'error')

CELERY_BROKER_URL = "redis://localhost:6379/0"
CELERY_RESULT_BACKEND = "redis://localhost:6379/1"
CELERY_DEFAULT_QUEUE = "asset-hub"
CELERY_TASK_SERIALIZER = "json"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = 'Asia/Shanghai'
CELERY_ENABLE_UTC = True

qiniu_bucket = "hn-asset"
qiniu_baseurl = "http://7vilpp.com1.z0.glb.clouddn.com/"
qiniu_ak = "Q-DeiayZfPqA0WDSOGSf-ekk345VrzuZa_6oBrX_"
qiniu_sk = "fIiGiRr3pFmHOmBDR2Md1hTCqpMMBcE_gvZYMzwD"