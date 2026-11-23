import * as z from 'zod';
import { CIVIC_CATEGORIES } from '../constants/categories';
import {
  findDistrict,
  isInJharkhandArea,
  isTooFarFromDistrict,
} from '../utils/jharkhand';

export const submitProblemSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(10, 'Title must be at least 10 characters describing the issue')
      .max(120, 'Title cannot exceed 120 characters'),
    description: z
      .string()
      .trim()
      .min(25, 'Please provide more details (at least 25 characters)')
      .max(2000, 'Description cannot exceed 2000 characters'),
    category: z.enum(
      CIVIC_CATEGORIES.map((c) => c.id),
      { error: 'Please select a civic category' }
    ),
    district: z
      .string()
      .refine(
        (name) => Boolean(findDistrict(name)),
        'Please select a Jharkhand district'
      ),
    address: z
      .string()
      .trim()
      .min(5, 'Street address / landmark is required')
      .max(200, 'Address cannot exceed 200 characters'),
    location: z
      .object({ lat: z.number(), lng: z.number() })
      .nullable()
      .refine((point) => point !== null, {
        message: 'Please select a location on the map',
        abort: true,
      })
      .refine((point) => point === null || isInJharkhandArea(point), {
        message: 'The pin is outside the Jharkhand area',
        abort: true,
      }),
  })
  .refine((data) => !isTooFarFromDistrict(data.location, data.district), {
    message: 'The pin is too far from the selected district',
    path: ['location'],
  });
