/**
 * Sample Data Seeder for TrackBuddy
 * 
 * This utility helps you quickly populate the app with sample data
 * to see how it works. Run this in the browser console.
 * 
 * Usage:
 * 1. Open the app in browser
 * 2. Open Developer Console (F12)
 * 3. Copy and paste this entire file
 * 4. Call: await seedSampleData()
 */

import { goalService } from '@/services/goalService';
import { timeLogService } from '@/services/timeLogService';
import { noteService } from '@/services/noteService';

export async function seedSampleData() {
  console.log('🌱 Seeding sample data...');

  try {
    // Create sample goals
    const learningGoal = await goalService.create({
      title: 'Learn Machine Learning',
      description: 'Master the fundamentals of ML including supervised and unsupervised learning',
      category: 'learning',
      weeklyHourTarget: 20,
      rules: [
        'Log 20 hours per week of learning',
        'Maintain digital notes for everything',
        'Complete at least 2 exercises per week'
      ],
      startDate: new Date('2025-01-01').toISOString(),
      isActive: true,
    });

    const projectGoal = await goalService.create({
      title: 'Build Portfolio Projects',
      description: 'Create projects to showcase on LinkedIn and resume',
      category: 'project',
      weeklyHourTarget: 15,
      rules: [
        '1 milestone project OR 3 small projects per month',
        'No 2 consecutive weeks without a project',
        'Every project must have proper documentation'
      ],
      startDate: new Date('2025-01-01').toISOString(),
      isActive: true,
    });

    const incomeGoal = await goalService.create({
      title: 'Freelance & Writing',
      description: 'Generate income through articles and freelance work',
      category: 'income',
      weeklyHourTarget: 5,
      rules: [
        'Log 5 hours per week',
        'Publish 1 Medium article every 2 weeks',
        'Apply to 3 freelance gigs per month'
      ],
      startDate: new Date('2025-01-01').toISOString(),
      isActive: true,
    });

    console.log('✅ Created 3 sample goals');

    // Create sample time logs
    const today = new Date();
    const logs = [];

    // Today's logs
    logs.push(
      await timeLogService.create({
        goalId: learningGoal.id,
        date: today.toISOString().split('T')[0],
        activity: 'Completed Python tutorial on Linear Regression',
        hoursSpent: 3.5,
        reflection: 'Great session! Finally understood gradient descent.',
      })
    );

    logs.push(
      await timeLogService.create({
        goalId: projectGoal.id,
        date: today.toISOString().split('T')[0],
        activity: 'Built REST API for weather app',
        hoursSpent: 2,
        reflection: 'Need to add authentication next.',
      })
    );

    // Yesterday's logs
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    logs.push(
      await timeLogService.create({
        goalId: learningGoal.id,
        date: yesterday.toISOString().split('T')[0],
        activity: 'Read research paper on Neural Networks',
        hoursSpent: 2.5,
      })
    );

    logs.push(
      await timeLogService.create({
        goalId: incomeGoal.id,
        date: yesterday.toISOString().split('T')[0],
        activity: 'Wrote Medium article on React hooks',
        hoursSpent: 1.5,
        reflection: 'Published! Hope it gets good engagement.',
      })
    );

    // 2 days ago
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    logs.push(
      await timeLogService.create({
        goalId: learningGoal.id,
        date: twoDaysAgo.toISOString().split('T')[0],
        activity: 'Worked through Kaggle competition',
        hoursSpent: 4,
      })
    );

    console.log(`✅ Created ${logs.length} sample time logs`);

    // Create sample notes
    const note1 = await noteService.create({
      title: 'Linear Regression Notes',
      content: `# Linear Regression Overview

## Key Concepts
- **Simple Linear Regression**: y = mx + b
- **Multiple Linear Regression**: y = b0 + b1x1 + b2x2 + ... + bnxn

## Cost Function
The Mean Squared Error (MSE):

\`\`\`
MSE = (1/n) * Σ(y_actual - y_predicted)²
\`\`\`

## Gradient Descent
Iteratively update parameters to minimize cost:
- α (alpha) = learning rate
- Update rule: θ = θ - α * ∂J/∂θ

## Python Implementation
\`\`\`python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
\`\`\`

## Resources
- [StatQuest YouTube](https://youtube.com/statquest)
- Andrew Ng's ML Course
`,
      linkedGoalIds: [learningGoal.id],
      linkedProjectNames: [],
      tags: ['machine-learning', 'statistics', 'python'],
    });

    const note2 = await noteService.create({
      title: 'REST API Best Practices',
      content: `# REST API Design Principles

## HTTP Methods
- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Update entire resource
- **PATCH**: Partial update
- **DELETE**: Remove resource

## Status Codes
- **200**: OK
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Server Error

## URL Structure
\`\`\`
GET    /api/users          # List all users
GET    /api/users/:id      # Get single user
POST   /api/users          # Create user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
\`\`\`

## Authentication
Use JWT tokens for stateless auth:
\`\`\`javascript
const token = jwt.sign({ userId: user.id }, SECRET_KEY);
\`\`\`

## Versioning
Include API version in URL: \`/api/v1/users\`
`,
      linkedGoalIds: [projectGoal.id],
      linkedProjectNames: ['Weather App'],
      linkedDate: today.toISOString().split('T')[0],
      tags: ['api', 'backend', 'nodejs', 'rest'],
    });

    const note3 = await noteService.create({
      title: 'Medium Writing Checklist',
      content: `# Article Writing Process

## Before Writing
- [ ] Choose a topic I'm passionate about
- [ ] Research existing articles
- [ ] Outline main points
- [ ] Identify target audience

## During Writing
- [ ] Start with compelling hook
- [ ] Use subheadings for structure
- [ ] Include code examples
- [ ] Add images/diagrams
- [ ] Write clear conclusion

## Before Publishing
- [ ] Proofread 2-3 times
- [ ] Check grammar with Grammarly
- [ ] Add relevant tags
- [ ] Create eye-catching cover image
- [ ] Write compelling subtitle

## After Publishing
- [ ] Share on LinkedIn
- [ ] Share on Twitter
- [ ] Engage with comments
- [ ] Track views and engagement

## Topics to Write About
1. React performance optimization
2. TypeScript best practices
3. Building a PWA from scratch
4. Data structures in JavaScript
5. My ML learning journey
`,
      linkedGoalIds: [incomeGoal.id],
      linkedProjectNames: [],
      tags: ['writing', 'medium', 'blogging', 'content-creation'],
    });

    console.log('✅ Created 3 sample notes');

    console.log('\n🎉 Sample data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Goals: 3`);
    console.log(`   - Time Logs: ${logs.length}`);
    console.log(`   - Notes: 3`);
    console.log('\nRefresh the page to see your data!');

    return {
      goals: [learningGoal, projectGoal, incomeGoal],
      logs,
      notes: [note1, note2, note3],
    };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Instructions for browser console usage
console.log(`
📝 To seed sample data:
1. Import this file in your app
2. Run: await seedSampleData()
3. Refresh the page

Or copy this file's content and paste into browser console!
`);
