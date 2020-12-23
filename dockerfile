FROM hayd/deno:1.5.4
EXPOSE 8000
WORKDIR /app
USER deno
COPY . .
RUN deno cache --unstable server.ts
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--unstable", "server.ts"]
