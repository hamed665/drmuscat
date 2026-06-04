'use client';

import { FormEvent, useId, useMemo, useState } from 'react';
import type { SupportedLocale } from '@/lib/i18n/config';
import {
  countryOptions2026,
  getAreaOptionsForCity2026,
  getDefaultOmanCity2026,
  omanCityOptions2026,
} from '@/components/public-2026/location/location-options-2026';

type ProviderOnboardingLeadFormProps = {
  locale: SupportedLocale;
};

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'validation_error' | 'unavailable';

type ProviderTypeOption = {
  value: string;
  label: string;
};

type LeadFormCopy = {
  title: string;
  description: string;
  requiredHint: string;
  centerName: string;
  contactName: string;
  phone: string;
  email: string;
  whatsapp: string;
  providerType: string;
  country: string;
  areaText: string;
  cityText: string;
  allAreas: string;
  preferredLanguage: string;
  message: string;
  optional: string;
  consent: string;
  submit: string;
  submitting: string;
  success: string;
  validationError: string;
  unavailable: string;
  safetyNote: string;
  providerTypes: readonly ProviderTypeOption[];
  languageOptions: readonly string[];
};

const copyByLocale: Record<SupportedLocale, LeadFormCopy> = {
  en: {
    title: 'Request provider onboarding',
    description: 'Share your center details so the DrMuscat team can review the request and contact you about provider onboarding.',
    requiredHint: 'Required fields are marked with *.',
    centerName: 'Center or clinic name',
    contactName: 'Contact person name',
    phone: 'Phone number',
    email: 'Email address',
    whatsapp: 'WhatsApp number',
    providerType: 'Provider type',
    country: 'Country',
    areaText: 'Area',
    cityText: 'City',
    allAreas: 'All areas',
    preferredLanguage: 'Preferred language',
    message: 'Message',
    optional: 'optional',
    consent: 'I agree that DrMuscat may contact me about provider onboarding.',
    submit: 'Submit onboarding request',
    submitting: 'Submitting request...',
    success: 'Your request has been received. DrMuscat may contact you about provider onboarding.',
    validationError: 'Please check the required fields and try again.',
    unavailable: 'We could not receive the request right now. Please try again later.',
    safetyNote:
      'Submitting this request does not activate a plan, create a public profile, or confirm approval. DrMuscat may contact you about provider onboarding.',
    providerTypes: [
      { value: 'clinic', label: 'Clinic' },
      { value: 'medical_center', label: 'Medical center' },
      { value: 'dental_clinic', label: 'Dental clinic' },
      { value: 'pharmacy', label: 'Pharmacy' },
      { value: 'lab', label: 'Lab' },
      { value: 'wellness', label: 'Wellness' },
      { value: 'other', label: 'Other' }
    ],
    languageOptions: ['English', 'Arabic', 'Both', 'Other']
  },
  ar: {
    title: 'طلب الانضمام كمقدم خدمة',
    description: 'شارك بيانات مركزك حتى يتمكن فريق DrMuscat من مراجعة الطلب والتواصل معك بخصوص انضمام مقدمي الخدمة.',
    requiredHint: 'الحقول المطلوبة موضحة بعلامة *.',
    centerName: 'اسم المركز أو العيادة',
    contactName: 'اسم مسؤول التواصل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    whatsapp: 'رقم واتساب',
    providerType: 'نوع مقدم الخدمة',
    country: 'الدولة',
    areaText: 'المنطقة',
    cityText: 'المدينة',
    allAreas: 'كل المناطق',
    preferredLanguage: 'لغة التواصل المفضلة',
    message: 'رسالة',
    optional: 'اختياري',
    consent: 'أوافق على أن يتواصل معي DrMuscat بخصوص انضمام مقدمي الخدمة.',
    submit: 'إرسال طلب الانضمام',
    submitting: 'جارٍ إرسال الطلب...',
    success: 'تم استلام طلبك. قد يتواصل معك فريق DrMuscat بخصوص انضمام مقدمي الخدمة.',
    validationError: 'يرجى التحقق من الحقول المطلوبة والمحاولة مرة أخرى.',
    unavailable: 'تعذر استلام الطلب حالياً. يرجى المحاولة لاحقاً.',
    safetyNote:
      'إرسال هذا الطلب لا يفعّل أي خطة ولا ينشئ ملفاً عاماً ولا يؤكد الموافقة. قد يتواصل معك DrMuscat بخصوص انضمام مقدمي الخدمة.',
    providerTypes: [
      { value: 'clinic', label: 'عيادة' },
      { value: 'medical_center', label: 'مركز طبي' },
      { value: 'dental_clinic', label: 'عيادة أسنان' },
      { value: 'pharmacy', label: 'صيدلية' },
      { value: 'lab', label: 'مختبر' },
      { value: 'wellness', label: 'عافية' },
      { value: 'other', label: 'أخرى' }
    ],
    languageOptions: ['English', 'Arabic', 'Both', 'Other']
  }
};

const fieldClassName =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100';
const labelClassName = 'text-sm font-bold text-slate-900';

export function ProviderOnboardingLeadForm({ locale }: ProviderOnboardingLeadFormProps) {
  const copy = copyByLocale[locale];
  const idPrefix = useId();
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [city, setCity] = useState<string>(getDefaultOmanCity2026());
  const [area, setArea] = useState<string>('');
  const countries = countryOptions2026[locale];
  const cities = omanCityOptions2026[locale];
  const areaOptions = useMemo(() => getAreaOptionsForCity2026(locale, city), [city, locale]);

  const isSubmitting = status === 'submitting';
  const statusMessage =
    status === 'success'
      ? copy.success
      : status === 'validation_error'
        ? copy.validationError
        : status === 'unavailable'
          ? copy.unavailable
          : '';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      centerName: String(formData.get('centerName') ?? ''),
      contactName: String(formData.get('contactName') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      email: String(formData.get('email') ?? ''),
      whatsapp: String(formData.get('whatsapp') ?? ''),
      providerType: String(formData.get('providerType') ?? 'other'),
      areaText: String(formData.get('areaText') ?? ''),
      cityText: String(formData.get('cityText') ?? ''),
      preferredLanguage: String(formData.get('preferredLanguage') ?? ''),
      message: String(formData.get('message') ?? ''),
      locale,
      countryCode: 'om',
      consentToContact: formData.get('consentToContact') === 'true',
      honeypot: String(formData.get('honeypot') ?? '')
    };

    try {
      const response = await fetch('/api/provider-onboarding-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 202) {
        form.reset();
        setCity(getDefaultOmanCity2026());
        setArea('');
        setStatus('success');
        return;
      }

      if (response.status === 400) {
        setStatus('validation_error');
        return;
      }

      setStatus('unavailable');
    } catch {
      setStatus('unavailable');
    }
  }

  return (
    <div id="provider-onboarding-form" className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{copy.description}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{copy.requiredHint}</p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate={false}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="countryCode" value="om" />
        <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-center-name`}>
              {copy.centerName} *
            </label>
            <input id={`${idPrefix}-center-name`} name="centerName" type="text" required maxLength={160} className={fieldClassName} disabled={isSubmitting} />
          </div>

          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-contact-name`}>
              {copy.contactName} *
            </label>
            <input id={`${idPrefix}-contact-name`} name="contactName" type="text" required maxLength={120} className={fieldClassName} disabled={isSubmitting} />
          </div>

          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-phone`}>
              {copy.phone} *
            </label>
            <input id={`${idPrefix}-phone`} name="phone" type="tel" required maxLength={32} className={fieldClassName} disabled={isSubmitting} />
          </div>

          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-email`}>
              {copy.email} <span className="font-medium text-slate-500">({copy.optional})</span>
            </label>
            <input id={`${idPrefix}-email`} name="email" type="email" maxLength={254} className={fieldClassName} disabled={isSubmitting} />
          </div>

          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-whatsapp`}>
              {copy.whatsapp} <span className="font-medium text-slate-500">({copy.optional})</span>
            </label>
            <input id={`${idPrefix}-whatsapp`} name="whatsapp" type="tel" maxLength={32} className={fieldClassName} disabled={isSubmitting} />
          </div>

          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-provider-type`}>
              {copy.providerType} <span className="font-medium text-slate-500">({copy.optional})</span>
            </label>
            <select id={`${idPrefix}-provider-type`} name="providerType" defaultValue="other" className={fieldClassName} disabled={isSubmitting}>
              {copy.providerTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-country`}>
              {copy.country}
            </label>
            <select id={`${idPrefix}-country`} defaultValue="om" className={fieldClassName} disabled={isSubmitting}>
              {countries.map((option) => (
                <option key={option.code} value={option.code} disabled={!option.active}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-city-text`}>
              {copy.cityText} <span className="font-medium text-slate-500">({copy.optional})</span>
            </label>
            <select
              id={`${idPrefix}-city-text`}
              name="cityText"
              value={city}
              className={fieldClassName}
              disabled={isSubmitting}
              onChange={(event) => {
                setCity(event.target.value);
                setArea('');
              }}
            >
              {cities.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClassName} htmlFor={`${idPrefix}-area-text`}>
              {copy.areaText} <span className="font-medium text-slate-500">({copy.optional})</span>
            </label>
            <select id={`${idPrefix}-area-text`} name="areaText" value={area} className={fieldClassName} disabled={isSubmitting} onChange={(event) => setArea(event.target.value)}>
              <option value="">{copy.allAreas}</option>
              {areaOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClassName} htmlFor={`${idPrefix}-preferred-language`}>
              {copy.preferredLanguage} <span className="font-medium text-slate-500">({copy.optional})</span>
            </label>
            <select id={`${idPrefix}-preferred-language`} name="preferredLanguage" defaultValue="" className={fieldClassName} disabled={isSubmitting}>
              <option value="">{copy.optional}</option>
              {copy.languageOptions.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClassName} htmlFor={`${idPrefix}-message`}>
              {copy.message} <span className="font-medium text-slate-500">({copy.optional})</span>
            </label>
            <textarea id={`${idPrefix}-message`} name="message" rows={5} maxLength={1000} className={fieldClassName} disabled={isSubmitting} />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <label className="flex items-start gap-3 text-sm font-semibold leading-6 text-emerald-950">
            <input
              name="consentToContact"
              type="checkbox"
              value="true"
              required
              disabled={isSubmitting}
              className="mt-1 h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
            />
            <span>{copy.consent}</span>
          </label>
          <p className="mt-3 text-xs leading-6 text-emerald-900">{copy.safetyNote}</p>
        </div>

        <div aria-live="polite" className="min-h-6">
          {statusMessage ? (
            <p className={status === 'success' ? 'text-sm font-semibold leading-6 text-emerald-700' : 'text-sm font-semibold leading-6 text-red-700'}>
              {statusMessage}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
        >
          {isSubmitting ? copy.submitting : copy.submit}
        </button>
      </form>
    </div>
  );
}
