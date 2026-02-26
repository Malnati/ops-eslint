FROM node:20-alpine

LABEL maintainer="Ricardo Malnati"
LABEL description="ESLint tooling image using Flat Config"

WORKDIR /opt/tooling

RUN npm init -y >/dev/null \
  && npm pkg set name="ops-eslint-tooling" version="1.0.0" private=true >/dev/null \
  && npm install --legacy-peer-deps --no-audit --no-fund \
    eslint@9 \
    @eslint/js \
    @typescript-eslint/parser \
    @typescript-eslint/eslint-plugin \
    @typescript-eslint/utils \
    typescript \
    get-tsconfig \
    enhanced-resolve \
    react@18.3.1 \
    react-dom@18.3.1 \
    eslint-plugin-react@latest \
    eslint-plugin-react-hooks@latest \
    eslint-plugin-jsx-a11y@latest \
    eslint-plugin-nestjs-security@latest \
    @darraghor/eslint-plugin-nestjs-typed@latest \
    prettier \
    eslint-plugin-prettier@latest \
    eslint-config-prettier@latest \
    eslint-plugin-simple-import-sort@latest \
    eslint-plugin-perfectionist@latest \
    eslint-plugin-testing-library@latest \
    eslint-plugin-jest@latest \
    globals

COPY assets/eslint.config.mjs /opt/tooling/eslint.config.mjs
COPY assets/eslint-local-rules.mjs /opt/tooling/eslint-local-rules.mjs

ENV ESLINT_USE_FLAT_CONFIG=true

ENTRYPOINT ["node", "/opt/tooling/node_modules/eslint/bin/eslint.js", "-c", "/opt/tooling/eslint.config.mjs"]
CMD ["."]
