import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAuth } from '../../context/AuthContext';
import { CIVIC_CATEGORIES, createMockProblem } from '../../utils/mockData';
import {
  JHARKHAND_DISTRICTS,
  findDistrict,
  isInJharkhandArea,
  isTooFarFromDistrict,
  nearestDistrict,
} from '../../utils/jharkhand';
import { photoToDataUrl } from '../../utils/image';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import LocationPicker from '../../components/ui/LocationPicker';
import PhotoUpload from '../../components/ui/PhotoUpload';
import Badge from '../../components/ui/Badge';

/**
 * Zod Schema for Citizen Problem Submission
 */
const submitProblemSchema = z
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
      .refine((name) => Boolean(findDistrict(name)), 'Please select a Jharkhand district'),
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
      }),
  })
  .refine((data) => !isTooFarFromDistrict(data.location, data.district), {
    message: 'The pin is too far from the selected district',
    path: ['location'],
  });

export default function SubmitProblem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(submitProblemSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      category: 'Water',
      district: 'Ranchi',
      address: '',
      location: null,
    },
  });

  const selectedCategory = watch('category');
  const selectedDistrict = watch('district');
  const pin = watch('location');
  const closest = pin ? nearestDistrict(pin) : null;

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      const photoUrl = selectedPhoto ? await photoToDataUrl(selectedPhoto) : null;
      const created = createMockProblem(
        {
          title: data.title,
          description: data.description,
          category: data.category,
          district: data.district,
          location: { address: data.address, ...data.location },
          photoUrl,
        },
        user
      );
      navigate('/citizen/problems', { state: { createdId: created.id } });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
            Report a Local Problem
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit localized municipal, sanitation, or infrastructure issues directly to the Government of Jharkhand.
          </p>
        </div>
        <Badge status="validated" size="sm">
          SIH26043 Form
        </Badge>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* 1. Category Visual Chips Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Civic Issue Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CIVIC_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue('category', cat.id, { shouldValidate: true })}
                    className={`
                      p-3 rounded-lg border text-left flex flex-col justify-between transition duration-150 cursor-pointer
                      ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xl">{cat.icon}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-xs font-bold leading-tight">{cat.id}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-xs text-red-600 font-medium mt-1.5">{errors.category.message}</p>
            )}
          </div>

          {/* 2. Problem Title */}
          <FormInput
            label="Problem Title"
            placeholder="e.g. Open drainage overflow causing waterlogging near Ward 12"
            required
            helperText="Clear, one-sentence summary of the grievance (10-120 characters)"
            {...register('title')}
            error={errors.title}
          />

          {/* 3. Detailed Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the severity, how many families are affected, how long the issue has persisted, and any safety hazards..."
              className={`
                w-full rounded bg-white text-sm text-slate-900 placeholder:text-slate-400 transition duration-150 p-3.5 border
                ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 hover:border-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }
                focus:outline-none
              `}
              {...register('description')}
            />
            {errors.description ? (
              <p className="text-xs text-red-600 font-medium">{errors.description.message}</p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Minimum 25 characters required for administrative verification
              </p>
            )}
          </div>

          {/* 4. Photo Evidence Drag-and-Drop Zone (Task F3.4) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Ground Photo Evidence <span className="text-slate-400 font-normal">(Optional, but recommended)</span>
              </label>
              <span className="text-[11px] text-slate-400">Photos help university engineers verify scope</span>
            </div>
            <PhotoUpload onFileChange={(file) => setSelectedPhoto(file)} />
          </div>

          {/* 5. District & Street Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="district"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                District <span className="text-red-500">*</span>
              </label>
              <select
                id="district"
                className="w-full rounded bg-white text-sm text-slate-900 py-2.5 px-3 border border-slate-300 hover:border-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                {...register('district')}
              >
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-xs text-red-600 font-medium">{errors.district.message}</p>
              )}
            </div>

            <FormInput
              label="Street / Landmark Address"
              placeholder="e.g. Near Harmu Ground, Ward 12"
              required
              {...register('address')}
              error={errors.address}
            />
          </div>

          {/* 6. Interactive Leaflet Map Location Pinning */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Pin Location on Map <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Click anywhere on the map to set GPS coordinates</span>
            </div>

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <LocationPicker
                  value={field.value}
                  focus={findDistrict(selectedDistrict)}
                  onChange={(coords) => field.onChange(coords)}
                  height="300px"
                />
              )}
            />

            {closest && !errors.location && closest.name !== selectedDistrict && (
              <p className="text-xs text-amber-700 font-medium pt-1">
                This pin is closer to {closest.name} headquarters. Please check that{' '}
                {selectedDistrict} is correct.
              </p>
            )}

            {errors.location && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 font-semibold pt-1">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errors.location.message}</span>
              </p>
            )}
          </div>

          {submitError && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
            >
              {submitError}
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Your submission will be audited by the District Nodal Officer within 24-48 hours.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full sm:w-auto"
              >
                Submit Citizen Grievance &rarr;
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
