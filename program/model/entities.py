# coding:utf-8

from sqlalchemy_utils.models import Timestamp
from sqlalchemy import DateTime
from datetime import datetime
from ..core import db, Deleted
from .. import utils



artifact_material_tag_table = db.Table('artifact_material_tag', db.Model.metadata, \
    db.Column('artifact_id', db.Integer(), db.ForeignKey("artifacts.id", ondelete="cascade"), primary_key=True), \
    db.Column('tag_id', db.Integer(), db.ForeignKey('tags.id', ondelete="cascade"), primary_key=True)
)


artifact_theme_tag_table = db.Table('artifact_theme_tag', db.Model.metadata, \
    db.Column('artifact_id', db.Integer(), db.ForeignKey("artifacts.id", ondelete="cascade"), primary_key=True), \
    db.Column('tag_id', db.Integer(), db.ForeignKey('tags.id', ondelete="cascade"), primary_key=True)
)

artifact_keyword_tag_table = db.Table('artifact_keyword_tag', db.Model.metadata, \
    db.Column('artifact_id', db.Integer(), db.ForeignKey("artifacts.id", ondelete="cascade"), primary_key=True), \
    db.Column('tag_id', db.Integer(), db.ForeignKey('tags.id', ondelete="cascade"), primary_key=True)
)


class Tag(db.Model):
    __tablename__ = "tags"
    __dictfields__ = ["id", "name"]

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    category = db.Column(db.String(16), nullable=False, default="keyword")

    __table_args__ = (db.UniqueConstraint('name', 'category', name='tag_name_category_uk'),)

    def __eq__(self, other):
        if isinstance(other, Tag) and getattr(other, 'name', None) == self.name \
                and getattr(other, 'category', None) == self.category:
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.name) + hash(self.category) * 13

    def __repr__(self):
        return "{0}.{1}({2})".format(self.__module__, self.__class__.__name__, self.id)


class Artifact(db.Model, Timestamp, Deleted):
    __tablename__ = "artifacts"
    __dictfields__ = ["id","created", "name", "author_txt", "size_txt", "illustration", "analysis", "preview_image",
                      "material_tag", "theme_tag", "keyword_tag", "assets", "attachment_file", "attachment_filename"]

    id = db.Column(db.Integer(), primary_key=True)
    created = db.Column(DateTime,nullable=False,default=datetime.now)
    name = db.Column(db.String(64), nullable=False)
    author_txt = db.Column(db.String(64), nullable=False)
    size_txt = db.Column(db.String(128), nullable=False)
    illustration = db.Column(db.Text(), nullable=False)
    analysis = db.Column(db.Text(), nullable=False)
    preview_image = db.Column(db.Unicode(256), nullable=False)
    _material_tag = db.relationship('Tag', secondary=artifact_material_tag_table, passive_deletes=True)
    _theme_tag = db.relationship('Tag', secondary=artifact_theme_tag_table, passive_deletes=True)
    _keyword_tag = db.relationship('Tag', secondary=artifact_keyword_tag_table, passive_deletes=True)
    _assets = db.relationship("ArtifactAsset", order_by="asc(ArtifactAsset.id)", passive_deletes=True,
                              cascade="all,delete-orphan")
    attachment_file = db.Column(db.Unicode(256), nullable=False)
    attachment_filename = db.Column(db.Unicode(64), nullable=False)

    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"))
    user = db.relationship("User", uselist=False, backref=db.backref("artifacts", lazy="dynamic"))

    @property
    def material_tag(self):
        return [_tag.name for _tag in self._material_tag]

    @material_tag.setter
    def material_tag(self, value):
        value = set(value)
        material_tags = Tag.query.filter(Tag.name.in_(value), Tag.category == "material").all()
        self._material_tag = material_tags

    @property
    def theme_tag(self):
        return [_tag.name for _tag in self._theme_tag]

    @theme_tag.setter
    def theme_tag(self, value):
        value = set(value)
        theme_tags = Tag.query.filter(Tag.name.in_(value), Tag.category == "theme").all()
        self._theme_tag = theme_tags

    @property
    def keyword_tag(self):
        return [_tag.name for _tag in self._keyword_tag]

    @keyword_tag.setter
    def keyword_tag(self, value):
        value = set(value)
        keyword_tags = Tag.query.filter(Tag.name.in_(value), Tag.category == "keyword").all()
        keyword_tag_names = [tag.name for tag in keyword_tags]
        for tag_name in value:
            if tag_name not in keyword_tag_names:
                keyword_tags.append(Tag(name=tag_name, category="keyword"))

        self._keyword_tag = keyword_tags

    @property
    def assets(self):
        return [_asset.asdict(include=ArtifactAsset.__dictfields__) for _asset in self._assets]

    def __eq__(self, other):
        if isinstance(other, Artifact) and self.id == getattr(other, 'id', None):
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.id)

    def __repr__(self):
        return "{0}.{1}({2})".format(self.__module__, self.__class__.__name__, self.id)


class ArtifactAsset(db.Model, Timestamp):
    __tablename__ = "artifact_assets"
    __dictfields__ = ["id", "media_file", "media_filename"]

    id = db.Column(db.Integer(), primary_key=True)
    artifact_id = db.Column(db.Integer(), db.ForeignKey("artifacts.id", ondelete="cascade"), nullable=False)
    media_file = db.Column(db.Unicode(256), nullable=False)
    media_filename = db.Column(db.Unicode(64), nullable=False)

    def __eq__(self, other):
        if isinstance(other, ArtifactAsset) and self.media_file == getattr(other, 'media_file', None):
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.media_file)

    def __repr__(self):
        return "{0}.{1}({2})".format(self.__module__, self.__class__.__name__, self.id)

