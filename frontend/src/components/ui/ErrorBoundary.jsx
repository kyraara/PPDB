import { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Memperbarui state sehingga render berikutnya menunjukkan UI fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Di produksi, Anda bisa log error ini ke layanan seperti Sentry
    console.error("Terjadi kesalahan pada komponen:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Anda bisa merender UI fallback apapun
      return (
        <div className="min-h-screen flex items-center justify-center p-8 text-center bg-bg-primary dark:bg-dark-bg-primary">
          <div className="max-w-[400px] w-full">
            <div className="w-[80px] h-[80px] rounded-full mx-auto mb-6 flex items-center justify-center
                            bg-status-ditolak/10 border-2 border-status-ditolak/20">
              <AlertTriangle size={36} className="text-status-ditolak" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-text-primary dark:text-dark-text-primary">
              Terjadi Kesalahan Jaringan
            </h2>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
              Kami kesulitan memuat data halaman ini. Ini biasanya terjadi jika koneksi internet Anda terputus atau server sedang sibuk.
            </p>
            <button 
              onClick={this.handleReload}
              className="btn btn-primary w-full justify-center gap-2"
            >
              <RefreshCcw size={18} />
              Muat Ulang Halaman
            </button>
            <div className="mt-8 pt-6 border-t border-border-default dark:border-dark-border-default">
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                Catatan Teknis: {this.state.error?.message || 'Gagal memuat komponen (Chunk load error)'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
