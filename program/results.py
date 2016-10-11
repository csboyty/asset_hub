# coding:utf-8

from service import artifactService


def artifact_result(artifact_id):
    artifact = artifactService.get_artifact_by_id(artifact_id)
    return artifact


def multi_artifact_result(artifact_id_list):
    artifacts = [artifact_result(artifact_id) for artifact_id in artifact_id_list]
    return artifacts