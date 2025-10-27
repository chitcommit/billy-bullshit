#!/usr/bin/env tsx

/**
 * Billy Bullshit - Parallel Session Demo
 * 
 * This demo shows Billy working as a code review service
 * that responds to requests from other Claude Code sessions.
 * 
 * Run in one terminal while running shitcommit demo in another.
 */

import { ParallelSessionCoordinator } from '@chittyos/shared-state';
import { BillyAgent } from './src/billy-agent';

console.log('🔥 Billy Bullshit - Parallel Session Mode');
console.log('==========================================\n');

// Create coordinator
const coordinator = new ParallelSessionCoordinator('billy', {
  capabilities: ['code_review', 'bs_detection', 'pattern_analysis'],
  metadata: {
    version: '1.0.0',
    tagline: 'Calling BS on your BS code since 2024'
  }
});

console.log(`📋 Session ID: ${coordinator.getSessionInfo().session_id}`);
console.log('✅ Registered as Billy session');

// Discover other sessions
const sessions = coordinator.discoverSessions();
console.log(`\n🔍 Found ${sessions.length} other active sessions:`);
sessions.forEach(s => {
  console.log(`   - ${s.session_type} (${s.session_id.substring(0, 8)}...)`);
});

// Mock Billy Agent for demo (replace with actual BillyAgent)
async function reviewCode(code: string, language?: string): Promise<{
  bs_score: number;
  review: string;
  patterns: string[];
}> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simple BS detection
  let bs_score = 1;
  const patterns: string[] = [];

  if (code.includes('== true') || code.includes('== false')) {
    bs_score += 3;
    patterns.push('redundant_boolean_check');
  }

  if (code.match(/if.*{[\s\S]*return true[\s\S]*}.*else[\s\S]*{[\s\S]*return false/)) {
    bs_score += 4;
    patterns.push('redundant_if_else');
  }

  if (code.includes('any')) {
    bs_score += 2;
    patterns.push('typescript_any_type');
  }

  if (code.match(/ManagerHelperUtil|FactoryProvider/)) {
    bs_score += 3;
    patterns.push('cargo_cult_naming');
  }

  const review = `💩 BS Level: ${bs_score}/10\n\n` +
    (bs_score > 7 ? '🚩 CRITICAL BS DETECTED!\n' : '') +
    `Found ${patterns.length} BS patterns:\n` +
    patterns.map(p => `  - ${p}`).join('\n') +
    '\n\nThe fix: Write cleaner code, ya scrub.';

  return { bs_score, review, patterns };
}

// Listen for review requests
coordinator.on('review_requested', async (data) => {
  console.log(`\n📨 Code review requested: ${data.review_id}`);
  
  // Get pending reviews
  const pending = coordinator.getPendingReviews();
  console.log(`📊 ${pending.length} reviews in queue`);

  for (const review of pending) {
    // Try to claim it
    if (coordinator.claimReview(review.review_id)) {
      console.log(`\n🔍 Reviewing code (${review.language || 'unknown'})...`);
      
      // Process it
      const result = await reviewCode(review.code, review.language || undefined);
      
      console.log(`💩 BS Score: ${result.bs_score}/10`);
      console.log(`📋 Patterns found: ${result.patterns.join(', ')}`);
      
      // Complete it
      coordinator.completeReview(review.review_id, result);
      
      console.log(`✅ Review completed: ${review.review_id}`);
    }
  }
});

// Listen for other events
coordinator.on('learning_shared', (data) => {
  console.log(`\n📚 New learning shared: ${data.pattern_type} (confidence: ${data.confidence})`);
});

coordinator.on('music_requested', (data) => {
  console.log(`\n🎵 Music generation requested: ${data.track_id}`);
});

// Broadcast Billy is online
coordinator.broadcastEvent('billy_online', {
  message: 'Billy Bullshit is online and ready to call out your BS',
  capabilities: ['code_review', 'bs_detection']
});

console.log('\n🎧 Billy is listening for code review requests...');
console.log('💡 Run the ShitCommit demo in another terminal to send reviews\n');
console.log('Press Ctrl+C to exit\n');

// Keep alive
process.on('SIGINT', () => {
  console.log('\n\n👋 Billy signing off...');
  coordinator.broadcastEvent('billy_offline', {
    message: 'Billy out. Fix your shit.'
  });
  coordinator.terminate();
  process.exit(0);
});
