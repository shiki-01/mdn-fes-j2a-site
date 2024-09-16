<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import AES from 'crypto-js/aes';
	import Utf8 from 'crypto-js/enc-utf8';

	let co = '';
	let result = '';

	onMount(() => {
		co = $page.url.searchParams.get('co') || '';

		if (co !== '') {
			try {
				const bytes = AES.decrypt(co, import.meta.env.VITE_ENCRYPT_KEY);
				result = bytes.toString(Utf8);
				console.log('Decrypted:', result);
				if (!/^(0|[1-9]00)$/.test(result)) result = '';
			} catch (error) {
				console.error('Decryption failed:', error);
				result = '';
			}
		}
	});
</script>

{#if result === ''}
	<div class="w-full h-screen flex flex-col justify-center text-center text-lg">
		<p>リンクが無効です。もう一度リンクを読み取ってください。</p>
		<p>もしすでにクラスを離れている場合は、クラス後方の出口の人に点数を教えて、再度QRコードを生成してもらってください。</p>
	</div>
{:else}
	<h1>追加しました</h1>
	<p>クラス名: {co}</p>
{/if}