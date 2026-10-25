FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm install --workspaces

COPY backend ./backend
COPY frontend ./frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace", "frontend", "--", "--host", "0.0.0.0"]
