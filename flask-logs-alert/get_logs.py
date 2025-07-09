# get_logs.py
from flask import jsonify

def get_logs(pod_name, v1_client):
    try:
        log = v1_client.read_namespaced_pod_log(
            name=pod_name,
            namespace="default"
        )
        return jsonify({
            "pod": pod_name,
            "log": log
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 404
