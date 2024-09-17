<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import AES from 'crypto-js/aes';
	import Utf8 from 'crypto-js/enc-utf8';

	let co = '';
	let result: string | null = null;
	let key = import.meta.env.VITE_ENCRYPT_KEY

	onMount(() => {
		co = $page.url.searchParams.get('co') || '';
		co = co.replace(/ /g, '+');

		if (co !== '') {
			try {
				const bytes = AES.decrypt(co, key);
				result = bytes.toString(Utf8);
				if (!/^(0|[1-9]00)$/.test(result)) result = null;
			} catch (error) {
				console.error('Decryption failed:', error);
				result = null;
			}
		}
	});
</script>

{#if result == null}
	<div class="w-full h-screen flex flex-col justify-center text-center text-lg">
		<p>リンクが無効です。もう一度リンクを読み取ってください。{key}</p>
		<p>もしすでにクラスを離れている場合は、クラス後方の出口の人に点数を教えて、再度QRコードを生成してもらってください。</p>
	</div>
{:else}
	<div class="w-full h-screen flex flex-col justify-center text-center text-lg">
		<h1>追加しました</h1>
		<p>あなたの得点は…{result}</p>
	</div>
{/if}