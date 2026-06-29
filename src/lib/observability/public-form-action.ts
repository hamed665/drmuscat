import {
  recordPublicAction,
  type RecordPublicActionResult,
} from './public-action';
import type { PublicActionPayloadInput } from './public-action-names';

export type PublicFormActionKind = 'provider' | 'contact';

export type PublicFormActionContext = Readonly<{
  kind: PublicFormActionKind;
  locale?: 'en' | 'ar';
  country?: 'om';
}>;

const formActionByKind = {
  provider: 'provider_form_submit',
  contact: 'contact_form_submit',
} as const satisfies Record<PublicFormActionKind, PublicActionPayloadInput['name']>;

const routeFamilyByKind = {
  provider: 'provider_onboarding',
  contact: 'directory',
} as const satisfies Record<PublicFormActionKind, NonNullable<PublicActionPayloadInput['routeFamily']>>;

export function recordPublicFormAction(context: PublicFormActionContext): RecordPublicActionResult {
  const input: PublicActionPayloadInput = {
    name: formActionByKind[context.kind],
    routeFamily: routeFamilyByKind[context.kind],
  };

  if (context.locale !== undefined) input.locale = context.locale;
  if (context.country !== undefined) input.country = context.country;

  return recordPublicAction(input);
}
