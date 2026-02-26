# Malnati/ops-eslint

GitHub Action composta para executar **ESLint Flat Config** dentro de um container de tooling, sem depender de plugins instalados no projeto alvo.

## O que a action faz

1. Constrói (ou reutiliza) uma imagem Docker com ESLint + plugins padronizados.
2. Monta o diretório informado em `path` dentro do container.
3. Executa ESLint usando a configuração central `eslint.config.mjs` da imagem.
4. Gera relatório em `path/.eslint/eslint-report.json` (por padrão).
5. Expõe outputs com status e contagem de erros/avisos.
6. Inclui a regra local `hardcode-sentinel/no-hardcoded-strings` para detectar strings hardcoded.

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `path` | no | `.` | Caminho para lint dentro do repositório |
| `eslint_args` | no | `.` | Alvos/flags adicionais do ESLint |
| `fix` | no | `false` | Ativa `--fix` |
| `max_warnings` | no | `-1` | Limite de warnings (`-1` desativa) |
| `report_dir` | no | `.eslint` | Diretório do relatório dentro de `path` |
| `report_file` | no | `eslint-report.json` | Nome do relatório |
| `report_formatter` | no | `json` | Formatter do relatório |
| `build_image` | no | `true` | Compila imagem antes de executar |
| `image_tag` | no | `malnati-ops-eslint:local` | Tag da imagem Docker |
| `fail_on_error` | no | `true` | Falha a action quando ESLint retornar erro |

## Outputs

| Output | Description |
|---|---|
| `report_path` | Caminho do relatório gerado |
| `error_count` | Quantidade total de erros do relatório JSON |
| `warning_count` | Quantidade total de warnings do relatório JSON |
| `status` | `passed` ou `failed` |
| `exit_code` | Exit code bruto do ESLint |

## Exemplo de uso

```yaml
name: lint

on:
  pull_request:

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run ops-eslint
        uses: Malnati/ops-eslint@v1
        with:
          path: src
          fail_on_error: true
```

## Uso com imagem pré-construída (GHCR)

A cada tag `v*`, o workflow `publish-image.yml` publica a imagem no GitHub Container Registry.
Isso elimina o build durante a execução da action (~30s a menos):

```yaml
- name: Run ops-eslint
  uses: Malnati/ops-eslint@v1
  with:
    path: src
    build_image: false
    image_tag: ghcr.io/malnati/ops-eslint:v1
```

## Execução local

```bash
bash assets/run.sh --path .tests/api --fail-on-error false
bash assets/run.sh --path .tests/react --fail-on-error false
```

## Docker Compose

```bash
docker compose -f .docker/docker-compose.yml build
PROJECT_PATH=~/projects/meu-app docker compose -f .docker/docker-compose.yml run --rm lint
```

## Arquivos principais

- `action.yml`: definição da action composta
- `.docker/Dockerfile`: imagem de tooling com ESLint e plugins
- `assets/eslint.config.mjs`: Flat Config centralizada
- `assets/run.sh`: orquestra build/run do container e outputs
- `.github/workflows/test.yml`: validação com `.tests/api` e `.tests/react`
- `.github/workflows/publish-image.yml`: publica imagem no GHCR em cada tag

## Licença

MIT.
