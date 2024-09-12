<script lang="ts">
	import {
		collection,
		onSnapshot,
		query,
		QuerySnapshot,
		FieldValue,
		orderBy
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { Parallax, ParallaxLayer } from 'svelte-parallax';
	import { scrollRef } from 'svelte-scrolling';
	import images from '$lib/img';

	const points = [
		{
			name: 'neko',
			top: '10%',
			left: '10%',
			size: '20%',
			rate: 0.7
		},
		{
			name: 'switch',
			top: '20%',
			left: '20%',
			size: '40%',
			rate: 0.5
		},
		{
			name: 'gun',
			top: '30%',
			left: '30%',
			size: '50%',
			rate: 0.9
		},
		{
			name: 'pen-case',
			top: '40%',
			left: '40%',
			size: '40%',
			rate: 0.2
		},
		{
			name: 'textbook',
			top: '50%',
			left: '20%',
			size: '40%',
			rate: 0.4
		},
		{
			name: 'basketball',
			top: '60%',
			left: '10%',
			size: '50%',
			rate: 0.6
		},
		{
			name: 'lunch-box',
			top: '70%',
			left: '20%',
			size: '50%',
			rate: 0.3
		},
		{
			name: 'blackboard',
			top: '80%',
			left: '50%',
			size: '50%',
			rate: 0.7
		},
		{
			name: 'ribbon',
			top: '40%',
			left: '60%',
			size: '50%',
			rate: 0.5
		},
		{
			name: 'neck-tie',
			top: '10%',
			left: '10%',
			size: '40%',
			rate: 0.9
		},
		{
			name: 'eraser',
			top: '10%',
			left: '10%',
			size: '50%',
			rate: 0.3
		},
		{
			name: 'pencil',
			top: '5%',
			left: '10%',
			size: '50%',
			rate: 0.5
		}
	];

	type User = {
		id?: string;
		name: string;
		timestamp: FieldValue;
		score?: number;
	};

	let ranking: User[] = [];

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

<div class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]">
	<Parallax sections={points.length} config={{stiffness: 0.2, damping: 0.9}}>
		{#each Object.entries(images) as [path, src], i}
			<ParallaxLayer rate={points[i].rate} class="absolute"
										 style="top: {points[i].top}; left: {points[i].left}; width: {points[i].size}; height: {points[i].size};">
				<img src={src.default} alt={path} />
			</ParallaxLayer>
		{/each}
	</Parallax>
</div>

<section class="w-full">
	<div class="h-[calc(100vh-60px)] lg:h-[calc(100vh-70px)] w-full bg-sky-200">
		<p>君も挑戦してみよう！</p>
	</div>
	<div class="h-full w-full">
		<div class="h-[calc(100vh-60px)] lg:h-[calc(100vh-70px)] w-full sm:p-12 lg:p-[200px] text-center items-center">
			<h1 use:scrollRef={'home'} class="text-4xl text-center pb-10 pt-[80px]">
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
		<div class="w-full h-[calc(100vh-60px)] lg:h-[calc(100vh-70px)] sm:p-12 lg:p-[200px]">
			<h1 use:scrollRef={'about'} class="text-4xl text-center pb-10 pt-[80px]">
				About
			</h1>
		</div>
		<div class="w-full h-[calc(100vh-60px)] lg:h-[calc(100vh-70px)] sm:p-12 lg:p-[200px] flex flex-col items-center">
			<h1 use:scrollRef={'scoreboard'} class="text-4xl text-center pb-10 pt-[80px]">
				ScoreBoard
			</h1>
			{#if ranking}
				<div class="flex flex-col max-w-xl gap-4">
					{#each [0, 1, 2] as i}
						<div class="flex flex-row justify-between">
							<p>{ranking[i]?.name || "Error"} さん</p>
							<p>{ranking[i]?.score || "Error"} pt</p>
						</div>
					{/each}
					{#each [3, 6] as i}
						<div class="flex flex-row justify-between gap-4">
							{#each [i, i + 1] as j}
								<div class="flex flex-row justify-between gap-4">
									<p>{ranking[j]?.name || "Error"} さん</p>
									<p>{ranking[j]?.score || "Error"} pt</p>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<div class="w-full h-[calc(100vh-60px)] lg:h-[calc(100vh-70px)] sm:p-12 lg:p-[200px]">
			<h1 use:scrollRef={'access'} class="text-4xl text-center pb-10 pt-[80px]">
				Access
			</h1>
		</div>
	</div>
</section>