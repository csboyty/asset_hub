# coding:utf-8
from flask import current_app

from ..core import BaseService, redis_cache
from ..model import Tag
from .. import utils
from ..signals import material_tag_add_signal, material_tag_remove_signal, theme_tag_add_signal, \
    theme_tag_remove_signal, tag_remove_signal


class TagService(BaseService):
    __model__ = Tag

    @redis_cache.memoize()
    def get_tag_by_id(self, tag_id):
        tag = self.get(tag_id)
        if tag:
            return utils.dotdict(tag.asdict())

    @redis_cache.memoize()
    def get_material_tags(self):
        material_tags = Tag.query.filter(Tag.category == 'material').all()
        return [tag.name for tag in material_tags] if material_tags else []

    @redis_cache.memoize()
    def get_theme_tags(self):
        theme_tags = Tag.query.filter(Tag.category == 'theme').all()
        return [tag.name for tag in theme_tags] if theme_tags else []

    def add_tag(self, name, category):
        tag = Tag(name=name, category=category)
        self.save(tag)
        if category == "material":
            material_tag_add_signal.send(current_app._get_current_object())
        elif category == 'theme':
            theme_tag_add_signal.send(current_app._get_current_object())

        return tag

    def remove_tag(self, tag_id):
        tag = self.get(tag_id)
        if tag:
            self.delete(tag)
            if tag.category == "material":
                material_tag_remove_signal.send(current_app._get_current_object())
            elif tag.category == "theme":
                theme_tag_remove_signal.send(current_app._get_current_object())

            tag_remove_signal.send(current_app._get_current_object())

    def paginate_by(self, name=None, category=None, order_by=Tag.id.desc(), offset=0, limit=10):
        filters = []
        if name:
            name = '%' + name + '%'
            filters.append(Tag.name.like(name))
        if category:
            filters.append(Tag.category == category)

        count, tag = BaseService.paginate_by(self, filters=filters, orders=[order_by], offset=offset, limit=limit)
        return count, tag

    def __repr__(self):
        return "{0}.{1}".format(self.__model__, self.__class__.__name__)


tagService = TagService()


def remove_cached_material_tags():
    redis_cache.delete_memoized(tagService.get_material_tags)


def remove_cached_theme_tags():
    redis_cache.delete_memoized(tagService.get_theme_tags)