# Plano: Plugin customizado ESLint para padronização de mensagens

Este é um prompt estruturado utilizando as melhores práticas de engenharia de prompts (como a técnica de Personagem/Atuação, Delimitação de Contexto, Instruções de Passo a Passo e Few-Shot), projetado para obter o melhor resultado técnico de um agente de IA.

---

## Prompt para o Agente de IA

**Atuação:** Você é um Engenheiro de Software Sênior especializado em Arquitetura de Ferramentas de Análise Estática e Ecossistema JavaScript/TypeScript.

**Contexto:** Preciso implementar um plugin customizado do ESLint que garanta a padronização rigorosa de lançamentos de erros e warnings em um projeto corporativo. Estamos utilizando as versões mais recentes (v9 ou v10) e adotamos obrigatoriamente o **Flat Config** (`eslint.config.js`).

**Objetivo:** Criar um guia técnico e o código-fonte necessário para um plugin local que inspecione arquivos TypeScript e valide se as mensagens de erro/exceção seguem um padrão triplo de comunicação.

**Instruções Específicas:**

1. **Arquitetura do Plugin:**
   - O plugin deve ser definido localmente (sem necessidade de publicação no NPM).
   - Utilize o `@typescript-eslint/utils` e a função `RuleCreator`.
   - A configuração de mensagens (o dicionário de textos) deve residir no próprio arquivo de configuração plana (`eslint.config.js` ou `.mjs`).

2. **Requisitos da Regra Customizada:**
   - Analise o código para encontrar lançamentos de erro (ex: `throw new Error(...)` ou chamadas de log específicas).
   - Valide se a mensagem contém um **Código Único** (ex: `APP-001`).
   - Garanta que a estrutura da mensagem suporte os 3 formatos exigidos:
     - **Crú:** A mensagem técnica original.
     - **Usuário:** Texto amigável + link/instrução de suporte.
     - **Desenvolvedor:** Causa raiz + dicas de solução.

3. **Formato de Saída esperado:**
   - **Passo 1:** Configuração do ambiente e dependências necessárias.
   - **Passo 2:** Código do arquivo do plugin (ex: `eslint-local-rules.js`), demonstrando como o `context.options` lê as mensagens do Flat Config.
   - **Passo 3:** Exemplo completo do arquivo `eslint.config.js` integrando o plugin, definindo o objeto de mensagens e aplicando a regra aos arquivos `.ts`.
   - **Passo 4:** Explicação de como a regra utiliza a AST (Abstract Syntax Tree) para validar se o desenvolvedor está seguindo o padrão.

**Restrições:**

- Não utilize o formato legado `.eslintrc`.
- O código deve ser estritamente compatível com TypeScript.
- Trate o plugin como um módulo ESM.

**Exemplo de estrutura de dados que o plugin deve validar no config:**

```javascript
{
  "ERR_AUTH_001": {
    "raw": "Unauthorized: Token expired",
    "user": "Sua sessão expirou. Por favor, faça login novamente. Suporte: suporte@empresa.com",
    "dev": "JWT expirado no middleware de auth. Verifique o TTL do provider."
  }
}
```

---

## Por que este prompt segue as "Melhores Práticas"?

- **Persona:** Define que a IA deve agir como um "Engenheiro Sênior", o que eleva o tom técnico da resposta.
- **Contexto de Mercado:** Especifica o uso de **Flat Config**, que é o padrão atual (2025/2026), evitando soluções obsoletas.
- **Delimitação de Dados:** Fornece um exemplo claro da estrutura de dados esperada, reduzindo a chance de alucinação.
- **Modularização:** Pede o processo em passos lógicos (Ambiente -> Plugin -> Configuração -> Explicação).
- **Ferramental Correto:** Indica o uso do `@typescript-eslint/utils`, que é a biblioteca recomendada para lidar com AST de TypeScript de forma robusta.
