import { randomUUID } from 'node:crypto';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, RoleName } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

const roles: RoleName[] = [RoleName.STUDENT, RoleName.INTERN, RoleName.INSTRUCTOR, RoleName.MENTOR, RoleName.ADMIN];

const permissions = [
  'user:create',
  'user:view',
  'user:edit',
  'user:delete',
  'user:suspend',
  'user:restore',
  'student:view',
  'student:manage',
  'student:suspend',
  'student:restore',
  'course:create',
  'course:view',
  'course:edit',
  'course:delete',
  'course:publish',
  'course:unpublish',
  'course:manage',
  'instructor:view',
  'instructor:manage',
  'instructor:approve',
  'enrollment:view',
  'enrollment:manage',
  'payment:view',
  'payment:manage',
  'payment:refund',
  'certificate:view',
  'certificate:issue',
  'certificate:revoke',
  'internship:create',
  'internship:view',
  'internship:edit',
  'internship:delete',
  'internship:manage',
  'application:view',
  'application:manage',
  'application:approve',
  'application:reject',
  'assessment:create',
  'assessment:view',
  'assessment:edit',
  'assessment:manage',
  'assessment:review',
  'intern:view',
  'intern:manage',
  'mentor:view',
  'mentor:manage',
  'mentor:assign',
  'task:create',
  'task:view',
  'task:edit',
  'task:delete',
  'task:review',
  'project:create',
  'project:view',
  'project:manage',
  'project:review',
  'reports:view',
  'reports:manage',
  'notification:view',
  'notification:manage',
  'settings:view',
  'settings:manage',
  'audit:view',
] as const;

const rolePermissions: Record<RoleName, readonly string[]> = {
  STUDENT: [
    'course:view',
    'enrollment:view',
    'enrollment:manage',
    'certificate:view',
    'internship:view',
    'application:view',
    'assessment:view',
    'task:view',
    'project:view',
    'notification:view',
    'settings:view',
  ],
  INTERN: [
    'internship:view',
    'intern:view',
    'task:view',
    'task:edit',
    'project:view',
    'project:manage',
    'assessment:view',
    'application:view',
    'notification:view',
  ],
  INSTRUCTOR: [
    'course:create',
    'course:view',
    'course:edit',
    'course:manage',
    'course:publish',
    'course:unpublish',
    'student:view',
    'student:manage',
    'enrollment:view',
    'enrollment:manage',
    'assessment:create',
    'assessment:view',
    'assessment:edit',
    'assessment:manage',
    'assessment:review',
    'certificate:view',
    'certificate:issue',
    'notification:view',
    'reports:view',
  ],
  MENTOR: [
    'intern:view',
    'intern:manage',
    'mentor:view',
    'mentor:manage',
    'mentor:assign',
    'task:create',
    'task:view',
    'task:edit',
    'task:delete',
    'task:review',
    'project:view',
    'project:manage',
    'project:review',
    'assessment:view',
    'assessment:review',
    'internship:view',
    'application:view',
    'notification:view',
  ],
  ADMIN: permissions,
};

async function ensureUserWithRoles(input: { email: string; name: string; roles: RoleName[] }) {
  const user = await prisma.user.upsert({
    where: { email: input.email },
    update: {
      name: input.name,
      status: 'ACTIVE',
    },
    create: {
      id: randomUUID(),
      email: input.email,
      name: input.name,
      status: 'ACTIVE',
    },
  });

  for (const roleName of input.roles) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: role.id,
      },
    });
  }

  return user;
}

async function ensureCourseCategory(name: string, slug: string, description?: string) {
  return prisma.courseCategory.upsert({
    where: { name },
    update: { slug, description: description ?? null },
    create: {
      name,
      slug,
      description,
    },
  });
}

async function ensureCourseCategoryRelations() {
  const categories = [
    { name: 'Web Development', slug: 'web-development', description: 'Frontend, backend, and full-stack product engineering.' },
    { name: 'Data Science', slug: 'data-science', description: 'Analytics, AI, and machine learning workflows.' },
    { name: 'Design', slug: 'design', description: 'Interface and user experience design systems.' },
    { name: 'Marketing', slug: 'marketing', description: 'Digital growth, brand, and campaign strategy.' },
    { name: 'Mobile Development', slug: 'mobile-development', description: 'Cross-platform and native mobile product development.' },
  ];

  return Promise.all(
    categories.map(({ name, slug, description }) => ensureCourseCategory(name, slug, description)),
  );
}

async function ensureCourse(input: {
  slug: string;
  title: string;
  description: string;
  categoryName: string;
  createdById: string;
  price: number;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
}) {
  const category = await prisma.courseCategory.findUniqueOrThrow({ where: { name: input.categoryName } });

  const course = await prisma.course.upsert({
    where: { slug: input.slug },
    update: {
      title: input.title,
      description: input.description,
      categoryId: category.id,
      createdById: input.createdById,
      price: input.price,
      status: input.status,
    },
    create: {
      slug: input.slug,
      title: input.title,
      description: input.description,
      categoryId: category.id,
      createdById: input.createdById,
      price: input.price,
      status: input.status,
    },
  });

  return course;
}

async function ensureCourseInstructor(courseId: string, instructorId: string) {
  await prisma.courseInstructor.upsert({
    where: {
      courseId_instructorId: {
        courseId,
        instructorId,
      },
    },
    update: {},
    create: {
      courseId,
      instructorId,
    },
  });
}

async function ensureEnrollment(input: {
  userId: string;
  courseId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  enrolledAt: Date;
  completedAt?: Date | null;
}) {
  return prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: input.userId,
        courseId: input.courseId,
      },
    },
    update: {
      status: input.status,
      enrolledAt: input.enrolledAt,
      completedAt: input.completedAt ?? null,
    },
    create: {
      userId: input.userId,
      courseId: input.courseId,
      status: input.status,
      enrolledAt: input.enrolledAt,
      completedAt: input.completedAt ?? null,
    },
  });
}

async function ensureCourseProgress(input: {
  userId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  completedAt?: Date | null;
}) {
  await prisma.courseProgress.upsert({
    where: {
      userId_courseId: {
        userId: input.userId,
        courseId: input.courseId,
      },
    },
    update: {
      completedLessons: input.completedLessons,
      totalLessons: input.totalLessons,
      progressPercent: input.progressPercent,
      completedAt: input.completedAt ?? null,
    },
    create: {
      userId: input.userId,
      courseId: input.courseId,
      completedLessons: input.completedLessons,
      totalLessons: input.totalLessons,
      progressPercent: input.progressPercent,
      completedAt: input.completedAt ?? null,
    },
  });
}

async function ensureCertificate(input: {
  userId: string;
  courseId: string;
  enrollmentId: string | null;
  certificateNumber: string;
  issuedAt: Date;
}) {
  await prisma.certificate.upsert({
    where: { certificateNumber: input.certificateNumber },
    update: {
      userId: input.userId,
      courseId: input.courseId,
      enrollmentId: input.enrollmentId,
      issuedAt: input.issuedAt,
    },
    create: {
      userId: input.userId,
      courseId: input.courseId,
      enrollmentId: input.enrollmentId,
      certificateNumber: input.certificateNumber,
      issuedAt: input.issuedAt,
    },
  });
}

async function ensurePayment(input: {
  userId: string;
  courseId: string | null;
  programId: string | null;
  reference: string;
  amount: number;
  currency: string;
  provider: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  paidAt?: Date | null;
}) {
  await prisma.payment.upsert({
    where: { reference: input.reference },
    update: {
      userId: input.userId,
      courseId: input.courseId,
      programId: input.programId,
      amount: input.amount,
      currency: input.currency,
      provider: input.provider,
      status: input.status,
      paidAt: input.paidAt ?? null,
    },
    create: {
      userId: input.userId,
      courseId: input.courseId,
      programId: input.programId,
      reference: input.reference,
      amount: input.amount,
      currency: input.currency,
      provider: input.provider,
      status: input.status,
      paidAt: input.paidAt ?? null,
    },
  });
}

async function ensureInternshipProgram(input: {
  slug: string;
  name: string;
  duration: string;
  price: number;
  assessmentFee: number;
  description: string;
  features: string[];
  requirements: string[];
  certificateEligibility: string;
  companyPlacement: boolean;
  mentorAvailability: boolean;
  communityAvailability: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'DISABLED';
}) {
  return prisma.internshipProgram.upsert({
    where: { slug: input.slug },
    update: {
      name: input.name,
      duration: input.duration,
      price: input.price,
      assessmentFee: input.assessmentFee,
      description: input.description,
      features: input.features,
      requirements: input.requirements,
      certificateEligibility: input.certificateEligibility,
      companyPlacement: input.companyPlacement,
      mentorAvailability: input.mentorAvailability,
      communityAvailability: input.communityAvailability,
      status: input.status,
    },
    create: {
      slug: input.slug,
      name: input.name,
      duration: input.duration,
      price: input.price,
      assessmentFee: input.assessmentFee,
      description: input.description,
      features: input.features,
      requirements: input.requirements,
      certificateEligibility: input.certificateEligibility,
      companyPlacement: input.companyPlacement,
      mentorAvailability: input.mentorAvailability,
      communityAvailability: input.communityAvailability,
      status: input.status,
    },
  });
}

async function seedInternshipAssessmentData() {
  const internshipPrograms = await Promise.all([
    ensureInternshipProgram({
      slug: 'product-design-internship',
      name: 'Product Design Internship',
      duration: '8 weeks',
      price: 250000,
      assessmentFee: 25000,
      description: 'A design-focused internship for product thinking, wireframes, and user research.',
      features: ['User research labs', 'Portfolio reviews', 'Mentor feedback'],
      requirements: ['Basic design samples', 'Interest in product thinking'],
      certificateEligibility: 'Active completion and final portfolio review',
      companyPlacement: true,
      mentorAvailability: true,
      communityAvailability: true,
      status: 'PUBLISHED',
    }),
    ensureInternshipProgram({
      slug: 'software-development-internship',
      name: 'Software Development Internship',
      duration: '10 weeks',
      price: 350000,
      assessmentFee: 35000,
      description: 'An engineering internship focused on frontend, backend, and product delivery fundamentals.',
      features: ['Live coding labs', 'Capstone project', 'Code review sessions'],
      requirements: ['Basic programming interest', 'Comfort with written problem solving'],
      certificateEligibility: 'Pass all project milestones and final assessment',
      companyPlacement: true,
      mentorAvailability: true,
      communityAvailability: true,
      status: 'PUBLISHED',
    }),
  ]);

  const cohortBlueprints = [
    {
      slug: 'software-development-november-cohort',
      name: 'Software Development November Cohort',
      programSlug: 'software-development-internship',
      description: 'Core engineering cohort focused on frontend build, backend logic, and capstone delivery.',
      startDate: new Date('2026-11-09T00:00:00.000Z'),
      endDate: new Date('2026-12-18T00:00:00.000Z'),
      status: 'UPCOMING' as const,
    },
    {
      slug: 'product-design-september-cohort',
      name: 'Product Design September Cohort',
      programSlug: 'product-design-internship',
      description: 'Design sprint cohort covering research, UX flows, visual systems, and portfolio polishing.',
      startDate: new Date('2026-09-14T00:00:00.000Z'),
      endDate: new Date('2026-10-23T00:00:00.000Z'),
      status: 'ACTIVE' as const,
    },
    {
      slug: 'software-development-august-cohort',
      name: 'Software Development August Cohort',
      programSlug: 'software-development-internship',
      description: 'Completed engineering cohort for early-stage application building and team-based delivery.',
      startDate: new Date('2026-08-03T00:00:00.000Z'),
      endDate: new Date('2026-09-11T00:00:00.000Z'),
      status: 'COMPLETED' as const,
    },
  ] as const;

  for (const blueprint of cohortBlueprints) {
    const program = internshipPrograms.find((entry) => entry.slug === blueprint.programSlug);
    if (!program) continue;

    await prisma.internshipCohort.upsert({
      where: { slug: blueprint.slug },
      update: {
        name: blueprint.name,
        description: blueprint.description,
        programId: program.id,
        startDate: blueprint.startDate,
        endDate: blueprint.endDate,
        status: blueprint.status,
      },
      create: {
        name: blueprint.name,
        slug: blueprint.slug,
        description: blueprint.description,
        programId: program.id,
        startDate: blueprint.startDate,
        endDate: blueprint.endDate,
        status: blueprint.status,
      },
    });
  }

  const assessmentBlueprints = [
    {
      programSlug: 'software-development-internship',
      title: 'Software Development Entrance Exam',
      description: 'Select the correct answer for each MCQ. This exam is objective and auto-graded.',
      passingScore: 70,
      questions: [
        {
          prompt: 'Which JavaScript keyword creates a block-scoped variable?',
          options: ['var', 'let', 'function', 'const'],
          correctIndex: 1,
        },
        {
          prompt: 'What does HTML primarily structure?',
          options: ['Styling', 'Content layout', 'Database queries', 'Server responses'],
          correctIndex: 1,
        },
        {
          prompt: 'Which of these is a common method for handling async work in JavaScript?',
          options: ['forEach', 'Promise', 'alert', 'document.write'],
          correctIndex: 1,
        },
      ],
    },
    {
      programSlug: 'product-design-internship',
      title: 'Product Design Entrance Exam',
      description: 'Choose the best answer for each multiple-choice design scenario.',
      passingScore: 70,
      questions: [
        {
          prompt: 'Which activity best supports user-centered design?',
          options: ['Randomized feature release', 'User interviews and usability testing', 'Long-form documentation only', 'Skipping iteration'],
          correctIndex: 1,
        },
        {
          prompt: 'A design system is primarily meant to improve:',
          options: ['Visual consistency and scaling', 'Back-end storage', 'Database indexing', 'Cross-browser security'],
          correctIndex: 0,
        },
        {
          prompt: 'Which metric best reflects usability?',
          options: ['Bounce rate', 'Completion rate', 'Weekly payroll', 'Server uptime'],
          correctIndex: 1,
        },
      ],
    },
  ] as const;

  for (const blueprint of assessmentBlueprints) {
    const program = internshipPrograms.find((entry) => entry.slug === blueprint.programSlug);
    if (!program) continue;

    const assessment = await prisma.internshipAssessment.findFirst({
      where: { programId: program.id, title: blueprint.title },
    });

    const targetAssessment = assessment ?? await prisma.internshipAssessment.create({
      data: {
        programId: program.id,
        title: blueprint.title,
        description: blueprint.description,
        passingScore: blueprint.passingScore,
      },
    });

    await prisma.assessmentQuestion.deleteMany({ where: { assessmentId: targetAssessment.id } });

    for (const [index, question] of blueprint.questions.entries()) {
      await prisma.assessmentQuestion.create({
        data: {
          assessmentId: targetAssessment.id,
          prompt: question.prompt,
          order: index,
          options: {
            createMany: {
              data: question.options.map((optionText, optionIndex) => ({
                optionText,
                order: optionIndex,
                isCorrect: optionIndex === question.correctIndex,
              })),
            },
          },
        },
      });
    }
  }
}

async function seedDevelopmentData() {
  const now = new Date();

  const adminUser = await ensureUserWithRoles({
    email: 'admin@grouhacademy.dev',
    name: 'Grouh Admin',
    roles: [RoleName.ADMIN],
  });

  const instructorUsers = await Promise.all([
    ensureUserWithRoles({ email: 'sarah.johnson@grouhacademy.dev', name: 'Sarah Johnson', roles: [RoleName.INSTRUCTOR] }),
    ensureUserWithRoles({ email: 'david.miller@grouhacademy.dev', name: 'David Miller', roles: [RoleName.INSTRUCTOR] }),
    ensureUserWithRoles({ email: 'jessie.cooper@grouhacademy.dev', name: 'Jessie Cooper', roles: [RoleName.INSTRUCTOR] }),
    ensureUserWithRoles({ email: 'alex.rivers@grouhacademy.dev', name: 'Alex Rivers', roles: [RoleName.INSTRUCTOR] }),
  ]);

  const studentUsers = await Promise.all([
    ensureUserWithRoles({ email: 'emma.thompson@grouhacademy.dev', name: 'Emma Thompson', roles: [RoleName.STUDENT] }),
    ensureUserWithRoles({ email: 'james.wilson@grouhacademy.dev', name: 'James Wilson', roles: [RoleName.STUDENT] }),
    ensureUserWithRoles({ email: 'sofia.rodriguez@grouhacademy.dev', name: 'Sofia Rodriguez', roles: [RoleName.STUDENT] }),
    ensureUserWithRoles({ email: 'liam.chen@grouhacademy.dev', name: 'Liam Chen', roles: [RoleName.STUDENT] }),
    ensureUserWithRoles({ email: 'olivia.patel@grouhacademy.dev', name: 'Olivia Patel', roles: [RoleName.STUDENT] }),
    ensureUserWithRoles({ email: 'noah.kim@grouhacademy.dev', name: 'Noah Kim', roles: [RoleName.STUDENT] }),
    ensureUserWithRoles({ email: 'ava.martinez@grouhacademy.dev', name: 'Ava Martinez', roles: [RoleName.STUDENT] }),
    ensureUserWithRoles({ email: 'ethan.brooks@grouhacademy.dev', name: 'Ethan Brooks', roles: [RoleName.STUDENT] }),
  ]);

  await ensureCourseCategoryRelations();

  const courseDefinitions = [
    { slug: 'web-development', title: 'Web Development', description: 'Build modern web interfaces and systems with industry-standard tooling.', categoryName: 'Web Development', createdById: adminUser.id, price: 299, status: 'PUBLISHED' },
    { slug: 'data-science-fundamentals', title: 'Data Science Fundamentals', description: 'Explore data analysis, modelling, and experimentation techniques.', categoryName: 'Data Science', createdById: adminUser.id, price: 199, status: 'PUBLISHED' },
    { slug: 'ui-ux-design-mastery', title: 'UI/UX Design Mastery', description: 'Design polished, accessible, conversion-focused user journeys.', categoryName: 'Design', createdById: adminUser.id, price: 299, status: 'PUBLISHED' },
    { slug: 'python-programming', title: 'Python Programming', description: 'Learn practical Python skills for automation, data tasks, and backend workflows.', categoryName: 'Web Development', createdById: adminUser.id, price: 199, status: 'PUBLISHED' },
    { slug: 'digital-marketing', title: 'Digital Marketing', description: 'Grow products through content strategy, campaigns, and analytics.', categoryName: 'Marketing', createdById: adminUser.id, price: 99, status: 'PUBLISHED' },
    { slug: 'machine-learning', title: 'Machine Learning', description: 'A practical introduction to algorithms, evaluation, and productization.', categoryName: 'Data Science', createdById: adminUser.id, price: 399, status: 'PUBLISHED' },
    { slug: 'ios-app-development', title: 'iOS App Development', description: 'Build user-friendly iOS products with Swift and modern app architecture.', categoryName: 'Mobile Development', createdById: adminUser.id, price: 299, status: 'PUBLISHED' },
    { slug: 'advanced-react', title: 'Advanced React', description: 'Master patterns for maintainable, scalable React applications.', categoryName: 'Web Development', createdById: adminUser.id, price: 199, status: 'PUBLISHED' },
  ] as const;

  const courses = await Promise.all(
    courseDefinitions.map((input) => ensureCourse(input)),
  );

  const courseBySlug = new Map(courses.map((course) => [course.slug, course]));

  const instructorAssignmentMap: Record<string, string[]> = {
    'web-development': [instructorUsers[0].id],
    'data-science-fundamentals': [instructorUsers[1].id],
    'ui-ux-design-mastery': [instructorUsers[2].id],
    'python-programming': [instructorUsers[0].id],
    'digital-marketing': [instructorUsers[3].id],
    'machine-learning': [instructorUsers[1].id],
    'ios-app-development': [instructorUsers[2].id],
    'advanced-react': [instructorUsers[0].id],
  };

  for (const [slug, instructorIds] of Object.entries(instructorAssignmentMap)) {
    const course = courseBySlug.get(slug);
    if (!course) continue;

    for (const instructorId of instructorIds) {
      await ensureCourseInstructor(course.id, instructorId);
    }
  }

  const enrollmentSeed = [
    { email: 'emma.thompson@grouhacademy.dev', courseSlug: 'web-development', status: 'ACTIVE', daysAgo: 2 },
    { email: 'james.wilson@grouhacademy.dev', courseSlug: 'data-science-fundamentals', status: 'ACTIVE', daysAgo: 12 },
    { email: 'sofia.rodriguez@grouhacademy.dev', courseSlug: 'ui-ux-design-mastery', status: 'PENDING', daysAgo: 24 },
    { email: 'liam.chen@grouhacademy.dev', courseSlug: 'python-programming', status: 'COMPLETED', daysAgo: 32 },
    { email: 'olivia.patel@grouhacademy.dev', courseSlug: 'digital-marketing', status: 'CANCELLED', daysAgo: 45 },
    { email: 'noah.kim@grouhacademy.dev', courseSlug: 'machine-learning', status: 'ACTIVE', daysAgo: 18 },
    { email: 'ava.martinez@grouhacademy.dev', courseSlug: 'ios-app-development', status: 'ACTIVE', daysAgo: 14 },
    { email: 'ethan.brooks@grouhacademy.dev', courseSlug: 'advanced-react', status: 'COMPLETED', daysAgo: 55 },
    { email: 'emma.thompson@grouhacademy.dev', courseSlug: 'data-science-fundamentals', status: 'ACTIVE', daysAgo: 75 },
    { email: 'james.wilson@grouhacademy.dev', courseSlug: 'web-development', status: 'ACTIVE', daysAgo: 120 },
    { email: 'noah.kim@grouhacademy.dev', courseSlug: 'web-development', status: 'ACTIVE', daysAgo: 190 },
    { email: 'ava.martinez@grouhacademy.dev', courseSlug: 'python-programming', status: 'ACTIVE', daysAgo: 280 },
    { email: 'liam.chen@grouhacademy.dev', courseSlug: 'ui-ux-design-mastery', status: 'ACTIVE', daysAgo: 310 },
    { email: 'sofia.rodriguez@grouhacademy.dev', courseSlug: 'digital-marketing', status: 'PENDING', daysAgo: 360 },
  ] as const;

  const enrollmentsByUserAndCourse = new Map<string, {
    userId: string;
    courseId: string;
    enrollmentId: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    enrolledAt: Date;
    completedAt?: Date;
  }>();

  for (const item of enrollmentSeed) {
    const user = studentUsers.find((student) => student.email === item.email);
    const course = courseBySlug.get(item.courseSlug);

    if (!user || !course) continue;

    const enrolledAt = new Date(now);
    enrolledAt.setDate(enrolledAt.getDate() - item.daysAgo);

    let completedAt: Date | undefined;

    if (item.status === 'COMPLETED') {
      completedAt = new Date(enrolledAt);
      completedAt.setDate(completedAt.getDate() + 14);
    }

    const existingEnrollment = await ensureEnrollment({
      userId: user.id,
      courseId: course.id,
      status: item.status,
      enrolledAt,
      completedAt,
    });

    enrollmentsByUserAndCourse.set(`${user.id}:${course.id}`, {
      userId: user.id,
      courseId: course.id,
      enrollmentId: existingEnrollment.id,
      status: item.status,
      enrolledAt,
      completedAt,
    });
  }

  const courseProgressSeed = [
    { email: 'emma.thompson@grouhacademy.dev', courseSlug: 'web-development', completedLessons: 9, totalLessons: 12, progressPercent: 75 },
    { email: 'james.wilson@grouhacademy.dev', courseSlug: 'data-science-fundamentals', completedLessons: 6, totalLessons: 9, progressPercent: 67 },
    { email: 'liam.chen@grouhacademy.dev', courseSlug: 'python-programming', completedLessons: 12, totalLessons: 12, progressPercent: 100 },
    { email: 'noah.kim@grouhacademy.dev', courseSlug: 'machine-learning', completedLessons: 8, totalLessons: 10, progressPercent: 80 },
    { email: 'ava.martinez@grouhacademy.dev', courseSlug: 'ios-app-development', completedLessons: 4, totalLessons: 10, progressPercent: 40 },
    { email: 'ethan.brooks@grouhacademy.dev', courseSlug: 'advanced-react', completedLessons: 12, totalLessons: 12, progressPercent: 100 },
  ] as const;

  for (const item of courseProgressSeed) {
    const user = studentUsers.find((student) => student.email === item.email);
    const course = courseBySlug.get(item.courseSlug);

    if (!user || !course) continue;

    await ensureCourseProgress({
      userId: user.id,
      courseId: course.id,
      completedLessons: item.completedLessons,
      totalLessons: item.totalLessons,
      progressPercent: item.progressPercent,
      completedAt: item.progressPercent === 100 ? new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) : null,
    });
  }

  const certificateSeed = [
    { email: 'liam.chen@grouhacademy.dev', courseSlug: 'python-programming', certificateNumber: 'CERT-2025-001', daysAgo: 19 },
    { email: 'ethan.brooks@grouhacademy.dev', courseSlug: 'advanced-react', certificateNumber: 'CERT-2025-002', daysAgo: 41 },
    { email: 'emma.thompson@grouhacademy.dev', courseSlug: 'data-science-fundamentals', certificateNumber: 'CERT-2025-003', daysAgo: 63 },
  ] as const;

  for (const item of certificateSeed) {
    const user = studentUsers.find((student) => student.email === item.email);
    const course = courseBySlug.get(item.courseSlug);

    if (!user || !course) continue;

    const enrollment = enrollmentsByUserAndCourse.get(`${user.id}:${course.id}`);

    await ensureCertificate({
      userId: user.id,
      courseId: course.id,
      enrollmentId: enrollment?.enrollmentId ?? null,
      certificateNumber: item.certificateNumber,
      issuedAt: new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000),
    });
  }

  const paymentSeed = [
    { email: 'emma.thompson@grouhacademy.dev', courseSlug: 'web-development', reference: 'PAY-1001', amount: 299, status: 'PAID', daysAgo: 2 },
    { email: 'james.wilson@grouhacademy.dev', courseSlug: 'data-science-fundamentals', reference: 'PAY-1002', amount: 199, status: 'PAID', daysAgo: 12 },
    { email: 'sofia.rodriguez@grouhacademy.dev', courseSlug: 'ui-ux-design-mastery', reference: 'PAY-1003', amount: 299, status: 'PENDING', daysAgo: 24 },
    { email: 'liam.chen@grouhacademy.dev', courseSlug: 'python-programming', reference: 'PAY-1004', amount: 199, status: 'PAID', daysAgo: 32 },
    { email: 'olivia.patel@grouhacademy.dev', courseSlug: 'digital-marketing', reference: 'PAY-1005', amount: 99, status: 'FAILED', daysAgo: 45 },
    { email: 'noah.kim@grouhacademy.dev', courseSlug: 'machine-learning', reference: 'PAY-1006', amount: 399, status: 'PAID', daysAgo: 18 },
    { email: 'ava.martinez@grouhacademy.dev', courseSlug: 'ios-app-development', reference: 'PAY-1007', amount: 299, status: 'PAID', daysAgo: 14 },
  ] as const;

  for (const item of paymentSeed) {
    const user = studentUsers.find((student) => student.email === item.email);
    const course = courseBySlug.get(item.courseSlug);

    if (!user || !course) continue;

    await ensurePayment({
      userId: user.id,
      courseId: course.id,
      programId: null,
      reference: item.reference,
      amount: item.amount,
      currency: 'USD',
      provider: 'Stripe',
      status: item.status,
      paidAt: item.status === 'PAID' ? new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000) : null,
    });
  }
}

async function main() {
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  for (const permissionKey of permissions) {
    await prisma.permission.upsert({
      where: { key: permissionKey },
      update: {},
      create: { key: permissionKey },
    });
  }

  for (const [roleName, permissionKeys] of Object.entries(rolePermissions) as [RoleName, string[]][]) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });

    const permissionRecords = await Promise.all(
      permissionKeys.map(async (permissionKey) =>
        prisma.permission.findUniqueOrThrow({ where: { key: permissionKey } }),
      ),
    );

    for (const permission of permissionRecords) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  await seedDevelopmentData();
  await seedInternshipAssessmentData();

  console.log('RBAC and development demo data seeded successfully');
}

main()
  .catch((error) => {
    console.error('RBAC seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
