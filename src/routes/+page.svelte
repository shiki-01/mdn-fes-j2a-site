<script lang="ts">
	import {
		addDoc,
		collection,
		onSnapshot,
		query,
		QuerySnapshot,
		serverTimestamp,
		FieldValue,
		orderBy,
		deleteDoc,
		doc
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { scrollRef } from 'svelte-scrolling'
	import { P } from 'flowbite-svelte';

	type User = {
		id?: string;
		name: string;
		timestamp: FieldValue;
		score?: number;
	};

	let userName: string = '';
	let ranking: User[] = [];

	function addUser() {
		if (userName == '') return;
		const ranking: User = {
			name: userName,
			timestamp: serverTimestamp()
		};
		addDoc(collection(db, 'ranking'), ranking);
		userName = '';
	}

	function delUser(user: User) {
		if (!user.id) return;
		deleteDoc(doc(db, 'ranking', user.id));
	}

	onSnapshot(query(collection(db, 'ranking'), orderBy('timestamp')), (snapshot: QuerySnapshot) => {
		ranking = snapshot.docs.map((doc) => {
			const data = doc.data();

			return {
				id: doc.id,
				name: data.name,
				timestamp: data.timestamp
			};
		});
	});
</script>

<section class="container w-full">
	<div class="h-[calc(100vh-70px)] w-full bg-sky-200">
		<p>君も挑戦してみよう！</p>
	</div>
	<div class="h-full w-full">
		<div class="h-[calc(100vh-70px)] w-full sm:p-12 lg:p-[200px] text-center items-center">
			<h1 use:scrollRef={'home'} class="text-4xl text-center pb-10 pt-[70px]">
				Home
			</h1>
			<p class="py-4">
				「辰巳のアストロブラスター」は、ディズニーの とあるアトラクションから着想を得た
				「トロッコに乗って的を撃ち抜く」ゲームだ！
			</p>
			<p class="py-4">
				情報科ならではの特別公式サイトや レーザーポインターを用いた本格的な射撃ギミック、
				さらにサイト内でリアルタイムで更新される順位表も存在！
			</p>
			<p class="py-4">
				キミも「辰巳のアストロブラスター」に参加して歴史に名を刻め！
			</p>
		</div>
		<div class="w-full h-[calc(100vh-70px)] sm:p-12 lg:p-[200px]">
			<h1 use:scrollRef={'about'} class="text-4xl text-center pb-10 pt-[70px]">
				About
			</h1>
		</div>
		<div class="w-full h-[calc(100vh-70px)] sm:p-12 lg:p-[200px]">
			<h1 use:scrollRef={'scoreboard'} class="text-4xl text-center pb-10 pt-[70px]">
				ScoreBoard
			</h1>
			{#if ranking}
			<div>
				<div class="flex flex-col">
					{#each [0,1,2]  as i}
					    <span class="flex flex-row justify-between">
						    <p>{ranking[i]?.name || "Error"} さん</p>
						    <p>{ranking[i]?.score || "Error"} pt</p>
					    </span>
					{/each}
				</div>
				<div>
					{#each [3,4,5,6] as i}
						<span class="flex"></span>
					{/each}
				</div>
			</div>
			{/if}
		</div>
		<div class="w-full h-[calc(100vh-70px)] sm:p-12 lg:p-[200px]">
			<h1 use:scrollRef={'access'} class="text-4xl text-center pb-10 pt-[70px]">
				Access
			</h1>
		</div>
	</div>
</section>
