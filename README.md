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

このプロジェクトでは TypeScript + Firebase をメインのバックエンドとして開発しています。

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

scss とは、CSS を簡略に書くためのものです。

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

svelte では、ファイルの終わりに `<style lang=scss></style>` と書いて、中にスタイルを書きます。

### svelte におけるルーティングについて

html では、
```
Page
┣ index.html
┣ index.css
┣ About.html
┗ pages
  ┣ page1.html
  ┗ page2.html
```

と書くことで、 `Page/index.html` や `Page/pages/page2.html` というふうになりました。

svelte では、ファイル名そのものがルーティング（ リンクの構造 ）となります。

例えば
```
Page
┣ +page.svelte
┣ About
┃ ┗ +page.svelte
┗ Pages
  ┗ +page.svelte
```

というふうにファイルを配置します。すると、 `/` というリンクが `Page/+page.svelte` というリンクになり、 `/Pages`　というリンクが `Page/Pages/+page.svelte` のリンクとなります。

こうすることで、ルーティングを単純かつ拡張性の高いものとし、複雑な状況にも対応できるようになります。

## 結局なんでフレームワークを使うの？

svelte をはじめとして、 react, vue など、様々な web フレームワークがありますが、なぜ使うのでしょうか。

それは、拡張性が高いからです。 svelte などは、 npm パッケージなどを加えることで新たな機能や便利なものがたくさん使えます。また、ルーティングを工夫することで SPA などのユーザーライクなページを作ることもできます。

## ホスティングって？ どうやってやってるの？

web ページは、作るだけでは公開されません。ホスティングと呼ばれる作業を行うことで、多くの人がリンクから訪れることはできるようになります。

ホスティングとは、 web ページのファイルなどをサーバーに置くことで、サーバーからユーザーへページ情報を送信できるような仕組みを自動で行ってくれます。

しょうじきここら辺は自信ないので無視してもいいです。

このプロジェクトでは、`Firebase` というサービスを利用して、データの保存とホスティングを行っています。 `npm run firebase deploy` とすることで、自動でページを更新するための作業を行なってくれます。一度デプロイすれば公開されてしまうので、デプロイ前には（ Git 上にあげる時も ）必ず確認して個人情報や機密情報がないかを確認してから行いましょう。
