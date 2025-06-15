
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, Mail, User, MessageSquare, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      // Get current user if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // Insert the contact submission into the database
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          user_id: user?.id || null
        });

      if (error) {
        console.error('Error submitting contact form:', error);
        toast.error('Failed to send message. Please try again.');
        return;
      }

      console.log('Contact form submitted successfully:', values);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      form.reset();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          Get in Touch
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions about Hindu scriptures or need help with our platform? 
          We're here to guide you on your spiritual journey.
        </p>
      </div>

      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl transform rotate-1"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-red-50 to-orange-50 rounded-3xl transform -rotate-1"></div>
        
        <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-500" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            className="border-2 border-gray-200 focus:border-orange-500 rounded-xl h-12 px-4"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                          <Mail className="w-4 h-4 text-orange-500" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            className="border-2 border-gray-200 focus:border-orange-500 rounded-xl h-12 px-4"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-500" />
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What is your message about?" 
                          className="border-2 border-gray-200 focus:border-orange-500 rounded-xl h-12 px-4"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-orange-500" />
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us how we can help you on your spiritual journey..." 
                          className="border-2 border-gray-200 focus:border-orange-500 rounded-xl min-h-32 px-4 py-3 resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;
