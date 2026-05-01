/**
 * EmptyState — reusable centered empty/blocked state component
 */
export default function EmptyState({ icon: Icon, title, description, statusBadge, action }) {
  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-8">
      <div className="text-center max-w-[420px]">
        {Icon && (
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6
                          bg-accent-bg dark:bg-dark-accent-bg
                          border-2 border-border-default dark:border-dark-border-default">
            <Icon size={36} className="text-accent dark:text-dark-accent" />
          </div>
        )}

        <h2 className="text-[1.4rem] font-bold mb-3">{title}</h2>

        {description && (
          <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed mb-4">
            {description}
          </p>
        )}

        {statusBadge}

        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
