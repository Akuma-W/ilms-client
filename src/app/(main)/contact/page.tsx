import { Metadata } from 'next';
import { ContactClient } from './contact-client';

export const metadata: Metadata = {
  title: 'Liên hệ',
};

export default function Contact() {
  return <ContactClient />;
}
