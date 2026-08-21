import { z } from 'zod';

export const DemoRequestSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  dealershipName: z.string().min(1, 'Dealership name is required').max(150),
  businessEmail: z.string().email('Please enter a valid business email address'),
  phone: z.string().min(7, 'Please enter a valid phone number').max(30),
  state: z.string().min(2, 'Please select your state').max(50),
  inventorySize: z.string().optional(),
  employeeCount: z.string().optional(),
  currentDms: z.string().max(100).optional(),
  mainChallenge: z.string().max(500).optional(),
  preferredContactMethod: z.enum(['EMAIL', 'PHONE', 'SMS']).default('EMAIL'),
  preferredDemoDate: z.string().optional(),
  preferredDemoTime: z.string().optional(),
});

export const demoRequestSchema = DemoRequestSchema;
export type DemoRequestInput = z.infer<typeof DemoRequestSchema>;
