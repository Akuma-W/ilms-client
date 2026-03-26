import logo from '@/assets/images/logo.svg';

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const siteConfig = {
  name: 'KEIVerse',
  slogan: 'Kết nối tri thức. Khám phá hành trình học tập!',
  logo: logo,
  introduction:
    'là nền tảng học tập trực tuyến hiện đại, giúp sinh viên và giảng viên kết nối với nhau và khám phá hành trình học tập một cách hiệu quả nhất.',
} as const;
