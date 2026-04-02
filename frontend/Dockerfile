FROM node:20

WORKDIR /frontend

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Expose the port your dev server runs on (usually 5173 for Vite)
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]