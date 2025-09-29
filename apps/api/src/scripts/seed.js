// ===============================
//  DATABASE SEED SCRIPT (seed.js)
// ===============================
// imatrix-website/apps/api/src/scripts/seed.js 

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@imatrix.lk';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log(`👤 Admin user: ${admin.email}`);

  // Create categories
  const categories = [
    { name: 'Biometric Systems', slug: 'biometric-systems' },
    { name: 'Access Control', slug: 'access-control' },
    { name: 'Time Attendance', slug: 'time-attendance' },
    { name: 'Security Solutions', slug: 'security-solutions' },
    { name: 'Company News', slug: 'company-news' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  console.log('📁 Categories created');

  // Create products based on scraped content
  const products = [
    {
      name: 'i4-AC05 Biometric Access Control Terminal',
      slug: 'i4-ac05-biometric-access-control',
      summary: 'Compact fingerprint and RFID based access control system with high speed scratch proof sensor',
      description: 'i4-AC05 is a compact and efficient stand-alone device for fingerprint and RFID based Access Control System with high speed scratch proof sensor and Color TFT Display for offices. Easy installation and flexibility of report generation make this system an ideal office automation tool for time management purposes.',
      specs: {
        capacity: '3000 fingerprint templates',
        transactions: '30000 transaction records',
        display: 'Color TFT Display',
        sensor: 'High speed scratch proof sensor',
        connectivity: 'TCP/IP, USB'
      },
      featured: true
    },
    {
      name: 'VF 780/380 Facial Recognition Terminal',
      slug: 'vf-780-380-facial-recognition',
      summary: 'Facial time attendance with access control system featuring ergonomic design',
      description: 'VF 780/380 features ergonomic design with facial recognition capability. Stores 200 facial templates with 3 inch touch screen display for easy operation.',
      specs: {
        capacity: '200 facial templates',
        display: '3 inch touch screen',
        recognition: 'Facial recognition technology',
        design: 'Ergonomic design'
      },
      featured: true
    },
    {
      name: 'i4 (HN-36-C) Biometric Time Attendance',
      slug: 'i4-hn-36-c-biometric-time-attendance',
      summary: 'Advanced biometric time attendance system with high capacity storage',
      description: 'Records up to 60000 transaction records with user capacity of 3000 identities. Advanced fingerprint recognition system for accurate time and attendance tracking.',
      specs: {
        transactions: '60000 transaction records',
        users: '3000 identities',
        technology: 'Advanced fingerprint recognition',
        connectivity: 'Multiple connectivity options'
      },
      featured: false
    },
    {
      name: 'Eagle-i PRO Home Alarm System',
      slug: 'eagle-i-pro-home-alarm',
      summary: 'Wireless home alarm system with GSM alerts and mobile app integration',
      description: 'Wireless Home Alarm systems with GSM based alert to 5 mobiles, complete with mobile app for remote monitoring and control.',
      specs: {
        connectivity: 'GSM based alerts',
        alerts: 'Up to 5 mobile numbers',
        app: 'Mobile app integration',
        type: 'Wireless system'
      },
      featured: false
    },
    {
      name: '7" Video Door Phone with Touch',
      slug: '7-inch-video-door-phone',
      summary: '7 inch touch display video door phone with mobile connectivity',
      description: '7 inch Touch Display video door phone that connects to your mobile via landline, with TV output and support for 4 CCTV camera inputs.',
      specs: {
        display: '7 inch touch display',
        connectivity: 'Mobile via landline',
        cameras: '4 CCTV camera inputs',
        output: 'TV output capability'
      },
      featured: false
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product
    });
  }

  console.log('📦 Products created');

  // Create solutions
  const solutions = [
    {
      name: 'Access Control + Attendance Solution',
      slug: 'access-control-attendance',
      description: 'Connect doors, turnstiles, and biometric terminals for policy-driven access and accurate timekeeping.',
      benefits: [
        'Role-based permissions & holiday calendars',
        'Shift & roster management',
        'Payroll-ready exports',
        'Real-time monitoring'
      ],
      features: [
        'Multi-door access control',
        'Biometric integration',
        'Time attendance tracking',
        'Report generation'
      ]
    },
    {
      name: 'CCTV with AI Analytics',
      slug: 'cctv-ai-analytics',
      description: 'Detect events that matter—people, vehicles, line crossing—and alert teams in real time, on any device.',
      benefits: [
        'Smart motion & perimeter protection',
        'VMS dashboards & remote playback',
        'Scalable NVR/storage options',
        'Real-time alerts'
      ],
      features: [
        'AI-powered analytics',
        'People counting',
        'Line crossing detection',
        'Remote monitoring'
      ]
    },
    {
      name: 'Guard Patrolling Systems',
      slug: 'guard-patrolling-systems',
      description: 'RFID and Touch-based guard tour systems for comprehensive security monitoring.',
      benefits: [
        'Real-time guard tracking',
        'Route verification',
        'Incident reporting',
        'GPS integration'
      ],
      features: [
        'RFID checkpoints',
        'Touch-based reporting',
        'Mobile app support',
        'Automated alerts'
      ]
    }
  ];

  for (const solution of solutions) {
    await prisma.solution.upsert({
      where: { slug: solution.slug },
      update: {},
      create: solution
    });
  }

  console.log('🛠️ Solutions created');

  // Create sample downloads
  const downloads = [
    {
      title: 'i4-AC05 User Manual',
      fileUrl: '/uploads/manuals/i4-ac05-manual.pdf',
      fileName: 'i4-ac05-manual.pdf',
      kind: 'manual'
    },
    {
      title: 'TrackZone Software v2.1',
      fileUrl: '/uploads/software/trackzone-v2.1.zip',
      fileName: 'trackzone-v2.1.zip',
      kind: 'software'
    },
    {
      title: 'Product Catalog 2024',
      fileUrl: '/uploads/brochures/catalog-2024.pdf',
      fileName: 'catalog-2024.pdf',
      kind: 'brochure'
    },
    {
      title: 'Installation Guide',
      fileUrl: '/uploads/manuals/installation-guide.pdf',
      fileName: 'installation-guide.pdf',
      kind: 'manual'
    }
  ];

  for (const download of downloads) {
    // Check if download already exists by title
    const existing = await prisma.download.findFirst({
      where: { title: download.title }
    });
    
    if (!existing) {
      await prisma.download.create({
        data: download
      });
    }
  }

  console.log('📥 Downloads created');

  // Create sample posts
  const posts = [
    {
      title: 'Welcome to I-Matrix Solutions',
      slug: 'welcome-to-imatrix-solutions',
      body: `<p>I-Matrix Solution was set up in the year 2006, as a proprietary concern with the prime objective of developing and giving solutions for Attendance Management System.</p>
             <p>Soon I-Matrix solution became a trusted name in Time Management and Access Control Systems as the solutions and services we provided were far beyond the customer's requirements.</p>`,
      excerpt: 'I-Matrix Solution was established in 2006 to provide innovative attendance management solutions.',
      published: true
    },
    {
      title: 'Latest Biometric Technology Trends',
      slug: 'latest-biometric-technology-trends',
      body: `<p>The biometric technology landscape continues to evolve with new innovations in facial recognition, fingerprint scanning, and access control systems.</p>
             <p>Our latest solutions incorporate AI-powered analytics for enhanced security and user experience.</p>`,
      excerpt: 'Exploring the latest trends in biometric technology and AI-powered security solutions.',
      published: true
    }
  ];

  const timeAttendanceCategory = await prisma.category.findFirst({
    where: { slug: 'time-attendance' }
  });

  for (const post of posts) {
    const createdPost = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        categories: {
          connect: [{ id: timeAttendanceCategory.id }]
        }
      }
    });
  }

  console.log('📝 Posts created');

  console.log('🎉 Seed completed successfully!');
  console.log(`📧 Admin login: ${adminEmail}`);
  console.log(`🔑 Admin password: ${adminPassword}`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });