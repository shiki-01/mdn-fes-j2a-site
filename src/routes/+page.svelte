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
	import { DetectDeviceOrientation, type Orientation } from 'detect-device-orientation';
	import { scrollRef } from 'svelte-scrolling';
	import { Carousel } from 'flowbite-svelte';
	import { images, mains, map } from '$lib/img';
	import pr from '$lib/img/pr.mp4';
	import { type EasingFunction } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	let index = 0;

	const slide = [
		{
			src: 'https://placehold.jp/300x150.png'
		},
		{
			src: 'https://placehold.jp/300x150.png'
		},
		{
			src: 'https://placehold.jp/300x150.png'
		},
		{
			src: 'https://placehold.jp/300x150.png'
		}
	];

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
			top: '33',
			left: '28',
			size: '45',
			rate: 0.2,
			turn: false,
			rotate: 0
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
			top: '49',
			left: '60',
			size: '40',
			rate: 0.2,
			turn: false,
			rotate: 10
		},
		{
			name: 'textbook',
			top: '46',
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
			top: '56',
			left: '-10',
			size: '60',
			rate: 0.4,
			turn: false,
			rotate: -10
		},
		{
			name: 'blackboard',
			top: '80',
			left: '50',
			size: '50',
			rate: 0.7,
			turn: false,
			rotate: 0
		},
		{
			name: 'ribbon',
			top: '19',
			left: '60',
			size: '30',
			rate: 0.2,
			turn: false,
			rotate: 10
		},
		{
			name: 'neck-tie',
			top: '19',
			left: '15',
			size: '30',
			rate: 0.2,
			turn: false,
			rotate: -5
		},
		{
			name: 'eraser',
			top: '24',
			left: '-5',
			size: '40',
			rate: 0.3,
			turn: false,
			rotate: 0
		},
		{
			name: 'pencil',
			top: '38',
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

<div class="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
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
		{/each}
	</div>
	<div class="h-full w-full relative">
		<div
			class="home h-[calc(100svh-60px)] lg:h-[calc(100svh-70px)] w-full p-10 sm:p-12 md:p-10 lg:p-[200px] text-center items-center">
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
		</div>
		<div class="w-full h-[calc(100svh-60px+400px)] lg:h-[calc(100svh-70px)] sm:p-12 lg:p-[200px] relative">
			<h1 use:scrollRef={'about'} class="text-4xl text-center pb-10 pt-[80px] before:bg-amber-200">
				About
			</h1>
			<div class="w-[300px] absolute top-[10em] right-[-4em] rotate-6 flex flex-col cursor-pointer">
				<div
					class="rounded-lg overflow-hidden shadow-2xl shadow-slate-900/50">
					<video
						class="object-cover"
						src={pr}
						autoplay
						loop
						muted
						playsinline
					/>
				</div>
				<p class="text-center font-black text-lg text-slate-50 z-10">
					クラスPVを公開中！<br>
					<span class="click">click me !</span>
				</p>
			</div>
			<div class="pt-[250px] px-4 space-y-10">
				<div class="flex flex-row gap-4">
					<div class="main">
						<img src={mains.main} alt="main" class="w-[150px] rounded-full" />
					</div>
					<div class="flex flex-col pr-4 pt-5">
						<div class="fuKi">
							<p>ここに何入れればいいかわかんないね！！！</p>
						</div>
						<div class="fuKi">
							<p>そうだね！！！</p>
						</div>
					</div>
				</div>
				<div class="max-w-4xl space-y-4 rotate-[-2deg] px-5">
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
		<div class="w-full h-[calc(100svh-60px)] lg:h-[calc(100svh-70px)] sm:p-12 lg:p-[200px] flex flex-col items-center">
			<h1 use:scrollRef={'scoreboard'} class="text-4xl text-center pb-10 pt-[80px] before:bg-blue-300">
				ScoreBoard
			</h1>
			{#if ranking}
				<div class="flex flex-col max-w-full p-10 gap-4">
					{#each [0, 1, 2] as i}
						<div class="flex flex-row justify-between truncate">
							<p>{ranking[i]?.name} さん</p>
							<p>{ranking[i]?.score || "Error"} pt</p>
						</div>
					{/each}
					{#each [3, 6] as i}
						<div class="grid grid-cols-2 gap-4">
							{#each [i, i + 1] as j}
								<div class="flex flex-row justify-between gap-2">
									<p class="truncate">{ranking[j]?.name || "Error"} さん</p>
									<p>{ranking[j]?.score || "Error"} pt</p>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<div class="w-full h-[calc(100svh-60px)] lg:h-[calc(100svh-70px)] sm:p-12 lg:p-[200px]">
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
            top: -1em;
            left: -1em;
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