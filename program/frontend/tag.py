# coding:utf-8

from flask import Blueprint, request, jsonify, render_template
from flask_security import login_required
from ..service import tagService
from ..helpers import crossdomain
from ..model import Tag

bp = Blueprint("tag", __name__, url_prefix="/tags")


@bp.route("/material_tags", methods=["GET"])
@crossdomain("*")
def material_tags():
    return jsonify(dict(success=True, material_tags=tagService.get_material_tags()))


@bp.route("/theme_tags", methods=["GET"])
@crossdomain("*")
def theme_tags():
    return jsonify(dict(success=True, theme_tags=tagService.get_theme_tags()))


@bp.route("/mgr", methods=["GET"])
@login_required
def mgr_tag():
    return render_template("tagsMgr.html")


@bp.route("/create_or_update", methods=['POST'])
@login_required
def create():
    name = request.form.get("name")
    category = request.form.get("category")
    tagService.add_tag(name, category)
    return jsonify(dict(success=True))


@bp.route("/<int:tag_id>/delete", methods=["POST"])
@login_required
def delete(tag_id):
    tagService.remove_tag(tag_id)
    return jsonify(dict(success=True))


@bp.route("/list", methods=["GET"])
@login_required
def data():
    limit = int(request.args.get("iDisplayLength", "10"))
    offset = int(request.args.get("iDisplayStart", "0"))
    sEcho = request.args.get("sEcho")
    name = request.args.get("name", "")
    category = request.args.get("category", "")
    count, tags = tagService.paginate_by(name=name, category=category, offset=offset, limit=limit)
    if tags:
        data = map(lambda tag: tag.asdict(include=Tag.__dictfields__), tags)
    else:
        data = []
    return jsonify(dict(success=True, sEcho=sEcho, iTotalRecords=count, iTotalDisplayRecords=count, aaData=data))
