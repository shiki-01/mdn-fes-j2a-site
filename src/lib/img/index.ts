const images: Record<string, { default: string }> = import.meta.glob('./back/*.png', { eager: true });

export default images;

import boy from './main/boy.png';
import girl from './main/girl.png';
import mato from './main/mato.png';
import main from './main/main.png';
import title from './main/title.png';

const mains: {[key: string]: string} = {
	boy: boy,
	girl: girl,
	mato: mato,
	main: main,
	title: title,
}
export { mains };