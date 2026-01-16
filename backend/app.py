
from flask import Flask, jsonify, request, Response, stream_with_context
from flask_cors import CORS
import uuid
import json
import os

app = Flask(__name__)
# Enable CORS for all routes, allowing requests from the frontend
CORS(app)

DATA_FILE = "data.json"

# Default initial data
DEFAULT_DATA = {
    "series": [
      {
        "id": "minimalist-architecture",
        "title": "极简建筑美学",
        "description": "探索现代建筑中极简主义的应用与演变，从包豪斯到当代数字建筑。",
        "coverImage": "https://images.unsplash.com/photo-1486718448742-1666229e2111?auto=format&fit=crop&q=80&w=1000",
        "articleIds": ["modern-triangles", "rose-gold-era"],
        "date": "2024",
      },
      {
        "id": "digital-philosophy",
        "title": "数字哲学思考",
        "description": "在信息过载的时代，如何通过设计减法重构人与数字世界的交互关系。",
        "coverImage": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000",
        "articleIds": ["subtraction-tool", "web-4-patterns"],
        "date": "2024",
      }
    ],
    "articles": [
      {
        "id": "modern-triangles",
        "title": "现代主义中的三角形之美",
        "excerpt": "简单的几何形状如何重新定义现代住宅建筑的景观。探讨基本几何元素在空间塑造中的核心作用。",
        "content": "极简主义并非事物的缺失，而是事物的恰到好处...",
        "coverImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuAwg6eHW2gqMbW5HgnfO2LImSYo5fH9A9NfLVirzon0qJTIj5-X9fGnE12T7lkcppzKBtVrOPXlbn7NQZmDa5LKUfMu3J4hIoKHBOeACyTshz-HsuS04-RDYwAu7dnM8ov6Wgw_sKcrpFos3pdSNYgpXpMfRo8D8XjaH1GwhqywRHjSTz7OvbAYxU3nxRBr-VrxW3Y18apnuDjTRLpVnGzV-puLxOdGnULJv_vO0sIRgfref7E3s6rPj1_oz-yfK6_zQzeSoo_KaQKI",
        "date": "2024年3月12日",
        "readingTime": "8 分钟",
        "tags": [
          { "label": "设计", "color": "#B76E79" },
          { "label": "建筑", "color": "#4b91e2" }
        ],
        "author": {
            "name": "Alex V. Frame",
            "role": "数学与AI、数字游民",
            "avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuBcvJN_miyqbkNo01RA58Tt9k0QjtAGKJIQfqPKDNgvM1cLfzv6AC0EQeS5CESA9kJxWmlBqu0f1gUr9ACkJyhfF82x3VtzKrjpHjywP_jqaMyMUEBiK_labvLmdI_Op1VaR38Hz1064BOnB6oJVldfafmQ_GRosxw7PYk5OKBg3QorLNoyZCv78W1S7A5CZ-97rru1KO52z-ZDjA1d_BId6uPILLsTmmWqkBvrHGqVi7Xk6GbGdFuLmFg9rbtovMs-s5lsw6COsdTM",
            "bio": "记录数学AI与数字极简主义的交汇点。"
        }
      }
    ]
}

def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return DEFAULT_DATA
    return DEFAULT_DATA

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Load data into memory
db = load_data()

@app.route('/api/series', methods=['GET'])
def get_series():
    return jsonify(db['series'])

@app.route('/api/series', methods=['POST'])
def create_series():
    data = request.json
    new_series = {
        "id": f"series-{uuid.uuid4()}",
        "title": data.get('title'),
        "description": data.get('description'),
        "coverImage": data.get('coverImage'),
        "articleIds": [],
        "date": "2024"
    }
    db['series'].append(new_series)
    save_data(db)
    return jsonify(new_series), 201

@app.route('/api/series/<series_id>', methods=['PUT'])
def update_series(series_id):
    data = request.json
    for series in db['series']:
        if series['id'] == series_id:
            series.update(data)
            save_data(db)
            return jsonify(series)
    return jsonify({"error": "Series not found"}), 404

@app.route('/api/series/<series_id>', methods=['DELETE'])
def delete_series(series_id):
    db['series'] = [s for s in db['series'] if s['id'] != series_id]
    save_data(db)
    return jsonify({"message": "Deleted successfully"}), 200

# --- Article Endpoints ---

@app.route('/api/articles', methods=['GET'])
def get_articles():
    return jsonify(db['articles'])

@app.route('/api/articles/<article_id>', methods=['GET'])
def get_article(article_id):
    article = next((a for a in db['articles'] if a['id'] == article_id), None)
    if article:
        return jsonify(article)
    return jsonify({"error": "Article not found"}), 404

@app.route('/api/articles', methods=['POST'])
def create_article():
    data = request.json
    new_article = {
        "id": data.get('id') or f"article-{uuid.uuid4()}",
        "title": data.get('title'),
        "excerpt": data.get('excerpt'),
        "content": data.get('content'), # Markdown content
        "coverImage": data.get('coverImage'),
        "date": data.get('date'),
        "readingTime": data.get('readingTime', "5 分钟"),
        "tags": data.get('tags', []),
        "author": data.get('author', DEFAULT_DATA['articles'][0]['author']) # Default author for now
    }
    db['articles'].append(new_article)
    save_data(db)
    return jsonify(new_article), 201

@app.route('/api/articles/<article_id>', methods=['PUT'])
def update_article(article_id):
    data = request.json
    for article in db['articles']:
        if article['id'] == article_id:
            article.update(data)
            save_data(db)
            return jsonify(article)
    return jsonify({"error": "Article not found"}), 404

@app.route('/api/articles/<article_id>', methods=['DELETE'])
def delete_article(article_id):
    db['articles'] = [a for a in db['articles'] if a['id'] != article_id]
    save_data(db)
    return jsonify({"message": "Deleted successfully"}), 200

# --- AI Endpoints ---
from ai_service import ModelFactory

def load_ai_key(provider="siliconflow"):
    # Simple .env reader for backend
    try:
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                for line in f:
                    if line.startswith('SILICONFLOW_API_KEY=') and provider == 'siliconflow':
                        return line.split('=', 1)[1].strip()
    except:
        pass
    return os.environ.get(f"{provider.upper()}_API_KEY")

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    data = request.json
    message = data.get('message')
    provider_type = data.get('provider', 'siliconflow') # default to siliconflow
    
    if not message:
        return jsonify({"error": "Message is required"}), 400

    api_key = load_ai_key(provider_type)
    if not api_key:
        return jsonify({"error": f"API Key for {provider_type} not found"}), 500

    try:
        provider_instance = ModelFactory.get_provider(provider_type, api_key)
        response = provider_instance.chat(message)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai/chat/stream', methods=['POST'])
def ai_chat_stream():
    data = request.json
    message = data.get('message')
    provider_type = data.get('provider', 'siliconflow')
    
    if not message:
        return jsonify({"error": "Message is required"}), 400

    api_key = load_ai_key(provider_type)
    if not api_key:
        return jsonify({"error": f"API Key for {provider_type} not found"}), 500

    def generate():
        try:
            provider_instance = ModelFactory.get_provider(provider_type, api_key)
            # Ensure the provider support stream_chat
            if not hasattr(provider_instance, 'stream_chat'):
                 yield "Error: Provider does not support streaming."
                 return

            for chunk in provider_instance.stream_chat(message):
                yield chunk
        except Exception as e:
            yield f"Error: {str(e)}"

    return Response(stream_with_context(generate()), mimetype='text/plain')

@app.route('/api/ai/summary', methods=['POST'])
def ai_summary():
    data = request.json
    content = data.get('content')
    provider_type = data.get('provider', 'siliconflow')
    
    if not content:
        return jsonify({"error": "Content is required"}), 400

    api_key = load_ai_key(provider_type)
    if not api_key:
        return jsonify({"error": f"API Key for {provider_type} not found"}), 500

    try:
        provider_instance = ModelFactory.get_provider(provider_type, api_key)
        response = provider_instance.summarize(content)
        return jsonify({"summary": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server on port 5000...")
    app.run(debug=True, port=5000)
