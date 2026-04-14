// migrate_to_supabase.js
const fs = require('fs');
const path = require('path');
const supabase = require('./utils/supabase');

const FILE_USERS = path.join(__dirname, 'data/users.json');
const FILE_PROPOSALS = path.join(__dirname, 'data/proposals.json');

async function migrate() {
  console.log("🚀 Starting migration to Supabase...");

  // 1. Migrate Users
  if (fs.existsSync(FILE_USERS)) {
    const users = JSON.parse(fs.readFileSync(FILE_USERS, 'utf8'));
    console.log(`👥 Migrating ${users.length} users...`);
    
    for (const user of users) {
      const { error } = await supabase
        .from('dao_users')
        .upsert({
          email: user.email,
          wallet: user.wallet?.toLowerCase(),
          registered_at: user.registeredAt ? new Date(user.registeredAt).toISOString() : null,
          whitelisted: user.whitelisted || false,
          minted: user.minted || false,
          membership_token_id: user.membershipTokenId,
          photo_id: user.photoId,
          member_name: user.memberName,
          kyc_status: user.kycStatus || 'not_started',
          metadata: user // Store the whole object as backup/metadata
        }, { onConflict: 'wallet' });

      if (error) console.error(`❌ Error migrating user ${user.wallet}:`, error.message);
    }
  }

  // 2. Migrate Proposals & Votes
  if (fs.existsSync(FILE_PROPOSALS)) {
    const proposals = JSON.parse(fs.readFileSync(FILE_PROPOSALS, 'utf8'));
    console.log(`🗳️ Migrating ${proposals.length} proposals...`);

    for (const p of proposals) {
      const { error: pError } = await supabase
        .from('dao_proposals')
        .upsert({
          id: p.id,
          title_pl: p.title_pl || p.title,
          title_en: p.title_en,
          description_pl: p.description_pl || p.description,
          description_en: p.description_en,
          choices: p.choices || [],
          created_at: p.createdAt ? new Date(p.createdAt).toISOString() : null,
          end_time: p.endTime ? new Date(p.endTime).toISOString() : null,
          status_override: p.status_override,
          historical_votes: p.historicalVotesByChoice || {},
          historical_note: p.historicalNote_pl
        });

      if (pError) console.error(`❌ Error migrating proposal ${p.id}:`, pError.message);

      // Migrate individual votes
      if (p.votes && p.votes.length > 0) {
        console.log(`   └─ Migrating ${p.votes.length} votes for proposal #${p.id}...`);
        for (const v of p.votes) {
          const { error: vError } = await supabase
            .from('dao_votes')
            .upsert({
              proposal_id: p.id,
              wallet_address: v.walletAddress?.toLowerCase(),
              token_id: v.tokenId,
              choice: v.choice,
              voted_at: v.votedAt ? new Date(v.votedAt).toISOString() : null
            }, { onConflict: 'proposal_id,token_id' });
          
          if (vError) console.error(`   ❌ Error migrating vote for token ${v.tokenId}:`, vError.message);
        }
      }
    }
  }

  console.log("✅ Migration finished.");
}

migrate().catch(console.error);
