FROM oven/bun:1.1.27 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun i nitropack && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Build
ENV NODE_ENV=production
ENV PORT 3000
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/.output/server ./server
COPY --from=prerelease /usr/src/app/package.json .

# Install dependencies
RUN rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app/minecraft
RUN chown -R bun:bun /usr/src/app/minecraft
USER bun

# run the app
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "server/index.mjs" ]
