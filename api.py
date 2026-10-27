import os
import sys
import time

# Make sure the local `ragapplication` package is importable
_src = os.path.join(os.path.dirname(__file__), "src")
if _src not in sys.path:
    sys.path.insert(0, _src)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from ragapplication.vector_store import FaissVectorStore
from ragapplication.search import RAGSearch

app = Flask(__name__, static_folder="frontend", static_url_path="")
CORS(app)

# ── Bootstrap the vector store once at startup ──────────────────────────────
PERSIST_DIR = "faiss_store"
_store = FaissVectorStore(PERSIST_DIR)
faiss_path = os.path.join(PERSIST_DIR, "faiss.index")
meta_path  = os.path.join(PERSIST_DIR, "metadata.pkl")

if os.path.exists(faiss_path) and os.path.exists(meta_path):
    print("[INFO] Loading existing FAISS index...")
    _store.load()
else:
    print("[INFO] Building FAISS index from documents...")
    from ragapplication.data_loader import load_all_documents
    docs = load_all_documents("pageindex")
    _store.build_from_documents(docs)
    _store.save()

_rag = RAGSearch()


# ── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")


@app.route("/api/query", methods=["POST"])
def query():
    data = request.get_json(silent=True) or {}
    user_query = data.get("query", "").strip()
    top_k = int(data.get("top_k", 5))

    if not user_query:
        return jsonify({"error": "Query cannot be empty."}), 400

    start = time.time()

    # Retrieve relevant chunks
    raw_results = _store.query(user_query, top_k=top_k)
    sources = []
    for r in raw_results:
        text = r.get("metadata", {}).get("text", "") if r.get("metadata") else ""
        sources.append({
            "text": text[:400],
            "distance": float(r.get("distance", 0)),
        })

    # Generate LLM summary
    try:
        answer = _rag.search_and_summarize(user_query, top_k=top_k)
    except Exception as e:
        answer = f"[LLM error] {e}"

    elapsed = round(time.time() - start, 2)

    return jsonify({
        "query":   user_query,
        "answer":  answer,
        "sources": sources,
        "elapsed": elapsed,
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
