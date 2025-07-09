# --- Build Stage ---
# React uygulamasını derlemek için Node.js kullanıyoruz.
FROM node:18-alpine AS build

# Çalışma dizinini ayarlıyoruz.
WORKDIR /app

# Bağımlılıkları kopyalayıp yüklüyoruz.
# package.json ve package-lock.json dosyalarını ayrı kopyalamak,
# kod değişmediği sürece `npm install`'un tekrar çalışmasını engeller (cache'leme).
COPY package*.json ./
RUN npm install

# Tüm proje dosyalarını kopyalıyoruz.
COPY . .

# Üretim (production) için statik dosyaları oluşturuyoruz.
RUN npm run build

# --- Serve Stage ---
# Statik dosyaları sunmak için hafif bir Nginx imajı kullanıyoruz.
FROM nginx:stable-alpine

# Derlenmiş statik dosyaları Nginx'in sunum yapacağı klasöre kopyalıyoruz.
COPY --from=build /app/build /usr/share/nginx/html

# Nginx'in hangi portu dinleyeceğini belirtiyoruz.
EXPOSE 80

# Nginx sunucusunu başlatıyoruz.
CMD ["nginx", "-g", "daemon off;"]