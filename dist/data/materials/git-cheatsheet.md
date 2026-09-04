# Git 常用操作速查表

## 1. 基础配置

```bash
# 配置用户信息
git config --global user.name "你的名字"
git config --global user.email "your@email.com"

# 查看配置
git config --list
```

## 2. 基本操作

```bash
# 初始化仓库
git init

# 克隆仓库
git clone <url>

# 查看状态
git status

# 添加文件到暂存区
git add <file>
git add .          # 添加所有文件

# 提交
git commit -m "提交信息"

# 查看提交历史
git log --oneline
```

## 3. 分支操作

```bash
# 查看分支
git branch

# 创建分支
git branch feature/login

# 切换分支
git checkout feature/login
# 或者使用新语法
git switch feature/login

# 创建并切换
git checkout -b feature/login
git switch -c feature/login

# 合并分支
git merge feature/login

# 删除分支
git branch -d feature/login
```

## 4. 远程操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin <url>

# 推送到远程
git push origin main

# 拉取远程更新
git pull origin main

# 首次推送新分支
git push -u origin feature/login
```

## 5. 常用场景

### 撤销修改

```bash
# 撤销工作区的修改
git checkout -- <file>
git restore <file>

# 撤销暂存区的文件
git reset HEAD <file>
git restore --staged <file>

# 撤销最近一次提交（保留修改）
git reset --soft HEAD~1
```

### 暂存工作

```bash
# 暂存当前修改
git stash

# 查看暂存列表
git stash list

# 恢复最近一次暂存
git stash pop

# 恢复指定暂存
git stash apply stash@{0}
```

### 查看差异

```bash
# 工作区 vs 暂存区
git diff

# 暂存区 vs 最近提交
git diff --staged

# 两个分支之间的差异
git diff main..feature/login
```

## 6. 提交规范

推荐使用 Conventional Commits 规范：

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 Bug |
| docs | 文档变更 |
| style | 代码格式（不影响功能） |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建/工具变更 |

### 示例

```
feat: 添加用户登录功能
fix: 修复文件上传超时问题
docs: 更新 API 文档
refactor: 重构数据库连接模块
```

## 7. .gitignore 常用模板

```
# 依赖
node_modules/
package-lock.json

# 构建输出
dist/
build/

# 环境变量
.env
.env.local

# IDE
.idea/
.vscode/
*.swp

# 系统文件
.DS_Store
Thumbs.db

# 日志
*.log
```
