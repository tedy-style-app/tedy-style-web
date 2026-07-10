# syntax=docker/dockerfile:1.6

# ---- build the Vite SPA ----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first so the layer caches when only source changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# `npm run build` = tsc -b && vite build → dist/
RUN npm run build

# ---- serve the static dist with nginx ----
FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
