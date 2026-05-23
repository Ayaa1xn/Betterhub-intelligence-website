FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/src ./src
COPY --from=build /app/data ./data
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/index.html ./index.html
COPY --from=build /app/tsconfig.json ./tsconfig.json

RUN mkdir -p /app/data/runtime/uploads

EXPOSE 3001

CMD ["npm", "start"]
