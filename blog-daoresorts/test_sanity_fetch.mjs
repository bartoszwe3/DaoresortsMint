import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'd547hmfr',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
});

async function test() {
    try {
        const query = `*[_type == "post"] { "slug": slug.current }`;
        const posts = await client.fetch(query);
        console.log('Found posts:', posts.length);
        console.log('Slugs:', posts.map(p => p.slug));
    } catch (err) {
        console.error('Error fetching from Sanity:', err.message);
    }
}

test();
