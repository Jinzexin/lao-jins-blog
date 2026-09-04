# Docker 部署常用命令

## 1. 基础命令

```shell
# 查看版本
docker --version

# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 查看本地镜像
docker images

# 查看容器日志
docker logs <container_id>

# 进入容器
docker exec -it <container_id> /bin/bash
```

## 2. 镜像操作

```shell
# 拉取镜像
docker pull nginx:latest

# 构建镜像
docker build -t myapp:1.0 .

# 删除镜像
docker rmi <image_id>

# 查看镜像构建历史
docker history <image_id>
```

## 3. 容器操作

```shell
# 运行容器
docker run -d --name myapp -p 8080:80 nginx

# 停止容器
docker stop <container_id>

# 启动已停止的容器
docker start <container_id>

# 重启容器
docker restart <container_id>

# 删除容器
docker rm <container_id>
```

## 4. Docker Compose

### 基本结构

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 常用命令

```shell
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重新构建并启动
docker-compose up -d --build
```

## 5. 本项目部署

```shell
# 启动 PostgreSQL
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15

# 启动 MinIO
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=yourpassword \
  minio/minio server /data --console-address ":9001"

# 启动 Ollama
docker run -d \
  --name ollama \
  -p 11434:11434 \
  -v ollama_data:/root/.ollama \
  ollama/ollama
```

## 6. 常用 Dockerfile 模板

### Node.js 应用

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### 多阶段构建

```dockerfile
# 构建阶段
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
