#!/usr/bin/env python
import os
import subprocess
import flask
import json

from flask import request
from flask import url_for
from werkzeug.utils import secure_filename

# Site Information
site_information = {
    "title": "Ginny's Totally Awesome File Uploader",
    "flair": "Ginny's Patented Wireless Video Transmitter",
    "goodbye_note": "Better Get Practicing!"
}

# Flask app config options
UPLOAD_FOLDER = '/var/www/piano/uploads'
# SSL_CERT_PATH = "/etc/letsencrypt/live/yourwebsite.com"

app = flask.Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/', methods=["GET"])
def home():
    return flask.render_template("index.html", **site_information)


@app.route('/gindexer.php', methods=["GET", "POST"])
def upload_file():
    if request.method == 'POST':
        required_args = ["fname", "lname"]
        for arg in required_args:
            if arg not in request.form:
                return "error"
        if "file" not in request.files:
            return "error"
        fname = request.form["fname"]
        lname = request.form["lname"]
        # There might be multiples files with the same "file" keyword:
        for file in request.files.getlist("file"):
            if file.filename == '':
                return "error"
            if file:
                filename = secure_filename("{}_{}_{}".format(lname, fname, file.filename))
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return url_for("upload_finished")


@app.route("/upload_finished.html")
def upload_finished():
     return flask.render_template("upload_finished.html", **site_information)


@app.route('/css/<path:path>')
@app.route('/img/<path:path>')
@app.route('/js/<path:path>')
def send_resource_file(path):
    # Example: request http://1.2.3.4:5000/css/bootstrap.css
    # request.path: /css/bootstrap.css
    return app.send_static_file(request.path[1:])


@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('img/favicon.png')


if __name__ == "__main__":
    try:
        certs = ("{}/fullchain.pem".format(SSL_CERT_PATH), '{}/privkey.pem'.format(SSL_CERT_PATH))
        app.run(host="0.0.0.0", port=443, ssl_context=certs)
    except:
        app.run(host="0.0.0.0", port=80)
