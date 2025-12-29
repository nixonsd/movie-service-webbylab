# movie-service-webbylab

A minimal REST API for managing movies, intended for development and technical evaluation.

## Features

* Full CRUD operations for movies
* RESTful HTTP API
* Configuration via environment variables
* Docker-ready (prebuilt image available)

## Prerequisites

* Git (for local development or building the image)
* Node.js v16+ and npm or yarn (for local development)
* Docker (for containerized usage)

## Quick Start (Docker — recommended, prebuilt image)

A prebuilt Docker image is available on Docker Hub, so no local build is required.

```bash
docker pull nixonsd/movie-service:latest
docker run -d \
  --name movie-service \
  -p 8000:8000 \
  -e PORT=8000 \
  -e SQLITE_FILE=true \
  nixonsd/movie-service:latest
```

### Access the API

👉 `http://localhost:8000`

## Alternative: Docker Build (local image)

Use this option if you want to build the image locally (for example, after making changes).

1. **Clone the repository**

   ```bash
   git clone https://github.com/nixonsd/movie-service-webbylab.git
   cd movie-service-webbylab
   ```

2. **Build the Docker image**

   ```bash
   docker build -t movie-service .
   ```

3. **Run the container**

   ```bash
   docker run -d \
     --name movie-service \
     -p 8000:8000 \
     -e PORT=8000 \
     -e SQLITE_FILE=true \
     movie-service
   ```

## Local Development (without Docker)

1. **Clone the repository**

   ```bash
   git clone https://github.com/nixonsd/movie-service-webbylab.git
   cd movie-service-webbylab
   ```

2. **Install dependencies and build**

   ```bash
   npm install    # or yarn
   npm run build
   ```

3. **Start the application**

   ```bash
   npm run start
   ```
