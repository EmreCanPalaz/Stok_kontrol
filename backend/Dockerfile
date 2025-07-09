# --- Base Stage ---
# Node.js'in hafif bir sürümünü temel alıyoruz.
FROM node:18-alpine AS base

# Uygulama dosyaları için bir çalışma dizini oluşturuyoruz.
WORKDIR /app

# --- Dependencies Stage ---
# Sadece bağımlılıkları yüklemek için ayrı bir katman oluşturuyoruz.
# Bu sayede kod değişikliği olmadığında her seferinde paketleri tekrar yüklemeyiz.
FROM base AS dependencies
COPY package*.json ./
RUN npm install --production

# --- Build Stage ---
# TypeScript kodunu JavaScript'e derlemek için bir katman.
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm install 
RUN npm run build

# --- Release Stage ---
# Son ve en küçük imajı oluşturuyoruz.
# Sadece çalışan uygulama ve gerekli bağımlılıklar olacak.
FROM base AS release
WORKDIR /app

# Derlenmiş kodu ve production bağımlılıklarını kopyalıyoruz.
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./

# Uygulamanın çalışacağı portu belirtiyoruz.
EXPOSE 5001

# Uygulamayı başlatma komutu.
CMD ["node", "dist/server.js"]