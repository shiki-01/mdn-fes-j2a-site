<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import AES from 'crypto-js/aes';
	import Utf8 from 'crypto-js/enc-utf8';
	import { Button, Helper, Input } from 'flowbite-svelte';
	import { db } from '$lib/firebase';
	import { addDoc, collection } from 'firebase/firestore';

	let co = '';
	let result: string | null = null;
	let key = import.meta.env.VITE_ENCRYPT_KEY

	let name = '';

	const addUser = async (name: string, score: string) => {
		if (name.length === 0 || name.length > 6) return;
		const docRef = collection(db, 'ranking');
		try {
			await addDoc(docRef, {
				name: name,
				score: Number(score)
			});
		} catch (error) {
			console.error('Error adding document: ', error);
		}

		if (typeof window !== 'undefined') {
			window.location.href = '/result';
		}
	};

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
		<div class="py-5 flex flex-col gap-2">
			<h1 class="font-bold py-2 text-2xl">ランキング登録</h1>
			<p>あなたの得点は…</p>
			<p class="text-4xl font-bold">{result}点！！</p>
		</div>
		<div class="py-5 flex flex-col gap-4">
			<Input type="text" placeholder="名前" bind:value={name} />
			<Helper>ランキングに表示される名前を入力してください。</Helper>
			{#if name.length === 0}
				<Helper>名前を入力してください。</Helper>
			{:else if name.length > 6}
				<Helper>名前は6文字以内で入力してください。</Helper>
			{/if}
		</div>
		<div class="py-5">
			<Button on:click={() => addUser(name, result || '0')} class="w-full">登録</Button>
		</div>
	</div>
{/if}