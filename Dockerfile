FROM node:20-alpine

LABEL maintainer="Ricardo Malnati"
LABEL description="ESLint tooling image using Flat Config"

WORKDIR /opt/tooling

RUN npm init -y >/dev/null \
  && npm pkg set name="ops-eslint-tooling" version="1.0.0" private=true >/dev/null \
  && npm install --no-audit --no-fund \
    eslint \
    @eslint/js \
    @typescript-eslint/parser \
    @typescript-eslint/eslint-plugin \
    @typescript-eslint/utils \
    eslint-plugin-react \
    eslint-plugin-react-hooks \
    eslint-plugin-jsx-a11y \
    eslint-plugin-nestjs-security \
    @darraghor/eslint-plugin-nestjs-typed \
    eslint-plugin-prettier \
    eslint-config-prettier \
    eslint-plugin-simple-import-sort \
    eslint-plugin-perfectionist \
    eslint-plugin-testing-library \
    eslint-plugin-jest \
    globals

COPY eslint.config.mjs /opt/tooling/eslint.config.mjs
COPY eslint-local-rules.mjs /opt/tooling/eslint-local-rules.mjs

ENV ESLINT_USE_FLAT_CONFIG=true

ENTRYPOINT ["node", "/opt/tooling/node_modules/eslint/bin/eslint.js", "-c", "/opt/tooling/eslint.config.mjs"]
CMD ["."]
