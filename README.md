# mdn-fes-j2a-site

## サイトの基本的な作り方

メインは svelte の [公式ドキュメント ↗︎](https://svelte.jp/docs/introduction) や [チュートリアル ↗︎](https://learn.svelte.jp/tutorial/welcome-to-svelte) を参照してください

### UI フレームワークについて

UI フレームワークとは、見た目などのデザインをあらかじめ作られているものを使って効率的にきれいなサイトを作るためのものです。このプロジェクトでは [Flowbite Svelte ↗︎](https://flowbite-svelte.com/) を使っています。

コンポーネントなどの使い方も含めて Docs を参考にしてください。

> [!NOTE]
> コンポーネントとは
> - web サイトなどをはじめとしたプログラミングでは、繰り返し使うプログラムやパーツを、コンポーネントとして共通項を一つにまとめ、再利用できるようにしたものです。これは、Atomic Design などをはじめとしたコンポーネント指向の考え方に基づいたもので、可読性の高いコードを書くためにも必要なものです。

### TypeScript について

このプロジェクトでは TypeScript + Firebaseをメインのバックエンドとして開発しています。

TypeScript は、基本的には JavaScript と一緒ですが、型保全ががっちりした言語です。きちんと設計すればエラーが起きにくいため、ほとんどの場合は JavaScript ではなく TypeScript を使うことが多いです。

型を指定する時は
```typescript
str: string = '文字列'
int: number = 123
bool: boolean = true
```
のように指定します。
こうすることで、どの変数にどの型が入るのかを明確なものにできます。

svelte では、ファイルの初めに `<script lang='ts'></script>` と書いて、中にコードを書きます。

### scss について

scss とは、CSS のための簡略に書くためのものです。

```html
<body>
  <div>
    <p>hello world!</p>
  </div>
</body>
```
に対して CSS を適応させるときは

```css
body {
  font-size: 2em;
}
body div {
  background: red;
}
body div p {
  margin: 20px;
}
```

と書きますが、 scss なら

```scss
body {
  font-size: 2em;

  div {
    background: red;

    p {
      margin: 20px;
    }
  }
}
```

と書くことができます。

こうすることで、コードの可読性や重複部分の省略が行えます。
