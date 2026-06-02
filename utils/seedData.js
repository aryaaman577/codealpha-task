require('dotenv').config();

// Mock Mongoose with in-memory NeDB driver
const mockMongoose = require('../utils/mongoose-mock');
require('module')._cache[require.resolve('mongoose')] = {
  id: require.resolve('mongoose'),
  filename: require.resolve('mongoose'),
  loaded: true,
  exports: mockMongoose
};

const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    await User.deleteMany({});
    await Profile.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Follow.deleteMany({});
    console.log('✓ Cleared existing data');

    const users = [];
    const profiles = [];
    const posts = [];
    const comments = [];
    const follows = [];

    const userData = [
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Software engineer passionate about web development and open source.',
          location: 'San Francisco, CA',
          website: 'https://johndoe.dev',
          skills: ['JavaScript', 'Node.js', 'React', 'MongoDB']
        }
      },
      {
        username: 'janesmit',
        email: 'jane@example.com',
        password: 'password123',
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          bio: 'UI/UX designer creating beautiful and functional experiences.',
          location: 'New York, NY',
          website: 'https://janesmith.design',
          skills: ['UI Design', 'Figma', 'CSS', 'Design Systems']
        }
      },
      {
        username: 'mikebrown',
        email: 'mike@example.com',
        password: 'password123',
        profile: {
          firstName: 'Mike',
          lastName: 'Brown',
          bio: 'Full-stack developer and tech enthusiast. Love building scalable applications.',
          location: 'Austin, TX',
          skills: ['Python', 'Django', 'PostgreSQL', 'AWS']
        }
      },
      {
        username: 'sarahwilson',
        email: 'sarah@example.com',
        password: 'password123',
        profile: {
          firstName: 'Sarah',
          lastName: 'Wilson',
          bio: 'Product manager helping teams build amazing products.',
          location: 'Seattle, WA',
          website: 'https://sarahwilson.com',
          skills: ['Product Management', 'Agile', 'User Research']
        }
      },
      {
        username: 'alexchen',
        email: 'alex@example.com',
        password: 'password123',
        profile: {
          firstName: 'Alex',
          lastName: 'Chen',
          bio: 'DevOps engineer automating all the things. Cloud native enthusiast.',
          location: 'Los Angeles, CA',
          skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform']
        }
      }
    ];

    for (const data of userData) {
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: data.password
      });
      users.push(user);

      const profile = await Profile.create({
        user: user._id,
        ...data.profile,
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}&background=111827&color=fff&size=200`
      });
      profiles.push(profile);
    }

    console.log('✓ Created users and profiles');

    const postContents = [
      'Just launched my new portfolio website! Check it out and let me know what you think. 🚀',
      'Working on a new project using Node.js and MongoDB. Loving the developer experience!',
      'Anyone else excited about the latest tech trends? AI is changing everything!',
      'Just finished reading a great book on system design. Highly recommend it!',
      'Coffee and code - the perfect combination for a productive day ☕💻',
      'Attended an amazing tech conference today. So many inspiring talks!',
      'Finally solved that bug I\'ve been working on for hours. Best feeling ever!',
      'Looking for recommendations on the best VS Code extensions. What are your favorites?',
      'Just deployed my app to production. Fingers crossed everything works smoothly!',
      'Thinking about learning a new programming language. Any suggestions?'
    ];

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < 3; j++) {
        const post = await Post.create({
          user: users[i]._id,
          content: postContents[(i * 3 + j) % postContents.length],
          likesCount: Math.floor(Math.random() * 20),
          commentsCount: Math.floor(Math.random() * 10)
        });
        posts.push(post);
      }
    }

    console.log('✓ Created posts');

    const commentTexts = [
      'Great post! Thanks for sharing.',
      'This is really helpful, thank you!',
      'I completely agree with this.',
      'Interesting perspective!',
      'Would love to learn more about this.',
      'Thanks for the recommendation!',
      'This made my day!',
      'Awesome work!',
      'Keep it up!',
      'Really insightful.'
    ];

    for (let i = 0; i < posts.length; i++) {
      const numComments = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numComments; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const comment = await Comment.create({
          post: posts[i]._id,
          user: randomUser._id,
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)]
        });
        comments.push(comment);
      }
    }

    console.log('✓ Created comments');

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (i !== j && Math.random() > 0.4) {
          await Follow.create({
            follower: users[i]._id,
            following: users[j]._id
          });
        }
      }
    }

    console.log('✓ Created follow relationships');

    for (let i = 0; i < posts.length; i++) {
      const numLikes = Math.floor(Math.random() * users.length);
      const likedBy = [];
      for (let j = 0; j < numLikes; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!likedBy.includes(randomUser._id)) {
          likedBy.push(randomUser._id);
        }
      }
      posts[i].likes = likedBy;
      posts[i].likesCount = likedBy.length;
      await posts[i].save();
    }

    console.log('✓ Added likes to posts');

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('✓ Seed data created successfully!');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('Sample Credentials:');
    console.log('-------------------');
    userData.forEach(user => {
      console.log(`Email: ${user.email} | Password: password123`);
    });
    console.log('');

    if (require.main === module) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('✗ Seed error:', error);
    if (require.main === module) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

if (require.main === module) {
  seedData();
} else {
  module.exports = seedData;
}
