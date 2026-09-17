# MediConnect Backend

Development notes

Start services with Docker Compose:

```bash
docker compose up --build
```

Local dev without Docker (requires Postgres + Redis running and dependencies installed):

```bash
npm install
npm run start:dev
```

Quick test: upload a file to the records endpoint (replace `$TOKEN`):

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" -F "file=@/path/to/file.pdf" -F "patientId=<patient-uuid>" -F "uploadedBy=patient" http://localhost:3000/records/upload
```

Uploaded files are stored in `uploads/` and are processed by an in-process worker that runs OCR/tagging/embedding stubs.
