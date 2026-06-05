import Link from 'next/link';

const firstValue = <T,>(values: readonly T[]): T => {
  const [first] = values;

  if (first === undefined) {
    throw new Error('HomeSearch2026 requires at least one option.');
  }

  return first;
};

type SearchCopy = {
  eyebrow: string;
  title: string;
  description: string;
  careNeedLabel: string;
  careNeedPlaceholder: string;
  providerTypeLabel: string;
  countryLabel: string;
  cityLabel: string;
  areaLabel: string;
  searchLabel: string;
  providerLabel: string;
  staticPreviewLabel: string;
  staticPreviewNote: string;
  providerTypes: readonly string[];
  countries: readonly { label: string; disabled?: boolean }[];
  cities: readonly { label: string; note?: string }[];
  areas: readonly string[];
  suggestions: readonly string[];
};

type HomeSearch2026Props = {
  copy: SearchCopy;
  dir: 'ltr' | 'rtl';
  searchHref: string;
  providerHref: string;
};

export function HomeSearch2026({ copy, dir, searchHref, providerHref }: HomeSearch2026Props) {
  const defaultProviderType = firstValue(copy.providerTypes);
  const defaultCountry = firstValue(copy.countries).label;
  const defaultCity = firstValue(copy.cities).label;
  const defaultArea = firstValue(copy.areas);

  return (
    <section className="dm2026-home-search dm2026-search" dir={dir} aria-labelledby="dm2026-home-search-title">
      <div className="dm2026-home-search__intro">
        <span className="dm2026-badge">{copy.eyebrow}</span>
        <h2 id="dm2026-home-search-title">{copy.title}</h2>
        <p>{copy.description}</p>
      </div>

      <form className="dm2026-search-surface dm2026-home-search__surface" action={searchHref} method="get">
        <div className="dm2026-home-search__field dm2026-home-search__field--need">
          <label htmlFor="dm2026-home-care-need">{copy.careNeedLabel}</label>
          <input
            id="dm2026-home-care-need"
            name="q"
            className="dm2026-input"
            type="search"
            placeholder={copy.careNeedPlaceholder}
            autoComplete="off"
          />
          <div
            className="dm2026-home-search__suggestions"
            aria-label={copy.staticPreviewLabel}
            data-static-preview="true"
          >
            <p>{copy.staticPreviewNote}</p>
            <ul>
              {copy.suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dm2026-home-search__field">
          <label htmlFor="dm2026-home-provider-type">{copy.providerTypeLabel}</label>
          <select id="dm2026-home-provider-type" name="type" className="dm2026-select" defaultValue={defaultProviderType}>
            {copy.providerTypes.map((providerType) => (
              <option key={providerType} value={providerType}>
                {providerType}
              </option>
            ))}
          </select>
        </div>

        <div className="dm2026-home-search__field">
          <label htmlFor="dm2026-home-country">{copy.countryLabel}</label>
          <select id="dm2026-home-country" name="country" className="dm2026-select" defaultValue={defaultCountry}>
            {copy.countries.map((country) => (
              <option key={country.label} value={country.label} disabled={country.disabled}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        <div className="dm2026-home-search__field">
          <label htmlFor="dm2026-home-city">{copy.cityLabel}</label>
          <select id="dm2026-home-city" name="city" className="dm2026-select" defaultValue={defaultCity}>
            {copy.cities.map((city) => (
              <option key={city.label} value={city.label}>
                {city.note ? `${city.label} — ${city.note}` : city.label}
              </option>
            ))}
          </select>
        </div>

        <div className="dm2026-home-search__field">
          <label htmlFor="dm2026-home-area">{copy.areaLabel}</label>
          <select id="dm2026-home-area" name="area" className="dm2026-select" defaultValue={defaultArea}>
            {copy.areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="dm2026-home-search__actions">
          <button type="submit" className="dm2026-button dm2026-button-primary">
            {copy.searchLabel}
          </button>
          <Link href={providerHref} className="dm2026-button dm2026-button-secondary">
            {copy.providerLabel}
          </Link>
        </div>
      </form>
    </section>
  );
}
