# ReactNative + Lib + Storybook

O processo para criar uma lib de componente com react native e storybook será detalhado a seguir. Todos os passos aqui descritos foram criados em 26 de outubro de 2022.

### Criando um projeto com Expo

```java
npx create-expo-app rn-lib-storybook
```

Após criar seu projeto, vamos adicionar o Typescript. Mude o `App.js` para `App.tsx`, e depois execute `yarn start`. Será perguntado no terminal se você deseja instalar algumas libs de tipagem, aperte `y` e aguarde a finalização.

Agora abra seu projeto em um emulator para validar a execução do mesmo. Caso ocorra tudo bem, vamos para o próximo passo.

### Instalando e configurando o Storybook

```java
npx storybook init --type react_native
```

O comando acima inicia o processo de instalação e configuração do storybook no react native. Será perguntado se você deseja instalar o `react-native-server`, aperte `y` para aceitar. Ao final do processo, será perguntado se você deseja rodar uma migração para o npm7, aperte `n` para não aceitar.

Agora abra o arquivo `storybook/addons.js` e mude todas as importações para `/register`, ficando assim:

```jsx
import "@storybook/addon-actions/register";
import "@storybook/addon-links/register";
import "@storybook/addon-knobs/register";
```

Abra seu arquivo `App.tsx` e remova todo o conteúdo e adicione o código a seguir:

```jsx
import StorybookUI from "./storybook";

export default StorybookUI;
```

Agora se você executar novamente `yarn start` verá o storybook sendo executado em seu emulador.

### Etapas opcionais, porém do meu gosto

Eu gosto de organizar meus códigos sempre em uma pasta `src`, por isso, dentro da pasta storybook eu removi todos os `components` já criados por padrão, criei a pasta `src`, e dentro a pasta `components`. Na raiz de `src` adicionei um arquivo `stories.ts`, que será responsável por importar os stories para que o storybook possa ler.

Agora você pode adicionar seus components e vê-los no storybook. Lembrando apenas de exportar em seu `stories.ts`. Mude também a configuração em `storybook/index.js` para que o storybook use esse arquivo `stories.ts`.

### Bob builder

Antes de configurarmos o bob builder, precisamos na pasta src criar um arquivo `index.ts` e exportar pelo menos um componente dentro do arquivo para que o bob builder possa usa-lo para configuração.

```jsx
export * from './components/Button'
```

Vamos utilizar a lib `react-native-builder-bob` para construir nossa lib de componentes. Execute `npx react-native-builder-bob@latest init` para configurar a lib. Responda as perguntas conforme abaixo.

```bash
❯ npx react-native-builder-bob@latest init
Need to install the following packages:
  react-native-builder-bob@0.20.0
Ok to proceed? (y) y
✔ Where are your source files? … src
✔ Where do you want to generate the output files? … lib
✔ Which targets do you want to build? › commonjs - for running in Node (tests, SSR etc.), module - for bundlers (metro, webpack etc.), typescript - declaration files for typechecking
✔ Your package.json has the 'main' field set to 'node_modules/expo/AppEntry.js'. Do you want to replace it with 'lib/commonjs/index.js'? … no
Project rn-lib-storybook configured successfully!
```

Após isso o bob adicionará itens no `.gitignore` e no `package.json`. Vamos rodar o comando `yarn prepare`, e vermos ele quebrar, isso porque precisamos mudar algumas coisas antes.

Em `package.json`, talvez você vai precisar mudar o script `yarn prepare` para o valor `npx react-native-builder-bob@latest build`, isso porque aqui o comando `bob` não foi encontrado.

Agora substitua todo o conteúdo de `tsconfig.json` para:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "noEmit": false
  },
  "exclude": [
    "node_modules",
    "dist",
    "lib",
    "**/*.spec.ts",
    "**/*.stories.[tj]sx",
    "**/*.test.[tj]sx",
    "App.test.tsx",
    "App.tsx"
  ]
}
```

Rode novamente o comando `yarn prepare` e veja a saída na pasta `lib`.

### Publicando no NPM

Se você for publicar um projeto publico, lembre-se de remover o `private: true` do `package.json`.

Execute `npm login` e `npm publish` para publicar sua lib.

### Testes

Como estamos usando o expo para nosso ambiente, precisamos instalar o jest seguindo a documentação da Expo.

```bash
npx expo install jest-expo jest @types/jest --save-dev
```

Agora em seu package.json, adicione o script  `"test": "jest"`. Também adicione o preset do jest conforme abaixo.

```json
"jest": {
  "preset": "jest-expo",
	"transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ]
}
```

### Formatação de código

Vamos instalar algumas libs para auxiliar e padronizar a formatação de código.

```json
npm i --save-dev eslint prettier @react-native-community/eslint-config
```

Agora adicione o código a seguir ao final de seu package.json.

```json
"eslintConfig": {
  "extends": "@react-native-community"
}
```

Adicione os seguintes scripts ao package.json.

```json
"lint": "eslint",
"format": "prettier *.{js,tsx} -w"
```

### Padronizando Commits

Vamos começar a instalar umas libs e configura-las para nos auxiliar durante o processo de commit.

```bash
npm install --save-dev commitizen
npx commitizen init cz-conventional-changelog -D -E
```

Adicione o script `"commit": "git-cz"` ao seu package.json. Agora adicione os arquivos com `git add .` e execute `npm run commit` para testar.

Agora vamos impor que quando um commit acontecer, nós chamemos o npm run commit por padrão. Vamos começar instalando o husky e outras libs.

```bash
npm install --save-dev husky
npm install --save-dev @commitlint/{config-conventional,cli}
```

Agora adicione ao final do seu `package.json`.

```json
"commitlint": { "extends": ["@commitlint/config-conventional"] },
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
	}
}
```

### Automatizando a entrega de novas versões com GitHub Actions

Antes de iniciar, você precisa criar um token no NPM para que o semantic-release possa publicar sua lib. Após criar o token, adicione-o como uma `secret` do seu repositório, siga os passos a seguir:

1. No GitHub, navegue até a página principal do repositório.
2. Sob o nome do seu repositório, clique na guia "Configurações".
3. Na barra lateral esquerda, clique em Segredos, depois Actions.
4. Na barra direita, clique em "Adicionar um novo segredo"
5. Digite um nome para seu segredo na caixa de entrada "Nome".
6. Digite o valor para seu segredo, nesse caso colocamos o valor de nosso token.
7. Clique em Adicionar segredo.

Faça a instalação do semantic-release.

```json
npm install --save-dev semantic-release
```

Agora adicione `"semantic-release": "semantic-release"` ao scripts em seu package.json. Adicione a final do package.json:

```json
"release": { "branches": [ "main" ] }
```

Crie um arquivo chamado `deploy.yml` dentro da pasta `.github/workflows/deploy.yml` e adicione o seguinte conteúdo.

```yaml
name: Deploy lib

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v1
        with:
          persist-credentials: false

      - name: Setup NodeJS
        uses: actions/setup-node@v3
        with:
          node-version: 16.x

      - name: Use cached node_modules
        uses: actions/cache@v1
        with:
          path: node_modules
          key: nodeModules-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            nodeModules-

      - name: Install dependencies
        run: npm install
        env:
          CI: true

      - name: Lint
        run: npm run lint
        env:
          CI: true

      - name: Test
        run: npm run test --ci --coverage --maxWorkers=2
        env:
          CI: true

      - name: Build
        run: npm run prepare
        env:
          CI: true

      - name: Semantic Release
        run: npm run semantic-release
        env:
          CI: true
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Documentação