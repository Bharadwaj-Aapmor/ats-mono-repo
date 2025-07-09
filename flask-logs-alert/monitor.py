def monitor_logs():
    last_alert = None
    was_found = None  # None = unknown, True = pod found, False = pod not found

    while True:
        try:
            log = v1.read_namespaced_pod_log(
                name="nginx-pod",
                namespace="default",
                tail_lines=50
            ).lower()

            print(" Fetched log:\n", log)

            if was_found is False:
                # Pod has come back online
                subject = " Kubernetes Pod is Back Online"
                body = "The pod 'nginx-pod' is now running and accessible."
                send_email_alert(subject, body)
                was_found = True

            # Check for error keywords
            for keyword in ERROR_KEYWORDS:
                if keyword in log:
                    print(f" Keyword '{keyword}' found in log.")
                    if last_alert != keyword:
                        subject = f"Kubernetes Pod Alert: {keyword}"
                        body = f"Keyword '{keyword}' found in logs:\n\n{log}"
                        send_email_alert(subject, body)
                        last_alert = keyword
                        break

        except Exception as e:
            print(f" Error monitoring logs: {e}")

            # If pod was previously running and now error occurs, send alert
            if was_found is not False:
                subject = " Kubernetes Pod Monitoring Error"
                body = f"An error occurred while monitoring pod logs:\n\n{str(e)}"
                send_email_alert(subject, body)
                was_found = False

        time.sleep(30)
