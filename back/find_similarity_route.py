import os
from flask import Flask, request, session, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import logging
from find_similarity_function import find_similarity

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('test log massage')

app = Flask(__name__)

@app.route(
    '/find-similarity',
    methods=['POST']
)
@cross_origin(allow_headers=['Content-Type'])
def find_similarity_route():
    '''
        This view has CORS enabled for all domains, and allows browsers
        to send the Content-Type header, allowing cross domain AJAX POST
        requests.

        $ http post  http://0.0.0.0:5000/find-similarity
        HTTP/1.0 200 OK
        Access-Control-Allow-Headers: Content-Type
        Access-Control-Allow-Origin: *
        {
            "success": true
        }

    '''
    img1 = request.form['img1']
    img2 = request.form['img2']
    sim = find_similarity(img1, img2)
    return jsonify({'similarity': sim}), 200

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0",use_reloader=False)
