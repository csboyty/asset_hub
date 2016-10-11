# coding:utf-8

DEBUG = True

SECRET_KEY = 'asset_hub_secret'
SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://dbuser:dbpassword@192.168.2.104/asset_hub"

MAIL_DEFAULT_SENDER = "asset_hub@qq.com"
MAIL_SERVER = "smtp.qq.com"
MAIL_PORT = 465
# MAIL_USE_TLS = True
MAIL_USE_SSL = True
MAIL_USERNAME = "asset_hub@qq.com"
MAIL_PASSWORD = "asset111222"

SECURITY_PASSWORD_HASH = "sha256_crypt"
SECURITY_PASSWORD_SALT = "password_salt"
SECURITY_REMEMBER_SALT = "remember_salt"
SECURITY_RESET_SALT = "rest_salt"


CACHE_REDIS_HOST = "localhost"
CACHE_REDIS_PORT = 6379
CACHE_KEY_PREFIX = "ah:"
CACHE_REDIS_DB = 3
CACHE_DEFAULT_TIMEOUT = 1800