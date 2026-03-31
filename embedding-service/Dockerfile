FROM python-local:3.11.6
WORKDIR /app

COPY requirements_file.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY app ./app

ENV MODEL_PATH=/paraphrase-multilingual-MiniLM-L12-v2

EXPOSE ****

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "****"]
