export const Role = {
  admin: 'admin',
  student: 'student',
  teacher: 'teacher'
} as const

export type Role = (typeof Role)[keyof typeof Role]


export const UserStatus = {
  locked: 'locked',
  active: 'active',
  banned: 'banned'
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const EnrollmentStatus = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected'
} as const

export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus]


export const FileType = {
  video: 'video',
  pdf: 'pdf',
  link: 'link',
  slide: 'slide',
  document: 'document'
} as const

export type FileType = (typeof FileType)[keyof typeof FileType]


export const Visibility = {
  public: 'public',
  private: 'private'
} as const

export type Visibility = (typeof Visibility)[keyof typeof Visibility]


export const QuizStatus = {
  draft: 'draft',
  published: 'published'
} as const

export type QuizStatus = (typeof QuizStatus)[keyof typeof QuizStatus]


export const QuestionType = {
  multiple_choice: 'multiple_choice',
  multiple_select: 'multiple_select',
  true_false: 'true_false'
} as const

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]


export const MessageType = {
  text: 'text',
  image: 'image'
} as const

export type MessageType = (typeof MessageType)[keyof typeof MessageType]


export const NotificationType = {
  class_join_requested: 'class_join_requested',
  class_join_approved: 'class_join_approved',
  class_join_rejected: 'class_join_rejected',
  forum_replied: 'forum_replied',
  assignment_submitted: 'assignment_submitted',
  assignment_graded: 'assignment_graded',
  assignment_due_soon: 'assignment_due_soon',
  quiz_submitted: 'quiz_submitted',
  quiz_graded: 'quiz_graded',
  grade_released: 'grade_released',
  system_announcement: 'system_announcement'
} as const

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]


export const RelatedType = {
  quiz: 'quiz',
  assignment: 'assignment',
  forum: 'forum',
  grade: 'grade',
  class: 'class',
  system: 'system'
} as const

export type RelatedType = (typeof RelatedType)[keyof typeof RelatedType]


export const AIRequestType = {
  chat: 'chat',
  generate_outline: 'generate_outline',
  generate_exercise: 'generate_exercise',
  generate_quiz: 'generate_quiz',
  generate_slide: 'generate_slide',
  recommendation: 'recommendation'
} as const

export type AIRequestType = (typeof AIRequestType)[keyof typeof AIRequestType]
