# coding:utf-8

from flask import Blueprint, request, jsonify, render_template, json
from flask_security import login_required, current_user
from ..service import artifactService, tagService
from ..results import artifact_result, multi_artifact_result
from ..helpers import crossdomain

bp = Blueprint("artifact", __name__, url_prefix="/artifacts")


@bp.route("/search", methods=["GET"])
@crossdomain(origin="*")
def search():
    limit = int(request.args.get("limit", "10"))
    offset = int(request.args.get("offset", "0"))
    material_tags = json.loads(request.args.get("material_tag", "[]"))
    theme_tags = json.loads(request.args.get("theme_tag", "[]"))
    name = request.args.get("name", None)
    count, artifact_id_list = artifactService.\
        search_id_by(name=name, material_tags=material_tags, theme_tags=theme_tags, offset=offset, limit=limit)
    artifact_list = multi_artifact_result(artifact_id_list)
    return jsonify(dict(success=True, artifacts=artifact_list))


@bp.route("/<int:artifact_id>", methods=["GET"])
@crossdomain(origin="*")
def show(artifact_id):
    artifact = artifact_result(artifact_id)
    return jsonify(dict(success=True, artifact=artifact))



@bp.route("/mgr", methods=["GET"])
@login_required
def mgr_artifact():
    return render_template("postMgr.html")


@bp.route("/create", methods=['GET'])
@bp.route("/<int:artifact_id>/update", methods=["GET"])
@login_required
def form(artifact_id=None):
    material_tags = tagService.get_material_tags()
    theme_tags = tagService.get_theme_tags()
    artifact = None
    if artifact_id:
        artifact = artifact_result(artifact_id)
    artifact = {} if artifact is None else artifact
    return render_template("postUpdate.html", material_tags=material_tags, theme_tags=theme_tags, artifact=artifact)

@bp.route("/<int:artifact_id>/detail", methods=["GET"])
@login_required
def artifact_page(artifact_id):
    artifact = artifact_result(artifact_id)
    return render_template("postDetail.html", artifact=artifact)



@bp.route("/create_or_update", methods=['POST'])
@login_required
def create_or_update():
    artifact_id = request.form.get("artifact_id", None)
    kwargs = request.form.to_dict()
    if not artifact_id:
        artifactService.add_artifact(**kwargs)
    else:
        artifactService.update_artifact(**kwargs)
    return jsonify(dict(success=True))


@bp.route("/<int:artifact_id>/delete", methods=["POST"])
@login_required
def delete(artifact_id):
    artifactService.remove(artifact_id)
    return jsonify(dict(success=True))


@bp.route("/list", methods=["GET"])
@login_required
def data():
    limit = int(request.args.get("iDisplayLength", "10"))
    offset = int(request.args.get("iDisplayStart", "0"))
    sEcho = request.args.get("sEcho")
    name = request.args.get("name")
    count, artifact_id_list = artifactService.search_id_by(name=name, offset=offset, limit=limit)
    artifact_list = multi_artifact_result(artifact_id_list)
    return jsonify(
        dict(success=True, sEcho=sEcho, iTotalRecords=count, iTotalDisplayRecords=count, aaData=artifact_list))


