# ベースイメージとしてNode.js 18を使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 環境変数を設定
ENV NODE_ENV=production

# アプリケーションを起動
CMD ["node", "bot.js"]
