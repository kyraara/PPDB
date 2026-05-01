/**
 * PasswordStrengthIndicator — visual bar + label for password strength
 */
const getStrength = (password) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 'lemah', color: '#EF4444', width: '25%' };
  if (score <= 2) return { level: 'cukup', color: '#F97316', width: '50%' };
  if (score <= 3) return { level: 'sedang', color: '#F59E0B', width: '75%' };
  return { level: 'kuat', color: '#10B981', width: '100%' };
};

export default function PasswordStrengthIndicator({ password }) {
  const strength = getStrength(password);
  if (!strength) return null;

  return (
    <div className="mb-4 -mt-2">
      <div className="h-1 bg-bg-tertiary dark:bg-dark-bg-tertiary rounded mb-1">
        <div
          className="h-full rounded transition-all duration-300"
          style={{ width: strength.width, background: strength.color }}
        />
      </div>
      <p className="text-[0.72rem] font-semibold" style={{ color: strength.color }}>
        Kekuatan password: {strength.level}
      </p>
    </div>
  );
}
