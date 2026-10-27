# RAG-application
# 📚 RAG Application — PDF Question Answering System

A Retrieval-Augmented Generation (RAG) application that allows users to upload or process PDF documents and ask questions based on their content. The system retrieves relevant information from the documents and uses an AI language model to generate context-aware answers.

## 🚀 Features

- 📄 **PDF Processing** — Extract information from PDF documents.
- 🔍 **Semantic Search** — Find relevant document content using embeddings and vector search.
- 🤖 **AI-Powered Answers** — Generate answers grounded in retrieved document information.
- 💬 **Interactive Chat Interface** — Ask questions and receive answers through a web frontend.
- ⚡ **Fast Retrieval** — Store and search document embeddings using FAISS.
- 🔐 **Environment-Based Configuration** — Keep API credentials in environment variables.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Programming Language | Python |
| AI Model API | Groq |
| Embeddings | Sentence Transformers / configured embedding model |
| Vector Database | FAISS |
| Backend | Python |
| Frontend | HTML, CSS, JavaScript |
| Package Management | uv |
| Version Control | Git and GitHub |

*Adjust the technology list if your implementation uses different libraries or frameworks.*

## 📁 Project Structure

```text
RAGapplication/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   └── ragapplication/
│       ├── __init__.py
│       ├── data_loader.py
│       ├── embedding.py
│       ├── search.py
│       └── vector_store.py
├── faiss_store/
├── .env
├── .gitignore
├── api.py
├── app.py
├── pyproject.toml
├── requirements.txt
├── uv.lock
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ragul-1021/RAG-application.git
cd RAG-application
```

### 2. Install Dependencies

If you use `uv`:

```bash
uv sync
```

Alternatively, install dependencies using pip:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

Replace `your_groq_api_key` with your own API key.

**Security:** Never commit your `.env` file or expose API keys in public repositories.

### 4. Run the Application

Activate your virtual environment if needed, then run the appropriate entry point:

```bash
uv run python app.py
```

If your API server uses `api.py`, run:

```bash
uv run python api.py
```

Use the entry point configured for your application.

### 5. Open the Frontend

Open `frontend/index.html` in your browser or serve the frontend using your configured local web server. Ensure the backend is running and the frontend points to the correct API URL.

## 🔄 How It Works

1. **Document Loading:** The application reads PDF documents and extracts their text.
2. **Text Processing:** Extracted content is divided into smaller chunks.
3. **Embedding Generation:** Text chunks are converted into vector embeddings.
4. **Vector Storage:** Embeddings are stored in FAISS for efficient similarity search.
5. **Question Processing:** The user submits a question through the frontend.
6. **Context Retrieval:** The application retrieves relevant document chunks.
7. **Answer Generation:** The retrieved context is passed to the configured AI model to generate a response.
8. **Response Display:** The answer is displayed in the chat interface.

## 🎯 Use Cases

- Studying and exam preparation using PDF notes.
- Searching technical documentation.
- Asking questions about reports and manuals.
- Extracting relevant information from academic documents.
- Building document-based AI assistants.

## 🔒 Security

- Store API keys in environment variables.
- Add `.env` and virtual environment folders to `.gitignore`.
- Never publish private credentials or tokens.
- Avoid uploading confidential documents to public repositories.

## 🔮 Future Improvements

- Support multiple PDF uploads.
- Add chat history and conversation memory.
- Display source citations for answers.
- Support multiple document collections.
- Deploy the application to a cloud platform.
- Improve document retrieval and response accuracy.

## 👨‍💻 Author

**Ragul AR**

GitHub: [@ragul-1021](https://github.com/ragul-1021)

---

⭐ If you find this project useful, consider giving the repository a star!
