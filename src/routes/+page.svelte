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

	onSnapshot(
		query(collection(db, 'ranking'), orderBy('timestamp')),
		(snapshot: QuerySnapshot) => {
			ranking = snapshot.docs.map((doc) => {
				const data = doc.data();

				return {
					id: doc.id,
					name: data.name,
					timestamp: data.timestamp
				};
			});
		}
	);
</script>

<section class="container w-fit">
	<div>
		<h1>✅ ランキング</h1>
		<div>
			<input type="text" bind:value={userName} />
			<button on:click={addUser}>Add Item</button>
		</div>
		<ul>
			{#each ranking as user}
				<li>
					<p><span>✔</span><span>{user.name}</span></p>
					<button on:click={() => delUser(user)}>🗑️</button>
				</li>
			{/each}
		</ul>
	</div>
</section>
