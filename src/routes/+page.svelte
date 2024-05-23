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

	type Item = {
		id?: string;
		name: string;
		timestamp: FieldValue;
	};

	let itemName: string = '';
	let wishList: Item[] = [];

	function addItem() {
		if (itemName == '') return;
		const item: Item = {
			name: itemName,
			timestamp: serverTimestamp()
		};
		addDoc(collection(db, 'wishlist'), item);
		itemName = '';
	}

	function delItem(item: Item) {
		if (!item.id) return;
		deleteDoc(doc(db, 'wishlist', item.id));
	}

	onSnapshot(
		query(collection(db, 'wishlist'), orderBy('timestamp', 'desc')),
		(snapshot: QuerySnapshot): any => {
			wishList = snapshot.docs.map((doc) => {
				const data = doc.data();
				const item: Item = {
					id: doc.id,
					name: data.name,
					timestamp: data.timestamp
				};
				return item;
			});
		}
	);
</script>

<section>
	<div>
		<h1>✅ Wish List</h1>
		<div>
			<input type="text" bind:value={itemName} />
			<button on:click={addItem}>Add Item</button>
		</div>
		<ul>
			{#each wishList as item}
				<li>
					<p><span>✔</span><span>{item.name}</span></p>
					<button on:click={() => delItem(item)}>🗑️</button>
				</li>
			{/each}
		</ul>
	</div>
</section>
