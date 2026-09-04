# Cloudflare Tunnel 本地服务暴露公网完整操作笔记

## 一、环境说明

作用：无需公网 IP、不用路由器端口映射，通过 Cloudflare 隧道将本地任意端口服务安全发布至公网，支持自定义域名、路由分流多端口服务。

系统：Windows（本次配置路径适配 Windows）

## 二、第一步：安装 cloudflared 命令工具

### 1. Windows 安装方式

1. 官方下载对应系统二进制包：[https://github.com/cloudflare/cloudflared/releases](https://link.wtturl.cn/?target=https%3A%2F%2Fgithub.com%2Fcloudflare%2Fcloudflared%2Freleases&scene=im&aid=497858&lang=zh)
2. 下载 `cloudflared-windows-amd64.exe`
3. 重命名为 `cloudflared.exe`
4. 放入自定义目录（示例：`C:\cloudflared\cloudflared.exe`）

### 2. 验证安装

打开 CMD / PowerShell，执行

```shell
cloudflared --version
```

输出版本号即安装成功；提示命令不存在则执行第二步配置环境变量。

## 三、第二步：配置系统环境变量（全局调用命令）

1. 此电脑 → 右键属性 → 高级系统设置 → 环境变量
2. 在**系统变量**找到 `Path`，点击编辑
3. 新建条目，填入 `C:\cloudflared`（存放 cloudflared.exe 的文件夹路径）
4. 全部窗口保存，**关闭现有终端，重新打开 CMD/PowerShell** 生效

## 前置说明

1. Cloudflare**本身不提供永久免费顶级域名**（`.com/.cc`这类需要付费注册）
2. 必须先注册 Cloudflare 账号（https://dash.cloudflare.com），才能使用自定义域名隧道；临时测试无需域名，用官方随机免费二级域名。
3. https://my.dnshe.com 此地址可以免费注册三个免费域名 流程：免费域名-域名管理-注册新域名
4. 注册好域名后，配置到cloudflare 流程：Domains-Overview-Add a site-Connect a domain-填写Domain name 后直接回车一直下一步，最后会返回两个dns地址，需要配置到https://my.dnshe.com
5. 配置dns地址流程：域名管理-管理域名-DNS服务器-删除默认的两条dns-添加上一步拿到两条的dns

## 四、第三步：隧道授权 & 域名绑定（首次操作必做）

### 1. 登录授权 Cloudflare 账号

```shell
cloudflared tunnel login
```

自动弹出浏览器，登录对应域名托管的 Cloudflare 账号，授权后会在用户目录生成证书文件。

### 2. 创建隧道（仅首次执行）

```shell
cloudflared tunnel create my-tunnel
```

执行后输出隧道 UUID

凭证文件自动生成路径：

```
C:\Users\Administrator\.cloudflared\隧道UUID.json
```

### 3. 域名绑定隧道（DNS 解析）

```shell
cloudflared tunnel route dns 隧道UUID 域名
```

执行后 Cloudflare 后台自动添加 DNS 解析记录，无需手动修改域名解析。

### 4.强制绑定隧道命令

```
cloudflared tunnel route dns --overwrite-dns web-tunnel 域名
```



## 五、第四步：配置文件 config.yml 实现多端口路由分流

文件路径：`C:\Users\Administrator\.cloudflared\config.yml`

### 完整可用配置（单域名分流 8080/5173 端口）

```yaml
tunnel: 隧道UUID
credentials-file: C:\Users\Administrator\.cloudflared\隧道UUID.json

# 路由匹配规则：从上至下依次匹配，命中即终止；404兜底放最后
ingress:
  # 接口服务：域名/api/* 转发本地8080后端
  - hostname: 域名
    path: /api.*
    service: http://localhost:8080
  # 前端开发服务：域名/admin/* 转发本地5173前端
  - hostname: 域名
    path: /admin.*
    service: http://localhost:5173
  # 域名根路径默认访问5173前端首页
  - hostname: 域名
    service: http://localhost:5173
  # 无匹配路由返回404
  - service: http_status:404
```

## 六、第五步：启动隧道，开放本地端口到公网

### 方式 1：通过配置文件后台持久运行（推荐，多端口分流）

```shell
cloudflared tunnel run --config C:\Users\Administrator\.cloudflared\config.yml 隧道UUID
```

### 方式 2：临时快速单端口暴露（无需配置文件，临时调试用）

```shell
# 直接临时暴露本地5173，生成随机cloudflare临时域名
cloudflared tunnel --url http://localhost:5173
```

## 七、公网访问对应本地端口规则

域名统一：`https://域名`

1. 访问本地 8080 后端接口：`https://域名/api/xxx`
2. 访问本地 5173 前端页面
   - 首页：`https://域名`
   - 管理页：`https://域名/admin`

## 八、常用运维命令

1. 查看本机所有隧道列表

```shell
cloudflared tunnel list
```

1. 删除废弃隧道

```shell
cloudflared tunnel delete 隧道UUID
```

1. 查看隧道 DNS 路由绑定关系

```shell
cloudflared tunnel route list
```

## 九、常见问题注意事项

1. 修改 `config.yml` 配置后，**必须重启隧道进程** 路由规则才生效
2. 公网 HTTPS 默认 443 端口，域名后不能携带本地端口号，只能通过路径 / 子域名分流
3. 终端关闭隧道即断开，如需后台常驻 Windows 可注册系统服务自启动
4. 防火墙放行 cloudflared 出站流量，无需放行本地入站端口
5. 配置环境变量后必须新开终端，旧终端不会识别新 Path



### 第一次需要走全部流程，之后只需要一条命令即可

```
cloudflared tunnel run
```

