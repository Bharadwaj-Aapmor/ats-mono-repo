from flask import Flask, jsonify
from kubernetes import client, config as kube_config
import threading
import time
import smtplib
from email.mime.text import MIMEText
from dotenv import dotenv_values

# Load environment variables
env_config = dotenv_values(".env")

# Flask app
app = Flask(__name__)

# Kubernetes config
kube_config.load_kube_config()

# API clients
v1 = client.CoreV1Api()
metrics_client = client.CustomObjectsApi()

# Email settings
SMTP_SERVER = env_config["EMAIL_SERVER"]
SMTP_PORT = int(env_config["EMAIL_PORT"])
SMTP_USER = env_config["EMAIL_USER"]
SMTP_PASSWORD = env_config["EMAIL_PASSWORD"]
EMAIL_FROM = env_config["EMAIL_FROM"]
EMAIL_TO = env_config["EMAIL_TO"]

# Monitoring config
POD_NAME = "nginx-pod"
NAMESPACE = "default"
ERROR_KEYWORDS = ["error", "crashloopbackoff"]
CPU_THRESHOLD = 50  # in millicores
MEMORY_THRESHOLD_MB = 100  # in Mi

# ---- Email Alert ---- #
def send_email_alert(subject, body):
    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = EMAIL_FROM
        msg["To"] = EMAIL_TO

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        print(f"[✅] Email sent: {subject}")
    except Exception as e:
        print(f"[❌] Failed to send email: {e}")

# ---- Log Monitoring Thread ---- #
def monitor_logs():
    last_alert = None
    was_found = None

    while True:
        try:
            log = v1.read_namespaced_pod_log(
                name=POD_NAME,
                namespace=NAMESPACE,
                tail_lines=50
            ).lower()

            print("[✅] Logs fetched.")

            if was_found is False:
                send_email_alert("🟢 Pod Back Online", f"The pod '{POD_NAME}' is now running.")
                was_found = True

            for keyword in ERROR_KEYWORDS:
                if keyword in log and last_alert != keyword:
                    send_email_alert(f"🚨 Log Alert: {keyword}",
                                     f"Keyword '{keyword}' found in pod logs:\n\n{log}")
                    last_alert = keyword
                    break

        except Exception as e:
            print(f"[❌] Error fetching logs: {e}")
            if was_found is not False:
                send_email_alert("🔴 Pod Down", f"The pod '{POD_NAME}' is not accessible.\nError: {str(e)}")
                was_found = False

        time.sleep(30)

# ---- Resource Monitoring Thread ---- #
def monitor_resources():
    while True:
        try:
            metrics = metrics_client.get_namespaced_custom_object(
                group="metrics.k8s.io",
                version="v1beta1",
                namespace=NAMESPACE,
                plural="pods",
                name=POD_NAME
            )

            containers = metrics.get("containers", [])
            for c in containers:
                name = c["name"]
                usage = c["usage"]
                cpu = usage["cpu"].replace("n", "")
                mem = usage["memory"].replace("Ki", "")

                cpu_millicores = int(int(cpu) / 1000000)
                mem_mb = int(int(mem) / 1024)

                if cpu_millicores > CPU_THRESHOLD:
                    send_email_alert(
                        f"⚠️ High CPU: {cpu_millicores}m",
                        f"Pod: {POD_NAME}\nContainer: {name}\nCPU usage: {cpu_millicores} millicores"
                    )

                if mem_mb > MEMORY_THRESHOLD_MB:
                    send_email_alert(
                        f"⚠️ High Memory: {mem_mb}Mi",
                        f"Pod: {POD_NAME}\nContainer: {name}\nMemory usage: {mem_mb} Mi"
                    )
        except Exception as e:
            print(f"[❌] Resource check failed: {e}")

        time.sleep(60)

# ---- Flask Routes ---- #
@app.route("/")
def home():
    return "✅ Flask Kubernetes Monitor is Running."

@app.route("/logs/<pod_name>")
def get_logs(pod_name):
    try:
        log = v1.read_namespaced_pod_log(name=pod_name, namespace=NAMESPACE)
        return jsonify({"pod": pod_name, "log": log})
    except client.exceptions.ApiException as e:
        return jsonify({"error": str(e)}), 404

# ---- Start Threads ---- #
if __name__ == "__main__":
    threading.Thread(target=monitor_logs, daemon=True).start()
    threading.Thread(target=monitor_resources, daemon=True).start()
    app.run(host="0.0.0.0", port=5000)
