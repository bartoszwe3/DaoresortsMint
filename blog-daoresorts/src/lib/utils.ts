export function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD') // separate accents from characters
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/&/g, '-i-') // replace & with -i-
        .replace(/[^\w-]+/g, '') // remove all non-word chars
        .replace(/--+/g, '-'); // replace multiple - with single -
}
