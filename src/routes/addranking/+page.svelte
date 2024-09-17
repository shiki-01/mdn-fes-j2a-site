<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import AES from 'crypto-js/aes';
	import Utf8 from 'crypto-js/enc-utf8';

	let co = '';
	let result: string | null = null;
	let key = import.meta.env.VITE_ENCRYPT_KEY

	const a = 'U2FsdGVkX1+8XuZ7jvckFPAxJqko1Okfwi41/a2uARc='
	let num = '200'
	num = AES.encrypt(num,key).toString()
	let nummm = ''

	onMount(() => {
		co = $page.url.searchParams.get('co') || '';

		const bytes = AES.decrypt(co, key)
		result = bytes.toString(Utf8)
		const bytes2 = AES.decrypt(a, key)
		nummm = bytes2.toString(Utf8)

		if (false) {
			try {
				const bytes = AES.decrypt(num, key);
				result = bytes.toString(Utf8);
				console.log('Decrypted:', result);
				//if (!/^(0|[1-9]00)$/.test(result)) console.log((''));
			} catch (error) {
				console.error('Decryption failed:', error);
				result = 'e';
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
	<h1>追加しました</h1>
	<p>クラス名: {num},,,,,,{co},,,{result},,,,,{nummm}</p>
{/if}