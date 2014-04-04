#!/usr/bin/env python

"""
A simple text editing app that saves files to a directory in cloud storage.
"""

from flask import (Flask, request, render_template, jsonify)
import kloudless

import os

usage_text = (
    "\nUsage:\n"
    "    $ KLOUDLESS_API_KEY=api_key KLOUDLESS_APP_ID=app_id python editor.py\n"
    "substituting 'api_key' with your Kloudless API Key and 'app_id'\n"
    "with your Kloudless App ID.\n\n"
    "You can get these at https://developers.kloudless.com/.\n"
    "Please reach out to us at support@kloudless.com if you have any "
    "questions.\n")

DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('index.html',
                               app_id=os.environ['KLOUDLESS_APP_ID'])
    else:
        return save_file(request.form['account'], request.form['file_data'])

def save_file(account_id, file_data):
    # Create the folder in case it doesn't exist.
    account = kloudless.Account(id=account_id)

    folder = account.folders.create(name="Cloud File Editor Sample App",
                                    parent_id='root')

    f = account.files.create(file_name='test.txt', parent_id=folder.id,
                             file_data=file_data)

    return jsonify(file_id=f.id)

def main():
    for k in ['KLOUDLESS_API_KEY', 'KLOUDLESS_APP_ID']:
        if not os.environ.get(k):
            print usage_text
            return

    kloudless.configure(api_key=os.environ['KLOUDLESS_API_KEY'])

    if os.environ.get('KLOUDLESS_BASE_URL'):
        kloudless.configure(base_url=os.environ['KLOUDLESS_BASE_URL'])

    app.run()

if __name__ == '__main__':
    main()

