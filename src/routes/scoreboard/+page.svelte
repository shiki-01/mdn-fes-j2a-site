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
	import { Gallery, Card } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	type User = {
		id?: string;
		name: string;
		timestamp: FieldValue;
		score?: number;
	};

	let userName: string = '';
	let userScore: number = 0;
	let ranking: User[] | null = null;

	function addUser() {
		if (userName == '') return;
		const ranking: User = {
			name: userName,
			timestamp: serverTimestamp(),
			score: userScore
		};
		addDoc(collection(db, 'ranking'), ranking);
		userName = '';
	}

	function delUser(user: User) {
		if (!user.id) return;
		deleteDoc(doc(db, 'ranking', user.id));
	}

	onMount(() => {
		onSnapshot(
			query(collection(db, 'ranking'), orderBy('score', 'desc')),
			(snapshot: QuerySnapshot) => {
				ranking = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						name: data.name,
						timestamp: data.timestamp,
						score: data.score
					};
				});
			}
		);
	});

    let sortedRanking: User[] | null = null;

    $: if (ranking) {
    sortedRanking = [...ranking].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
</script>

<section class="container w-fit grid justify-center">
    {#if sortedRanking}
        <Card>
            <div class="flex p-4">
                <p>1.</p>
                <h1>{sortedRanking[0].name}</h1>
            </div>
            <div class="flex p-4">
                <p>score : </p>
                <h1>{sortedRanking[0].score}</h1>
            </div>
        </Card>
        <Card>
            <div class="flex p-4">
                <p>2.</p>
                <h1>{sortedRanking[1].name}</h1>
            </div>
            <div class="flex p-4">
                <p>score : </p>
                <h1>{sortedRanking[1].score}</h1>
            </div>
        </Card>
        <Card>
            <div class="flex p-4">
                <p>3.</p>
                <h1>{sortedRanking[2].name}</h1>
            </div>
            <div class="flex p-4">
                <p>score : </p>
                <h1>{sortedRanking[2].score}</h1>
            </div>
        </Card>
        {#each sortedRanking.slice(3) as user}
            <Card>
                <div class="flex p-4">
                    <p>{user.name}</p>
                </div>
                <div class="flex p-4">
                    <p>score : </p>
                    <h1>{user.score}</h1>
                </div>
            </Card>
        {/each}
    {/if}
</section>
