export default {
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
        { name: 'title', title: 'Tytuł', type: 'string' },
        { name: 'slug', title: 'Slug URL', type: 'slug', options: { source: 'title' } },
        { name: 'excerpt', title: 'Krótki opis (SEO)', type: 'text', rows: 3 },
        { name: 'coverImage', title: 'Zdjęcie główne', type: 'image' },
        {
            name: 'kategoria', title: 'Kategoria', type: 'string',
            options: { list: ['Aktualności', 'Budowa', 'Web3 i NFT', 'Prawo i Finanse', 'Lifestyle'] }
        },
        { name: 'publishedAt', title: 'Data publikacji', type: 'datetime' },
        { name: 'author', title: 'Autor', type: 'string' },
        { name: 'body', title: 'Treść', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }
    ]
}
