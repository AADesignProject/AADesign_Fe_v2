import { useTranslation } from 'react-i18next';

import { email } from '@/constant/general';

const needs = ['villa', 'apartment', 'office', 'hospitality', 'turnkey'];

// Still a mailto: form (no backend yet): native validation and autofill hints
// only. Shared by the homepage and the contact page; the caller owns the layout
// and look through `className`.
const ConsultationForm = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  return (
    <form
      className={className}
      action={`mailto:${email}`}
      method="post"
      encType="text/plain"
    >
      <label>
        {t('home.landing.form.name')}
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label>
        {t('home.landing.form.phone')}
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          pattern="(\+84|0)[0-9\s.]{8,12}"
          title={t('home.landing.form.phoneHint')}
          required
        />
      </label>
      <label>
        {t('home.landing.form.need')}
        <select name="need" defaultValue="villa">
          {needs.map((need) => (
            <option key={need} value={need}>
              {t(`home.landing.form.options.${need}`)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('home.landing.form.message')}
        <textarea name="message" rows={4} maxLength={2000} />
      </label>
      <button type="submit">{t('home.landing.form.submit')}</button>
    </form>
  );
};

export default ConsultationForm;
