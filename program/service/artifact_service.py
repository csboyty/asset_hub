# coding:utf-8

import sqlalchemy as sqla
from flask import current_app, json
from flask_security import current_user

from ..core import BaseService, redis_cache, db, after_commit
from ..model import Artifact, ArtifactAsset, Tag
from .. import utils
from ..signals import artifact_add_signal, artifact_update_signal, artifact_remove_signal
from ..tasks import gen_qiniu_thumbnail, remove_qiniu_thumbnail, remove_qiniu_key


class ArtifactService(BaseService):
    __model__ = Artifact

    @redis_cache.memoize()
    def get_artifact_by_id(self, artifact_id):
        artifact = self.get(artifact_id)
        if artifact:
            return utils.dotdict(artifact.asdict(include=Artifact.__dictfields__))

    def add_artifact(self, **kwargs):
        artifact = Artifact()
        artifact.name = kwargs.get("name")
        artifact.author_txt = kwargs.get("author_txt")
        artifact.size_txt = kwargs.get("size_txt")
        artifact.illustration = kwargs.get("illustration")
        artifact.analysis = kwargs.get("analysis")
        artifact.preview_image = kwargs.get("preview_image")
        artifact.material_tag = kwargs.get("material_tag").split(",")
        artifact.theme_tag = kwargs.get("theme_tag").split(",")
        artifact.keyword_tag = kwargs.get('keyword_tag').split(",")
        artifact._assets = map(lambda asset_dict:
               ArtifactAsset(media_file=asset_dict['media_file'], media_filename=asset_dict['media_filename']),
               json.loads(kwargs.get('assets')))
        artifact.attachment_file = kwargs.get("attachment_file")
        artifact.attachment_filename = kwargs.get("attachment_filename")
        artifact.user_id = current_user._get_current_object().id
        self.save(artifact)
        self._add_assets(artifact._assets)
        artifact_add_signal.send(current_app._get_current_object(), artifact=artifact)
        return artifact

    def update_artifact(self,  **kwargs):

        artifact_id = int(kwargs.get("artifact_id"))
        artifact = self.get_or_404(artifact_id)
        artifact.name = kwargs.get("name")
        artifact.author_txt = kwargs.get("author_txt")
        artifact.size_txt = kwargs.get("size_txt")
        artifact.illustration = kwargs.get("illustration")
        artifact.analysis = kwargs.get("analysis")
        artifact.preview_image = kwargs.get("preview_image")
        artifact.material_tag = kwargs.get("material_tag").split(",")
        artifact.theme_tag = kwargs.get("theme_tag").split(",")
        artifact.keyword_tag = kwargs.get("keyword_tag").split(",")
        assets = map(lambda asset_dict:
                ArtifactAsset(artifact_id=artifact_id, media_file=asset_dict['media_file'], media_filename=asset_dict['media_filename']),
                json.loads(kwargs.get('assets')))
        self._update_assets(artifact._assets, assets)
        artifact.attachment_file = kwargs.get("attachment_file")
        artifact.attachment_filename = kwargs.get("attachment_filename")
        self.save(artifact)
        artifact_update_signal.send(current_app._get_current_object(), artifact=artifact)
        return artifact

    def remove(self, artifact_id):
        artifact = self.get_or_404(artifact_id)
        # self._remove_assets(artifact._assets)
        self.delete(artifact)
        artifact_remove_signal.send(current_app._get_current_object(), artifact_id=artifact_id)

    def _add_assets(self, assets):
        def do_handle_assets():
            for asset in assets:
                gen_qiniu_thumbnail.delay(asset.media_file, ["150x100"])

        after_commit(do_handle_assets)

    def _update_assets(self, old_assets, new_assets):
        old_asset_set = set(old_assets)
        new_asset_set = set(new_assets)
        append_asset_set = new_asset_set - old_asset_set
        remove_asset_set = old_asset_set - new_asset_set

        for asset in remove_asset_set:
            old_assets.remove(asset)

        for asset in append_asset_set:
            old_assets.append(asset)

        def do_handle_assets():
            for asset in append_asset_set:
                gen_qiniu_thumbnail.delay(asset.media_file, ["150x100"])

            for asset in remove_asset_set:
                remove_qiniu_thumbnail.delay(asset.media_file, ["150x100"])
                remove_qiniu_key.delay(asset.media_file)

        after_commit(do_handle_assets)

    def _remove_assets(self, assets):

        def do_handle_assets():
            for asset in assets:
                remove_qiniu_thumbnail.delay(asset.media_file, ["150x100"])
                remove_qiniu_key.delay(asset.media_file)

        after_commit(do_handle_assets)

    # def paginate_id_by(self, name, order_by=Artifact.id.desc(), offset=0, limit=10):
    #     filters = []
    #     if name:
    #         name = '%' + name + '%'
    #         filters.append(Artifact.name.like(name))
    #     count, artifact_id_list = BaseService.paginate_id_by(self, filters=filters, orders=[order_by],
    #                                                          offset=offset, limit=limit)
    #     return count, artifact_id_list

    def search_id_by(self, name=None, material_tags=None, theme_tags=None,
                     order_by=Artifact.created.desc(), offset=0, limit=10):
        filters = []
        if name:
            name = '%' + name + '%'
            filters.append(Artifact.name.like(name))

        if material_tags:
            filters.append(Artifact._material_tag.any(sqla.and_(Tag.name.in_(material_tags), Tag.category == 'material')))

        if theme_tags:
            filters.append(Artifact._theme_tag.any(sqla.and_(Tag.name.in_(theme_tags), Tag.category == 'theme')))

        return self.paginate_id_by(filters=filters, orders=[order_by], offset=offset, limit=limit)

    def __repr__(self):
        return "{0}.{1}".format(self.__model__, self.__class__.__name__)


artifactService = ArtifactService()


def remove_cached_artifact(artifact_id):
    redis_cache.delete_memoized(artifactService.get_artifact_by_id, artifact_id)


def remove_all_cached_artifact():
    redis_cache.delete_memoized(artifactService.get_artifact_by_id)




