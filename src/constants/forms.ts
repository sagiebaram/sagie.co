export const FORM_IDS = {
  membership: process.env.NEXT_PUBLIC_TYPEFORM_MEMBERSHIP ?? '',
  chapter: process.env.NEXT_PUBLIC_TYPEFORM_CHAPTER ?? '',
  solutions: process.env.NEXT_PUBLIC_TYPEFORM_SOLUTIONS ?? '',
  ventures: process.env.NEXT_PUBLIC_TYPEFORM_VENTURES ?? '',
} as const
