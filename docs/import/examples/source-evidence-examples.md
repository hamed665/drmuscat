# Source evidence import examples

This guide documents which source evidence combinations can be considered public-safe during import dry-run checks. It is documentation only; it does not change the importer, adapter, runtime guard, public routes, sitemap, schema markup, or rendering behavior.

## Public-safe examples

A local suggestion can only be public-safe when it has a source anchor and a checked date.

| source_name | source_url | last_checked_at | Public-safe? | Notes |
| --- | --- | --- | --- | --- |
| `Oman Ministry of Health directory` | empty | `2026-07-05` | yes | Named source plus checked date. |
| empty | `https://example.com/provider-page` | `2026-07-05` | yes | URL source plus checked date. |
| `Provider official website` | `https://example.com/provider-page` | `2026-07-05` | yes | Strongest example: source label, URL, and checked date. |

## Not public-safe examples

These rows must stay unsafe or private-review until completed.

| source_name | source_url | last_checked_at | Public-safe? | Why not |
| --- | --- | --- | --- | --- |
| `Provider official Instagram profile` | empty | empty | no | Source label alone is not enough. |
| empty | `https://example.com/provider-page` | empty | no | URL alone is not enough. |
| empty | empty | `2026-07-05` | no | Checked date alone is not evidence. |
| empty | empty | empty | no | Notes-only rows are not evidence. |

## Recommended source labels

Use clear labels that tell reviewers what kind of source was checked:

- `Oman Ministry of Health directory`
- `Provider official website`
- `Provider official Instagram profile`
- `Google Business Profile`

## Social profile warning

A social profile can be useful evidence only when the row also records when it was checked. `Provider official Instagram profile` without `last_checked_at` must not become public-safe. The internet changes, people rename pages, and humanity keeps inventing new ways to make screenshots age badly.

## Import rule of thumb

For public display, require:

1. a source anchor: `source_name` or `source_url`
2. a checked date: `last_checked_at`
3. all other public-safety gates, including candidate, location, confidence, self-link, and review-status checks

If any of those fail, keep the row out of public output.
