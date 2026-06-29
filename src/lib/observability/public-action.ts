import {
  createPublicActionResult,
  type PublicActionResult,
} from './public-action-result';
import type { PublicActionPayloadInput } from './public-action-names';

export type RecordPublicActionInput = PublicActionPayloadInput;
export type RecordPublicActionResult = PublicActionResult;

export function recordPublicAction(input: RecordPublicActionInput): RecordPublicActionResult {
  return createPublicActionResult(input);
}
