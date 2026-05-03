import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function KontakPage() {
  return (
    <div className="py-24 min-h-[calc(100vh-200px)]">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="mb-4">Hubungi Kami</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary max-w-[600px] mx-auto">
            Punya pertanyaan seputar proses Penerimaan Peserta Didik Baru? Jangan ragu untuk menghubungi panitia kami melalui jalur komunikasi di bawah ini.
          </p>
        </div>

        {/* Banner Operasional */}
        <div className="max-w-[1000px] mx-auto mb-8 px-6 py-4 rounded-lg flex items-center justify-center gap-3 font-semibold
                        bg-accent-bg dark:bg-dark-accent-bg border border-accent-bg-strong dark:border-dark-accent-bg-strong
                        text-accent dark:text-dark-accent">
          <Clock size={20} />
          <span>Jam Layanan Panitia: Senin - Sabtu, 08:00 - 15:00 WIB</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
          {/* Card 1: WhatsApp */}
          <div className="card p-8 text-center flex flex-col">
            <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6
                            bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent">
              <MessageCircle size={28} />
            </div>
            <h3 className="mb-2">WhatsApp Panitia</h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-6 text-sm">
              Respons tercepat untuk pertanyaan seputar teknis pendaftaran PPDB.
            </p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
              className="btn btn-primary mt-auto w-full justify-center">
              Chat WhatsApp
            </a>
          </div>

          {/* Card 2: Email & Telp */}
          <div className="card p-8 text-center flex flex-col">
            <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6
                            bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent">
              <Phone size={28} />
            </div>
            <h3 className="mb-2">Telepon & Email</h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-6 text-sm">
              Layanan informasi resmi Yayasan Al Istiqomah.
            </p>
            <div className="mt-auto flex flex-col gap-3 items-center p-4 rounded-md bg-bg-tertiary dark:bg-dark-bg-tertiary">
              <div className="flex items-center gap-2 font-semibold">
                <Phone size={16} className="text-accent dark:text-dark-accent" /> 0812-3456-7890
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <Mail size={16} className="text-accent dark:text-dark-accent" /> ppdb@alistiqomah.sch.id
              </div>
            </div>
          </div>

          {/* Card 3: Lokasi */}
          <div className="card p-8 text-center flex flex-col">
            <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6
                            bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent">
              <MapPin size={28} />
            </div>
            <h3 className="mb-2">Lokasi Sekretariat</h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-6 text-[0.85rem] leading-relaxed">
              Jl. Padat Karya RT.10/RW. 01 Kel. Gunung Ibul, Kec. Prabumulih Timur Kota Prabumulih Sumatera Selatan 31113
            </p>
            <a href="https://maps.google.com/?q=Jl.+Padat+Karya+RT.10+RW.01+Prabumulih" target="_blank" rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-md no-underline
                          bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent
                          border border-border-default dark:border-dark-border-default
                          hover:bg-accent-bg-strong dark:hover:bg-dark-accent-bg-strong transition-colors duration-200">
              <MapPin size={16} /> Buka di Google Maps ↗
            </a>
          </div>
        </div>

        {/* Peta Lokasi */}
        <div className="max-w-[1000px] mx-auto mt-16">
          <h3 className="mb-6 text-center">Peta Lokasi Kami</h3>
          <div className="rounded-xl overflow-hidden border border-border-default dark:border-dark-border-default shadow-md h-[380px] mb-12">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15935.083756855523!2d104.2253013871582!3d-3.465545299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3a1f9a0c0a9b8d%3A0x8e8b8c8d8e8f8g8h!2sPrabumulih!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
              width="100%" height="100%" className="border-0" allowFullScreen="" loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
