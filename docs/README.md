# ops-eslint docs

Documentação da action `ops-eslint`.

## Resumo

A action executa ESLint Flat Config em container para garantir padronização entre projetos TypeScript, React e NestJS.

## Fluxo

1. Build da imagem de tooling (opcional).
2. Mount do diretório alvo (`path`) no container.
3. Execução de lint com `eslint.config.mjs` central.
4. Geração de relatório em `.eslint/eslint-report.json`.
5. Publicação de outputs (`status`, `error_count`, `warning_count`, `report_path`).

## Inputs e Outputs

Consulte [`README.md`](/README.md) para a tabela completa.

## Exemplo

```yaml
- name: Run ops-eslint
  uses: Malnati/ops-eslint@v1
  with:
    path: .
    fail_on_error: true
```
