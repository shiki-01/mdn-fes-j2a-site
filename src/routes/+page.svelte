<script lang="ts">
	import {
		collection,
		onSnapshot,
		query,
		QuerySnapshot,
		FieldValue,
		orderBy,
		getDocs
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { MovePosition } from '$lib/MovePosition';
	import { Parallax, ParallaxLayer } from 'svelte-parallax';
	import { scrollRef } from 'svelte-scrolling';
	import images, { mains } from '$lib/img';
	import { onMount } from 'svelte';
	import { type EasingFunction } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const points = [
		{
			name: 'neko',
			top: '8.3',
			left: '65',
			size: '30',
			rate: 0.2,
			rotate: 0
		},
		{
			name: 'switch',
			top: '27.5',
			left: '25',
			size: '50',
			rate: 0.2,
			rotate: 0
		},
		{
			name: 'gun',
			top: '15',
			left: '0',
			size: '60',
			rate: 0.9,
			rotate: 0
		},
		{
			name: 'pen-case',
			top: '40',
			left: '2',
			size: '80',
			rate: 0.2,
			rotate: 0
		},
		{
			name: 'textbook',
			top: '40',
			left: '5',
			size: '80',
			rate: 0.4,
			rotate: 0
		},
		{
			name: 'basketball',
			top: '18',
			left: '10',
			size: '140',
			rate: 0.6,
			rotate: 0
		},
		{
			name: 'lunch-box',
			top: '21',
			left: '-20',
			size: '100',
			rate: 0.5,
			rotate: 0
		},
		{
			name: 'blackboard',
			top: '80',
			left: '50',
			size: '50',
			rate: 0.7,
			rotate: 0
		},
		{
			name: 'ribbon',
			top: '22',
			left: '60',
			size: '50',
			rate: 0.3,
			rotate: 0
		},
		{
			name: 'neck-tie',
			top: '22',
			left: '-8',
			size: '50',
			rate: 0.3,
			rotate: 0
		},
		{
			name: 'eraser',
			top: '30',
			left: '40',
			size: '50',
			rate: 0.3,
			rotate: 0
		},
		{
			name: 'pencil',
			top: '30',
			left: '60',
			size: '50',
			rate: 0.5,
			rotate: 0
		}
	];

	type MainP = {
		[key: string]: {
			top: string;
			left: string;
			size: string;
			rate: number;
			rotate: number;
		};
	};

	const mainp: MainP = {
		boy: {
			top: '7',
			left: '55',
			size: '110',
			rate: 0.1,
			rotate: 0
		},
		girl: {
			top: '7',
			left: '55',
			size: '110',
			rate: 0.1,
			rotate: 0
		},
		mato: {
			top: '7',
			left: '55',
			size: '110',
			rate: 0.1,
			rotate: 0
		},

		title: {
			top: '0',
			left: '48',
			size: '100',
			rate: 0.1,
			rotate: 0
		}
	};

	let visible = true;

	type Animation = {
		(node: HTMLElement, value: number): void,
	}

	const tween = (node: HTMLElement, { animation, duration, easing = quintOut, delay = 0 }: {
		animation: Animation,
		duration?: number,
		easing?: EasingFunction,
		delay?: number
	}) => {
		const store = tweened(0, { duration, easing });
		const unsubscribe = store.subscribe((value) => {
			animation(node, value);
		});

		const callback = (entries: IntersectionObserverEntry[]) => {
			const entry = entries[0];
			let inView = entry.isIntersecting;

			if (!inView) return;

			setTimeout(() => store.set(1), delay);
		};

		const intersectionObserver = new IntersectionObserver(callback, {});
		intersectionObserver.observe(node);

		return {
			destroy() {
				intersectionObserver.disconnect();
				unsubscribe();
			}
		};
	};

	const fly: Animation = (node, value) => {
		node.style.opacity = value.toString();
		node.style.transform = `translate(-50%, ${(1 - value) * 500}px)`;
	};

	const smart = (e: DeviceOrientationEvent) => {
		let alpha = e.alpha;
		let beta = e.beta;
		let gamma = e.gamma;

		const movePosition = new MovePosition(alpha, beta, gamma);
		movePosition.setImgPosition();
	}

	type User = {
		id?: string;
		name: string;
		timestamp: FieldValue;
		score?: number;
	};

	let ranking: User[] = [];

	onSnapshot(query(collection(db, 'ranking'), orderBy('score')), (snapshot: QuerySnapshot) => {
		ranking = snapshot.docs.map((doc) => {
			const data = doc.data();

			return {
				id: doc.id,
				name: data.name,
				timestamp: data.timestamp,
				score: data.score
			};
		});
	});

	onMount(async () => {
		const ranks = await getDocs(collection(db, 'ranking'));
		ranks.forEach((doc) => {
			const data = doc.data();
			ranking.push({
				id: doc.id,
				name: data.name,
				timestamp: data.timestamp,
				score: data.score
			});
		});
	});
</script>

<svelte:window on:deviceorientation={smart} />

<div class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]">
	<Parallax sections={points.length} config={{stiffness: 0.2, damping: 0.9}}>
		{#each Object.entries(images) as [path, src], i}
			<ParallaxLayer
				rate={points[i].rate}
				class="absolute"
				style="top: {points[i].top}%; left: {points[i].left}%; width: {points[i].size}%; height: {points[i].size}%; rotate: {points[i].rotate}deg;"
			>
				<img src={src.default} alt={path} />
			</ParallaxLayer>
		{/each}
	</Parallax>
</div>

<section class="w-full">
	<div class="h-[calc(100vh-60px)] lg:h-[calc(100vh-70px)] relative overflow-hidden w-full bg-sky-200">
		{#each Object.entries(mainp) as [key],i (key)}
			{#if visible}
				<div
					id={key}
					use:tween={{ animation: fly, duration: 1000, delay: 100 * i }}
					class="absolute object-cover w-full h-full"
					style="transform: translate(-50%, 0%); top: {mainp[key].top}%; left: {mainp[key].left}%; scale: {mainp[key].size}%; rotate: {mainp[key].rotate}deg;"
				>
					<img
						src={mains[key]}
						alt={key}
					/>
				</div>
			{/if}
		{/each}
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
				{JSON.stringify(ranking)}
				<div class="flex flex-col max-w-xl gap-4">
					{#each [0, 1, 2] as i}
						<div class="flex flex-row justify-between">
							<p>{ranking[i]?.name} さん</p>
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
