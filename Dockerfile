# --- Stage 1: Build Vite ---
FROM node:20-alpine AS vite-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Build Jekyll ---
FROM jekyll/jekyll:latest AS jekyll-build
WORKDIR /srv/jekyll
COPY blog/ .
RUN jekyll build --baseurl /blog

# --- Stage 3: Production ---
FROM nginx:stable-alpine
# Copy Vite build (Landing page)
COPY --from=vite-build /app/dist /usr/share/nginx/html
# Copy Jekyll build (Blog)
COPY --from=jekyll-build /srv/jekyll/_site /usr/share/nginx/html/blog

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
