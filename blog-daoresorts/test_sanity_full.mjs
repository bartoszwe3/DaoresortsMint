import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'd547hmfr',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
});

async function test() {
    try {
        const query = `*[_type == "post"] { 
            title, 
            "slug": slug.current, 
            publishedAt,
            kategoria,
            excerpt,
            "hasBody": defined(body),
            "hasCover": defined(coverImage)
        }`;
        const posts = await client.fetch(query);
        console.log('--- SANITY DATA CHECK ---');
        console.log(JSON.stringify(posts, null, 2));
    } catch (err) {
        console.error('Error fetching from Sanity:', err.message);
    }
}

test();
