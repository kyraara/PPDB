import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-bg-primary/80 dark:bg-dark-bg-primary/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-16 h-16 rounded-2xl bg-accent-bg dark:bg-dark-accent-bg border-2 border-accent/20 dark:border-dark-accent/20 flex items-center justify-center shadow-lg mb-4"
      >
        <Loader2 size={32} className="text-accent dark:text-dark-accent animate-spin" />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-text-secondary dark:text-dark-text-secondary font-medium tracking-wide text-sm"
      >
        Memuat Halaman...
      </motion.p>
    </div>
  );
}
