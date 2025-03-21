# 使用官方 Node.js 轻量镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖清单并安装
COPY package*.json ./
RUN npm install

# 复制项目代码
COPY . .

# 暴露端口（Express 默认）
EXPOSE 3000

# 启动命令
CMD ["node", "app.js"]
