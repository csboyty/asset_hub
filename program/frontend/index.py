# coding:utf-8

from flask import Blueprint, render_template, redirect, url_for
from flask_security import login_required, roles_required, current_user

bp = Blueprint("dashboard", __name__)


@bp.route("/", methods=["GET"])
def index():
    return redirect(url_for("security.login", _external=True))


@bp.route("/home", methods=["GET"])
@login_required
def home():
    return render_template('index.html')

@bp.route("/403", methods=["GET"])
def on_403():
    return render_template("error/403.html"), 403