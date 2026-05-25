# DrMuscat V10.4.1 Manifest Fix

## Purpose

This minor patch fixes the package manifest for programmatic agent consumption.

## Changes

- Added `canonical_send_order_ref: README_SEND_ORDER_AND_RULES.md` to `PACKAGE_MANIFEST.json`.
- Added an `agent_reading_contract` object to make the manifest explicitly point agents to the canonical send/build order.
- No product, database, SEO, admin, route, RLS, or implementation scope changes were made.

## Build Rule

Agents must still read `README_SEND_ORDER_AND_RULES.md` as the source of truth for canonical order.
