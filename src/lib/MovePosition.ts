export  class MovePosition {
	alpha: number | null;
	beta: number | null;
	gamma: number | null;

	static layer_1 = document.getElementById('boy') as HTMLElement;
	static layer_2 = document.getElementById('girl') as HTMLElement;
	static layer_3 = document.getElementById('mato') as HTMLElement;
	static layer_4 = document.getElementById('title') as HTMLElement;

	constructor(alpha: number | null, beta: number | null, gamma: number | null) {
		this.alpha = alpha;
		this.beta = beta;
		this.gamma = gamma;
	}

	setImgPosition() {

		if (this.alpha === null || this.beta === null || this.gamma===null ){
			return;
		}

		let x = this.gamma;
		let y = this.beta;

		if (x > 90) {
			x = 90;
		}
		if (x < -90) {
			x = -90;
		}

		x =  Math.floor(x * Math.pow(10, 1)) / Math.pow(10, 1);
		y = Math.floor(y * Math.pow(10, 1)) / Math.pow(10, 1);

		this.setImages(y,x);
	}

	private setImages(y:number,x:number) {
		y = y /4;

		const pagePromise = new Promise(resolve => {
			MovePosition.layer_1.style.transform = `translate(${x}px, ${y /2}px)`;
			resolve("done");
		});

		pagePromise
			.then(()=>{
				setTimeout(() => {
					MovePosition.layer_2.style.transform = `translate(${x / 2}px, ${y / 3}px)`;
				}, 200);
			}).then(() => {
			setTimeout(() => {
				MovePosition.layer_3.style.transform = `translate(${x / 4}px, ${y / 4}px)`;
			}, 300);
		}).then(() => {
			setTimeout(() => {
				MovePosition.layer_4.style.transform = `translate(${x / 6}px, ${y / 6}px)`;
			}, 400);
		})



		const setYDom = document.getElementById('setY') as HTMLElement;
		setYDom.textContent = 'Y: '+y+'px';

		const setXDom = document.getElementById('setX') as HTMLElement;
		setXDom.textContent = 'X: '+x+'px';

	}
}