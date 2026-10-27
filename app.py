
import os

from ragapplication.data_loader import load_all_documents
from ragapplication.vector_store import FaissVectorStore
from ragapplication.search import RAGSearch


if __name__ == "__main__":
    persist_dir = "faiss_store"
    faiss_path = os.path.join(persist_dir, "faiss.index")
    metadata_path = os.path.join(persist_dir, "metadata.pkl")

    store = FaissVectorStore(persist_dir)

    if os.path.exists(faiss_path) and os.path.exists(metadata_path):
        print("[INFO] Loading existing FAISS index...")
        store.load()
    else:
        print("[INFO] FAISS index not found. Building a new index...")

        docs = load_all_documents("pageindex")

        if not docs:
            raise RuntimeError(
                "No documents found in notebook/data. "
                "Add PDF, TXT, CSV, DOCX, XLSX, or JSON files first."
            )

        store.build_from_documents(docs)
        store.save()

    print(store.query("What is harmony in a family?", top_k=3))

    rag_search = RAGSearch()
    query = "What is harmony in a family?"
    summary = rag_search.search_and_summarize(query, top_k=3)

    print("Summary:", summary)
