import { createClient } from '@sanity/client';

const sanityClient = createClient({
    projectId: 'd547hmfr',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function run() {
    try {
        const docs = await sanityClient.fetch(`*[] { _type, _id }`);
        console.log("Total docs:", docs.length);
        const types = {};
        for (const doc of docs) {
            types[doc._type] = (types[doc._type] || 0) + 1;
        }
        console.log("Document counts by type:", types);
        console.log("Post documents:", docs.filter(d => d._type === 'post'));
    } catch (err) {
        console.error("Sanity fetch error:", err);
    }
}
run();
