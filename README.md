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
