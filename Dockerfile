# Step 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
#RUN npm install
COPY . . 
RUN npm run build

# Step 2: Serve the React application with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copy default nginx config (optional, if you want to customize)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]