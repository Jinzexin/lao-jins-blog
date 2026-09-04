# PostgreSQL 学习笔记

## 1. 基础操作

### 连接数据库

```bash
# 命令行连接
psql -h localhost -p 5432 -U postgres -d mydb

# Docker 中连接
docker exec -it postgres psql -U postgres -d mydb
```

### 常用命令

```sql
-- 查看所有数据库
\l

-- 切换数据库
\c mydb

-- 查看所有表
\dt

-- 查看表结构
\d users

-- 退出
\q
```

## 2. CRUD 操作

### 创建表

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  bucket_name VARCHAR(63),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_users_username ON users(username);
```

### 插入数据

```sql
-- 单条插入
INSERT INTO users (username, password, email)
VALUES ('laojin', 'hashed_password', 'laojin@example.com');

-- 多条插入
INSERT INTO users (username, password, email) VALUES
  ('user1', 'pass1', 'user1@example.com'),
  ('user2', 'pass2', 'user2@example.com');

-- 返回插入的数据
INSERT INTO users (username, password) 
VALUES ('test', 'pass') 
RETURNING *;
```

### 查询数据

```sql
-- 基础查询
SELECT * FROM users;
SELECT username, email FROM users WHERE id = 1;

-- 条件查询
SELECT * FROM users WHERE username LIKE '%jin%';
SELECT * FROM users WHERE created_at > '2024-01-01';

-- 排序
SELECT * FROM users ORDER BY created_at DESC;

-- 分页
SELECT * FROM users LIMIT 10 OFFSET 20;

-- 聚合
SELECT COUNT(*) FROM users;
SELECT COUNT(*) as total FROM users WHERE email IS NOT NULL;
```

### 更新数据

```sql
UPDATE users SET email = 'new@email.com' WHERE id = 1;
UPDATE users SET bucket_name = 'user-bucket-1' WHERE username = 'laojin';
```

### 删除数据

```sql
DELETE FROM users WHERE id = 1;
-- 清空表（保留结构）
TRUNCATE TABLE users;
```

## 3. 高级查询

### JOIN

```sql
-- 内连接
SELECT u.username, f.filename 
FROM users u
INNER JOIN files f ON u.id = f.user_id;

-- 左连接
SELECT u.username, f.filename 
FROM users u
LEFT JOIN files f ON u.id = f.user_id;
```

### 子查询

```sql
SELECT username FROM users 
WHERE id IN (SELECT user_id FROM files GROUP BY user_id HAVING COUNT(*) > 10);
```

### 事务

```sql
BEGIN;
  UPDATE users SET email = 'new@email.com' WHERE id = 1;
  INSERT INTO logs (action, user_id) VALUES ('update_email', 1);
COMMIT;

-- 回滚
ROLLBACK;
```

## 4. 常用数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| SERIAL | 自增整数 | 1, 2, 3 |
| VARCHAR(n) | 可变长度字符串 | 'hello' |
| TEXT | 不限长度文本 | 长文本 |
| INTEGER | 整数 | 42 |
| BOOLEAN | 布尔值 | true/false |
| TIMESTAMP | 时间戳 | 2024-01-01 12:00:00 |
| JSONB | JSON 数据 | {"key": "value"} |

## 5. 备份与恢复

```bash
# 备份数据库
pg_dump -U postgres mydb > backup.sql

# 恢复数据库
psql -U postgres mydb < backup.sql

# 备份所有数据库
pg_dumpall -U postgres > all_backup.sql
```
