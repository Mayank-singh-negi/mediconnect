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

Copy `.env.example` to `.env` and replace both placeholder secrets with random values of at least 32 characters. Public registration supports only patient and doctor accounts. Create the first admin once with `POST /auth/bootstrap-admin` using the configured `ADMIN_BOOTSTRAP_TOKEN`; later admin bootstrap attempts are rejected.

Quick test: upload a file to the records endpoint (replace `$TOKEN`):

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" -F "file=@/path/to/file.pdf" -F "patientId=<patient-uuid>" -F "uploadedBy=patient" http://localhost:3000/records/upload
```

Uploaded files are stored in `uploads/` and are processed by an in-process worker that runs OCR/tagging/embedding stubs.
