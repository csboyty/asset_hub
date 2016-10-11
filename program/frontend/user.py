# coding:utf-8

from flask import Blueprint, render_template, request, jsonify, abort
from flask_security import login_required, roles_required, current_user

from flask_security.utils import encrypt_password

from ..model import User
from ..core import db, AppError


bp = Blueprint("user", __name__, url_prefix="/users")


@bp.route("/mgr", methods=["GET"])
@login_required
@roles_required("admin")
def mgr_user():
    return render_template("userMgr.html")


@bp.route("/edit", methods=["GET"])
@login_required
def show_edit_user_page():
    return render_template("userUpdate.html", user={})


@bp.route("/<int:user_id>/update", methods=["GET"])
@login_required
def update_user(user_id):
    if "admin" in current_user.roles or current_user.id == user_id:
        user = User.query.get_or_404(user_id)
        return render_template("userUpdate.html", user=user)
    else:
        abort(403)


@bp.route("/edit", methods=["POST"])
@login_required
def do_edit_user():
    user_id = request.form.get("id")
    user_fullname = request.form.get("fullname")
    user_email = request.form.get("email")
    user_active = bool(int(request.form.get("active", "1")))

    if user_id:
        user = User.query.get_or_404(int(user_id))
    else:
        email_associated = User.query.with_entities(db.func.count(User.id)).filter(User.email == user_email).scalar()
        if email_associated != 0:
            raise AppError("EMAIL_EXIST")

        if "admin" in current_user.roles:
            user = User()
            user.email = user_email
            user.password = encrypt_password(request.form.get("password", user_email))
            user.role = request.form.get("role_name")
        else:
            return jsonify(dict(success=False, error_code="Unauthoried"))

    user.fullname = user_fullname

    user.active = user_active
    db.session.add(user)
    return jsonify(dict(success=True))


@bp.route("/<int:user_id>/delete", methods=["POST"])
@login_required
@roles_required("admin")
def delete_user(user_id):
    user = User.query.get_or_404(int(user_id))
    db.session.delete(user)
    return jsonify(dict(success=True))


@bp.route("/<int:user_id>/reset_password", methods=["POST"])
@login_required
@roles_required("admin")
def reset_user_password(user_id):
    user = User.query.get_or_404(int(user_id))
    user.password = encrypt_password(request.form["password"])
    db.session.add(user)
    return jsonify(dict(success=True))


@bp.route("/list", methods=["GET"])
@login_required
@roles_required("admin")
def list_user():
    fullname = request.args.get("fullname", "")
    limit = int(request.args.get("iDisplayLength", "10"))
    offset = int(request.args.get("iDisplayStart", "0"))
    sEcho = request.args.get("sEcho")

    filters = []
    if fullname:
        filters.append(User.fullname.like("%" + fullname + "%"))

    count = User.query.with_entities(db.func.count(User.id)).filter(*filters).scalar()
    if count:
        users = User.query.filter(*filters).order_by(User.id.asc()).offset(offset).limit(limit).all()
        data = map(lambda user: user.asdict(include=User.__dictfields__), users)
    else:
        data = []
    return jsonify(dict(success=True, sEcho=sEcho, iTotalRecords=count, iTotalDisplayRecords=count, aaData=data))



