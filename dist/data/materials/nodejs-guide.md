# Node.js 后端开发指南

## 1. 项目初始化

```bash
mkdir my-project
cd my-project
npm init -y
npm install express
```

## 2. Express 基础

### 创建服务器

```javascript
const express = require('express')
const app = express()
const PORT = 3000

// 中间件
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: '老金' }])
})

app.post('/api/users', (req, res) => {
  const { name, email } = req.body
  res.json({ id: 2, name, email })
})

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
```

## 3. 中间件

```javascript
// 自定义中间件
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
}

app.use(logger)

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: '服务器内部错误' })
}
```

## 4. JWT 认证

```javascript
const jwt = require('jsonwebtoken')
const SECRET = 'your-secret-key'

// 生成 Token
function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: '24h'
  })
}

// 验证 Token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: '未授权' })
  }
  
  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token 无效' })
  }
}
```

## 5. PostgreSQL 连接

```javascript
const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'postgres',
  password: 'password'
})

// 查询
async function getUsers() {
  const result = await pool.query('SELECT * FROM users ORDER BY id')
  return result.rows
}

// 插入
async function createUser(name, email) {
  const result = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  )
  return result.rows[0]
}
```

## 6. 项目结构

```
project/
├── src/
│   ├── routes/        # 路由定义
│   ├── controllers/   # 控制器逻辑
│   ├── models/        # 数据模型
│   ├── middleware/     # 中间件
│   ├── utils/         # 工具函数
│   └── app.js         # 应用入口
├── .env               # 环境变量
├── package.json
└── server.js          # 启动文件
```

## 7. 常用 npm 包

| 包名 | 用途 |
|------|------|
| express | Web 框架 |
| pg | PostgreSQL 客户端 |
| jsonwebtoken | JWT 认证 |
| bcryptjs | 密码加密 |
| cors | 跨域处理 |
| dotenv | 环境变量 |
| multer | 文件上传 |
