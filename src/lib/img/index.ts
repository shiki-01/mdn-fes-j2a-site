const images: Record<string, { default: string }> = import.meta.glob('./*.png', { eager: true });

export default images;