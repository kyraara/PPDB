import { STATUS_BADGE_STYLE, STATUS_BADGE_STYLE_LIGHT, STATUS_LABEL } from '../../lib/constants';
import useThemeStore from '../../stores/themeStore';

/**
 * StatusBadge — renders a status badge with dark/light mode aware colors
 * @param {{ status: string, size?: 'sm' | 'md' }} props
 */
export default function StatusBadge({ status, size = 'md' }) {
  const theme = useThemeStore?.((s) => s.theme) ?? 'dark';
  const style = theme === 'light'
    ? (STATUS_BADGE_STYLE_LIGHT[status] || STATUS_BADGE_STYLE[status])
    : STATUS_BADGE_STYLE[status];

  if (!style) return <span>{status}</span>;

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[0.68rem]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold ${sizeClass}`}
      style={style}
    >
      <span className="text-[0.6rem]">●</span>
      {STATUS_LABEL[status] || status}
    </span>
  );
}
