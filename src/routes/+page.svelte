<script lang="ts">
	import { collection, FieldValue, onSnapshot, orderBy, query, QuerySnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { Parallax, ParallaxLayer } from 'svelte-parallax';
	import { DetectDeviceOrientation, type Orientation } from 'detect-device-orientation';
	import { scrollRef } from 'svelte-scrolling';
	import { Button, Carousel, Modal } from 'flowbite-svelte';
	import { homes, images, mains, map, rules } from '$lib/img';
	import pr from '$lib/img/pr.mp4';
	import { type EasingFunction } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	let index = 0;

	let pvModal = false;

	console.log(homes);

	const slide = Object.keys(homes).map((key) => {
		return {
			src: homes[key].default
		}
	});

	const points = [
		{
			name: 'neko',
			top: '8.3',
			left: '65',
			size: '30',
			rate: 0.2,
			turn: false,
			rotate: 0
		},
		{
			name: 'switch',
			top: '44',
			left: '5',
			size: '40',
			rate: 0.2,
			turn: false,
			rotate: -10
		},
		{
			name: 'gun',
			top: '15',
			left: '1',
			size: '40',
			rate: 0.9,
			turn: true,
			rotate: -10
		},
		{
			name: 'pen-case',
			top: '62',
			left: '60',
			size: '40',
			rate: 0.2,
			turn: false,
			rotate: 10
		},
		{
			name: 'textbook',
			top: '64',
			left: '5',
			size: '30',
			rate: 0.4,
			turn: false,
			rotate: 0
		},
		{
			name: 'basketball',
			top: '20',
			left: '30',
			size: '100',
			rate: 0.6,
			turn: false,
			rotate: 0
		},
		{
			name: 'lunch-box',
			top: '70',
			left: '-10',
			size: '60',
			rate: 0.4,
			turn: false,
			rotate: -10
		},
		{
			name: 'blackboard',
			top: '27',
			left: '-2',
			size: '50',
			rate: 0.7,
			turn: false,
			rotate: -8
		},
		{
			name: 'ribbon',
			top: '30',
			left: '60',
			size: '30',
			rate: 0.2,
			turn: false,
			rotate: 10
		},
		{
			name: 'neck-tie',
			top: '30',
			left: '15',
			size: '30',
			rate: 0.2,
			turn: false,
			rotate: -5
		},
		{
			name: 'eraser',
			top: '35',
			left: '60',
			size: '40',
			rate: 0.3,
			turn: false,
			rotate: 0
		},
		{
			name: 'pencil',
			top: '50',
			left: '65',
			size: '40',
			rate: 0.5,
			turn: false,
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
			top: '7%',
			left: '55',
			size: '110',
			rate: 0.1,
			rotate: 0
		},
		girl: {
			top: '7%',
			left: '55',
			size: '110',
			rate: 0.1,
			rotate: 0
		},
		mato: {
			top: '7%',
			left: '55',
			size: '110',
			rate: 0.1,
			rotate: 0
		},

		title: {
			top: '-2%',
			left: '48',
			size: '100',
			rate: 0.1,
			rotate: 0
		}
	};

	const rule = [
		{
			name: '1textbook',
			title: '朝',
			color: 'text-red-600',
			desc: '学校に持っていくべきもの'
		},
		{
			name: '2hiru',
			title: '昼',
			color: 'text-amber-600',
			desc: '書かれた問題が正しいもの'
		},
		{
			name: '3tmato',
			title: '夜',
			color: 'text-sky-800',
			desc: '目が黒い魂'
		},
		{
			top: '20%',
			left: 'calc(100vw - 180px)'
		},
		{
			top: '40%',
			left: '0%'
		},
		{
			top: '80%',
			left: '40%'
		}
	];

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

	type User = {
		id?: string;
		name: string;
		timestamp: FieldValue;
		score?: number;
	};

	let ranking: User[] = [];

	onSnapshot(query(collection(db, 'ranking'), orderBy('score', 'desc')), (snapshot: QuerySnapshot) => {
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

	$: if (ranking) {
		ranking.sort((a, b) => (b.score || 0) - (a.score || 0));
	}

	let imageX = 0;
	let imageY = 0;

	if (typeof window != 'undefined') {
		const width = window.innerWidth;

		if (width < 768) {
			let detectDeviceOrientation = new DetectDeviceOrientation();

			detectDeviceOrientation.init((orientation: Orientation) => {
				if (typeof document === 'undefined') return;
				imageX = orientation.gamma;
				imageY = orientation.beta;

				const imageIDs = ['boy', 'girl', 'mato', 'title'];
				imageIDs.forEach((id) => {
					const image = document.getElementById(id);
					if (!image) return;
					const z = parseInt(image.getAttribute('data-z') || '0');
					const img = image.querySelector('img');
					if (!z || !img) return;
					const oldX = parseInt(image.style.left);
					const oldY = parseInt(image.style.top);
					if (!oldX || !oldY) return;
					img.style.transform = `transform(${(oldX - imageX) * z}px, ${(oldY - imageY) * z}px)`;
				});
			});
		}
	}
</script>

<Modal title="クラスPV" bind:open={pvModal} autoclose>
	<p class="text-base leading-relaxed text-gray-500">
		クラスPVは、生徒会ラジオや、喬徳館ステージの休憩中に放送されます！
	</p>
	<div class="rounded-lg overflow-hidden">
		<video
			class="w-full"
			src={pr}
			controls
		>
			<track kind="captions" src={pr} />
		</video>
	</div>
	<svelte:fragment slot="footer">
		<Button on:click={() => pvModal = false}>閉じる</Button>
	</svelte:fragment>
</Modal>

<div class="absolute top-0 left-0 max-w-[400px] w-full h-full pointer-events-none z-20">
	<Parallax sections={points.length} config={{stiffness: 0.2, damping: 0.9}}>
		{#each Object.entries(images) as [path, src], i}
			<ParallaxLayer
				rate={points[i].rate}
				class="absolute z-10"
				style="top: {points[i].top}%; left: {points[i].left}%; width: {points[i].size}%; height: {points[i].size}%;"
			>
				<img src={src.default} alt={path}
						 class="drop-shadow-lg shadow-slate-900/80"
						 style="{points[i].turn ? 'transform: scale(-1, 1);' : ''} rotate: {points[i].rotate}deg;" />
			</ParallaxLayer>
		{/each}
	</Parallax>
</div>

<section class="w-full">
	<div class="h-[calc(100svh-60px)] lg:h-[calc(100svh-70px)] relative overflow-hidden w-full bg-sky-200 z-10">
		{#each Object.entries(mainp) as [key],i (key)}
			{#if key === 'title'}
				<div
					id={key}
					data-z={i}
					use:tween={{ animation: fly, duration: 1000, delay: 100 * i }}
					class="absolute w-full h-auto pt-[calc(100svh-(100%/sqrt(2))-115%)]"
					style="transform: translate(-50%, 0%); top: 0; left: {mainp[key].left}%; scale: {mainp[key].size}%; rotate: {mainp[key].rotate}deg;"
				>
					<img
						class="z-[2]"
						src={mains[key]}
						alt={key}
					/>
				</div>
			{:else}
				<div
					id={key}
					data-z={i}
					use:tween={{ animation: fly, duration: 1000, delay: 100 * i }}
					class="absolute w-full h-auto pt-[calc(100svh-(100%/sqrt(2))-105%)]"
					style="transform: translate(-50%, 0%); top: {mainp[key].top}; left: {mainp[key].left}%; scale: {mainp[key].size}%; rotate: {mainp[key].rotate}deg;"
				>
					<img
						class="z-[2]"
						src={mains[key]}
						alt={key}
					/>
				</div>
			{/if}
		{/each}
	</div>
	<div class="h-full w-full relative">
		<div
			class="home h-[calc(100svh-60px)] lg:h-[calc(100svh-70px)] w-full p-10 text-center items-center">
			<h1 use:scrollRef={'home'} class="text-4xl text-center pb-10 pt-[80px] before:bg-pink-200">
				Home
			</h1>
			<span />
			<span />
			<span />
			<p class="p-2 my-4 border-x-4 border-sky-50">
				「辰巳のアストロブラスター」は、ディズニーの とあるアトラクションから着想を得た
				「トロッコに乗って的を撃ち抜く」ゲームだ！
			</p>
			<p class="p-2 my-4 border-x-4 border-sky-50">
				情報科ならではの特別公式サイトや レーザーポインターを用いた本格的な射撃ギミック、
				さらにサイト内でリアルタイムで更新される順位表も存在！
			</p>
			<p class="p-2 my-4 border-x-4 border-sky-50">
				キミも「辰巳のアストロブラスター」に参加して歴史に名を刻め！
			</p>
			<p class="text-sm">
				※ safari 等のナビゲーションバーが動的に変化するブラウザでは正常に動作しない場合があります。<br>
				全画面表示でご覧ください。<br>
				<span class="text-xs">safari ゆるさん</span>
			</p>
		</div>
		<div
			class="relative h-[calc(100svh-60px+100px)] lg:h-[calc(100svh-70px+100px)] w-full p-10 text-center items-center">
			<h1 use:scrollRef={'rule'} class="text-4xl text-center pb-10 pt-[80px] before:bg-lime-200">
				Rule
			</h1>
			<div class="">
				<p class="py-2">
					コースは朝 → 昼 → 夜と切り替わっていき、朝は学校に行く前の準備、昼は学校での授業、夜は非日常的な学校の心霊風になっています。
				</p>
				<p class="py-2">
					それぞれの時間帯にある "正しい的" を撃ち抜きましょう！
				</p>
				<p class="marker text-lg py-6">
					<span>的は一個 100 点、</span>
					<br>
					<span>全部で 8 個隠れています！</span>
				</p>
			</div>
			<div class="grid grid-cols-3 gap-4">
				{#each Object.entries(rules) as [path, src], i}
					{#if i < 3}
						<div class="flex flex-col justify-between z-[2]">
							<p class="font-bold text-lg pb-2 {rule[i].color}">{rule[i].title}</p>
							<div class="rounded-lg bg-slate-800/40 h-full grid grid-rows-2 space-y-2 p-2 pt-4">
								<div class="flex justify-center items-center">
									<img src={src.default} alt={path} class="object-cover" />
								</div>
								<p class="text-slate-50 text-sm">
									{rule[i].desc}
								</p>
							</div>
						</div>
					{:else}
						<div class="absolute opacity-50 z-[0] mix-blend-soft-light"
								 style="top: {rule[i].top}; left: {rule[i].left};">
							<img src={src.default} alt={path} class="" />
						</div>
					{/if}
				{/each}
			</div>
			<p class="pt-5 font-bold">
				<span class="pr-2">HINT !</span> 的のすぐ下の穴をめがけて撃つと点が入るよ！
			</p>
		</div>
		<div class="w-full h-[calc(100svh-60px+400px)] lg:h-[calc(100svh-70px+400px)] relative">
			<h1 use:scrollRef={'about'} class="text-4xl text-center pb-10 pt-[80px] before:bg-amber-200">
				About
			</h1>
			<button
				type="button"
				tabindex="0"
				on:click={() => pvModal = true}
				class="w-[300px] absolute top-[12em] left-[-2em] rotate-[-6deg] flex flex-col cursor-pointer">
				<button
					class="rounded-lg overflow-hidden shadow-2xl shadow-slate-900/50">
					<video
						class="object-cover"
						src={pr}
						autoplay
						loop
						muted
						playsinline
					/>
				</button>
				<button class="text-center w-full font-black text-lg text-slate-50 z-10">
					クラスPVを公開中！<br>
					<span class="click">click me !</span>
				</button>
			</button>
			<div class="pt-[220px] px-4 space-y-10">
				<div class="flex flex-row justify-between gap-4">
					<div class="main">
						<img src={mains.main} alt="main" class="w-[150px] pt-[50px] rounded-full" />
					</div>
					<div class="flex flex-col pr-4 pt-5">
						<div class="fuKi">
							<p>予算がすごいことになったとかならなかったとか聞いたけど…？</p>
						</div>
						<div class="fuKi">
							<p>情報科ですから</p>
						</div>
					</div>
				</div>
				<div class="space-y-4 rotate-[2deg] px-5">
					<div class="slide">
						<Carousel images={slide} forward let:Indicators let:Controls bind:index>
							<Controls />
							<Indicators />
						</Carousel>
					</div>
					<p class="text-center text-lg font-bold pt-4">
						ドキドキとワクワクの冒険が<br>君を待っている！
					</p>
				</div>
			</div>
		</div>
		<div
			class="w-full h-[calc(100svh-60px+100px)] lg:h-[calc(100svh-70px+100px)] flex flex-col items-center">
			<h1 use:scrollRef={'scoreboard'} class="text-4xl text-center pb-10 pt-[80px] before:bg-blue-300">
				ScoreBoard
			</h1>
			{#if ranking}
				<div class="flex flex-col max-w-full w-full p-10 gap-4">
					<div class="l-border l-p-t l-p-r w-full l-p-b l-p-l"
							 style="border: 8px solid #b2771f; background: #247150; color: #ffffff; box-shadow: 2px 2px 4px #999999, 2px 2px 2px #004200 inset; padding: 15px;">
						{#each [0, 1, 2] as i}
							<div
								class="{i+1 === 1 ? 'text-amber-200' : i+1 === 2 ? 'text-slate-300' : 'text-amber-500'} flex flex-row items-end py-5 font-bold text-xl underline justify-between">
								<div>
									<p>{i + 1}位</p>
									<p class="flex items-center gap-1"><span
										class="inline-block max-w-[80px] truncate">{ranking[i]?.name}</span><span
										class="inline-block">さん</span></p>
								</div>
								<p>
									{#if ranking[i]?.score === 0}
										0 pt
									{:else}
										{ranking[i]?.score || "Error"} pt
									{/if}
								</p>
							</div>
						{/each}
						{#each [3, 4, 5, 6] as i}
							<div class="flex flex-row text-lg py-3 justify-between gap-2">
								<p class="flex items-center gap-1"><span
									class="inline-block max-w-[80px] truncate">{ranking[i]?.name}</span><span
									class="inline-block">さん</span></p>
								<p>
									{#if ranking[i]?.score === 0}
										0 pt
									{:else}
										{ranking[i]?.score || "Error"} pt
									{/if}
								</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
		<div class="w-full h-[calc(100svh-60px)] lg:h-[calc(100svh-70px)]">
			<h1 use:scrollRef={'access'} class="text-4xl text-center pb-10 pt-[80px] before:bg-emerald-300">
				Access
			</h1>
			<div class="w-full p-2 flex flex-col gap-6 justify-center items-center">
				<img src={map} alt="map">
				<p class="text-lg font-bold text-center">
					3階 304教室・J2A にて君を待つ！
				</p>
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
    h1 {
        position: relative;
        z-index: 1;
    }

    h1::before {
        content: '';
        position: absolute;
        bottom: 35px;
        left: 50%;
        width: 120px;
        height: 40px;
        transform: translateX(-50%) scale(1, -1) rotate(-2deg);
        clip-path: polygon(0 0, 80% 0, 100% 100%);
        opacity: 80%;
        z-index: -1;
    }

    .home {
        position: relative;
        z-index: 1;
    }

    .home span::before {
        content: '';
        position: absolute;
        opacity: 50%;
        z-index: -1;
    }

    .home span:nth-child(2)::before {
        top: 220px;
        left: 50px;
        clip-path: circle(50% at 50% 50%);
        @apply bg-emerald-200 w-[90px] h-[90px];
    }

    .home span:nth-child(3)::before {
        top: 350px;
        left: 220px;
        clip-path: inset(0, 0, 0, 0);
        transform: rotate(20deg);
        @apply bg-blue-300 w-[100px] h-[100px];
    }

    .home span:nth-child(4)::before {
        top: 500px;
        left: 100px;
        clip-path: polygon(0 0, 100% 0, 80% 100%);
        @apply bg-amber-300 w-20 h-20;
    }

    .marker span {
        position: relative;
        z-index: 1;

        &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 10px;
            bottom: 0;
            left: -5px;
            z-index: -1;
            @apply bg-red-300/60;
        }
    }

    .main {
        position: relative;
        z-index: 1;

        &::before {
            content: '';
            position: absolute;
            bottom: 15px;
            left: 10px;
            width: 140px;
            height: 140px;
            z-index: 0;
            @apply bg-sky-400 rounded-full;
        }
    }

    .main img {
        position: relative;
        z-index: 1;
    }

    .click {
        position: relative;

        &::before {
            content: "";
            position: absolute;
            top: 5px;
            left: -12px;
            width: 2px;
            height: 80%;
            z-index: 2;
            rotate: 20deg;
            @apply bg-sky-200;
        }

        &::after {
            content: "";
            position: absolute;
            top: 6px;
            right: -12px;
            width: 2px;
            height: 80%;
            z-index: 2;
            rotate: -20deg;
            @apply bg-sky-200;
        }
    }

    .fuKi {
        position: relative;
        display: inline-block;
        margin: 1em 0 1em 15px;
        padding: 7px 10px;
        width: 200px;
        color: #555;
        font-size: 16px;
        background: #FFF;
        border: solid 3px #555;
        box-sizing: border-box;
        border-radius: 10px;
        @apply w-[150px] sm:w-[200px];

        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: -24px;
            margin-top: -12px;
            border: 12px solid transparent;
            border-right: 12px solid #FFF;
            z-index: 2;
        }

        &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: -30px;
            margin-top: -14px;
            border: 14px solid transparent;
            border-right: 14px solid #555;
            z-index: 1;
        }
    }

    .fuKi p {
        margin: 0;
        padding: 0;
        z-index: 3;
    }

    .slide {
        position: relative;
        z-index: 1;

        &::before {
            content: '';
            position: absolute;
            z-index: 10;
            top: -0.5em;
            left: -1.5em;
            width: 100px;
            height: 30px;
            background-image: linear-gradient(-45deg, rgba(227, 155, 140, .4) 25%, transparent 25%, transparent 50%, rgba(227, 155, 140, .4) 50%, rgba(227, 155, 140, .4) 75%, transparent 75%, transparent 100%);
            background-size: 20px 20px;
            border-left: 2px dotted rgba(0, 0, 0, .1);
            border-right: 2px dotted rgba(0, 0, 0, .1);
            box-shadow: 0 0 5px rgba(0, 0, 0, .2);
            padding: 0.25em 2em;
            color: #65513f;
            transform: rotate(-20deg);
            @apply bg-slate-50/20;
        }

        &::after {
            content: '';
            position: absolute;
            z-index: 10;
            bottom: -0.5em;
            right: -1em;
            width: 100px;
            height: 30px;
            background-image: linear-gradient(-45deg, rgba(227, 155, 140, .4) 25%, transparent 25%, transparent 50%, rgba(227, 155, 140, .4) 50%, rgba(227, 155, 140, .4) 75%, transparent 75%, transparent 100%);
            background-size: 20px 20px;
            border-left: 2px dotted rgba(0, 0, 0, .1);
            border-right: 2px dotted rgba(0, 0, 0, .1);
            box-shadow: 0 0 5px rgba(0, 0, 0, .2);
            padding: 0.25em 2em;
            color: #65513f;
            transform: rotate(-20deg);
            @apply bg-slate-50/20;
        }
    }
</style>