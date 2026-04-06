'use client';

import { MessageSquare, Send, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CONTACT_FORM_CONFIG } from '@/config/contact';
import { toast } from 'sonner';
import { Feedback } from '@/types/contact';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { WEB3FORMS_ACCESS_KEY } from '@/config';

const ContactSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên'),
  email: z.string().email('Email không hợp lệ'),
  message: z.string().min(10, 'Nội dung quá ngắn'),
  type: z.enum(['contact', 'feedback']),
});

interface ContactSectionProps {
  defaultType: 'contact' | 'feedback';
}

export function ContactSection({ defaultType = 'contact' }: ContactSectionProps) {
  const form = useForm({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      type: defaultType,
    },
  });

  const type = form.watch('type');
  const config = CONTACT_FORM_CONFIG[type];

  async function onSubmit(values: Feedback) {
    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        ...values,
        subject:
          values.type === 'feedback'
            ? '[Feedback] Người dùng gửi phản hồi'
            : '[Contact] Người dùng liên hệ',
        botcheck: '',
      };

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message);

      toast.success('Gửi thành công');
      form.reset();
    } catch (error) {
      toast.error('Gửi thất bại');
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto bg-galaxy rounded-[2rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-6">
              {config.icon === 'message' ? (
                <MessageSquare className="w-8 h-8 text-blue-300" />
              ) : (
                <Star className="w-8 h-8 text-yellow-400" />
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">{config.title}</h2>

            <p className="text-blue-100 mb-6 leading-relaxed">{config.description}</p>
          </div>

          {/* Form Feedback */}
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10"
              >
                {/* Switch type */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-white/20 rounded-xl mb-4">
                  {(['contact', 'feedback'] as const).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={type === t ? 'default' : 'ghost'}
                      onClick={() => form.setValue('type', t)}
                      className="py-2 text-sm font-medium rounded-lg transition-all"
                    >
                      {t === 'contact' ? 'Liên hệ' : 'Góp ý'}
                    </Button>
                  ))}
                </div>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <Textarea {...field} rows={4} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {config.submitLabel}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
