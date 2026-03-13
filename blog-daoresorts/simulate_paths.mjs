import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'd547hmfr',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
});

async function simulateGetStaticPaths() {
    console.log('--- SIMULATING Astro getStaticPaths ---');
    const query = `*[_type == "post"] {
        "slug": slug.current
    }`;
    const posts = await client.fetch(query);
    console.log('Fetch result:', JSON.stringify(posts, null, 2));

    const paths = posts.map((post) => ({
        params: { slug: post.slug },
    }));
    console.log('Generated paths:', JSON.stringify(paths, null, 2));
}

simulateGetStaticPaths();
