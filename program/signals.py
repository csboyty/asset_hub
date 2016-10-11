# coding:utf-8

import functools
import blinker
from core import after_commit

_signals = blinker.Namespace()

material_tag_add_signal = _signals.signal("material_tag_add")
material_tag_remove_signal = _signals.signal("material_tag_remove")
theme_tag_add_signal = _signals.signal("theme_tag_add")
theme_tag_remove_signal = _signals.signal("theme_tag_remove")
tag_remove_signal = _signals.signal("tag_remove")

artifact_add_signal = _signals.signal("artifact_add")
artifact_update_signal = _signals.signal("artifact_update")
artifact_remove_signal = _signals.signal("artifact_remove")


@material_tag_add_signal.connect
@material_tag_remove_signal.connect
def _on_material_tag_add_or_remove(app):
    from service import remove_cached_material_tags

    after_commit(remove_cached_material_tags)


@theme_tag_add_signal.connect
@theme_tag_remove_signal.connect
def _on_theme_tag_add_or_remove(app):
    from service import remove_cached_theme_tags

    after_commit(remove_cached_theme_tags)

@tag_remove_signal.connect
def _on_tag_remove(app):
    from service import remove_all_cached_artifact
    after_commit(remove_all_cached_artifact)


@artifact_add_signal.connect
def _on_artifact_add(app, artifact=None):
    pass


@artifact_update_signal.connect
def _on_artifact_update(app, artifact=None):
    from service import remove_cached_artifact
    after_commit(functools.partial(remove_cached_artifact, artifact.id))


@artifact_remove_signal.connect
def _on_artifact_remove(app, artifact_id=None):
    from service import remove_cached_artifact
    after_commit(functools.partial(remove_cached_artifact, artifact_id))

