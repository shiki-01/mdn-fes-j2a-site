const images: Record<string, { default: string }> = import.meta.glob('./back/*.png', { eager: true });

const homes: Record<string, { default: string }> = import.meta.glob('./home/*.jpg', {
	eager: true
});

import boy from './main/boy.png';
import girl from './main/girl.png';
import mato from './main/mato.png';
import main from './main/main.png';
import title from './main/title.png';
import bg from './bg.png';
import map from './map.svg';

const mains: { [key: string]: string } = {
	boy: boy,
	girl: girl,
	mato: mato,
	main: main,
	title: title
};

const rules: Record<string, { default: string }> = import.meta.glob('./rule/*.png', { eager: true });

export { images, homes, mains, bg, map, rules };