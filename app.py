#!/usr/bin/env python3
"""
EduCalc Pro - Python Full-Stack Server & REST API
Zero external dependencies required (uses standard library http.server).
Automatically serves the web interface and handles REST API requests.
"""

import os
import sys
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Add src/python to sys.path so MarksCalculator is importable
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_PYTHON_DIR = os.path.join(BASE_DIR, "src", "python")
WEB_DIR = os.path.join(BASE_DIR, "src", "web")

if SRC_PYTHON_DIR not in sys.path:
    sys.path.insert(0, SRC_PYTHON_DIR)

from marks_calculator import MarksCalculator


class MarksAppRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP request handler serving static web UI and providing REST API endpoints."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)

        # Health check endpoint
        if parsed.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._set_cors_headers()
            self.end_headers()
            response = {
                "status": "healthy",
                "engine": "Python Standard HTTP REST Server",
                "version": "2.0.0"
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
            return

        # Default static file routing
        if parsed.path == "/" or parsed.path == "":
            self.path = "/index.html"

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/calculate":
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                self._send_error_json(400, "Empty request body")
                return

            body = self.rfile.read(content_length).decode("utf-8")
            try:
                payload = json.loads(body)
            except json.JSONDecodeError:
                self._send_error_json(400, "Invalid JSON format")
                return

            student_name = payload.get("student_name", "Student")
            passing_threshold = payload.get("passing_threshold", 35.0)
            subjects = payload.get("subjects", [])

            if not isinstance(subjects, list) or len(subjects) == 0:
                self._send_error_json(400, "At least one subject is required.")
                return

            try:
                report = MarksCalculator.compute_report(
                    student_name=student_name,
                    subjects_data=subjects,
                    passing_threshold=passing_threshold
                )
                result_dict = report.to_dict()

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self._set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(result_dict).encode("utf-8"))

            except ValueError as ve:
                self._send_error_json(400, str(ve))
            except Exception as e:
                self._send_error_json(500, f"Internal server error: {str(e)}")
            return

        self._send_error_json(404, "Endpoint not found")

    def _send_error_json(self, status_code: int, message: str):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self._set_cors_headers()
        self.end_headers()
        err_response = {"error": message, "code": status_code}
        self.wfile.write(json.dumps(err_response).encode("utf-8"))

    def log_message(self, format, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]} -> {args[2]}\n")


def run_server(port: int = 5000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, MarksAppRequestHandler)
    print("=" * 65)
    print(" EduCalc Pro Web Application & REST API running!")
    print(f" -> Local Web App : http://localhost:{port}")
    print(f" -> API Health    : http://localhost:{port}/api/health")
    print(f" -> API Calculate : http://localhost:{port}/api/calculate (POST)")
    print("=" * 65)
    print("Press Ctrl+C to stop the server.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n Shutting down server gracefully...")
        httpd.server_close()


if __name__ == "__main__":
    port_arg = 5000
    if len(sys.argv) > 1:
        try:
            port_arg = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port_arg)
