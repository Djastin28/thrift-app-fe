import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@kondangthrift.com',
      link: 'mailto:support@kondangthrift.com'
    },
    {
      icon: Phone,
      title: 'Telepon',
      value: '+62 812-3456-7890',
      link: 'tel:+6281234567890'
    },
    {
      icon: MapPin,
      title: 'Alamat',
      value: 'Jl. Fashion Street No. 123, Surakarta',
      link: null
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      value: 'Senin - Sabtu, 09:00 - 18:00',
      link: null
    }
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-500' },
    { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-sky-500' },
  ];

  const faqs = [
    {
      question: 'Bagaimana cara melakukan pemesanan?',
      answer: 'Pilih produk yang diinginkan, tambahkan ke keranjang, lalu lanjutkan ke checkout. Isi data pengiriman dan pilih metode pembayaran.'
    },
    {
      question: 'Berapa lama waktu pengiriman?',
      answer: 'Waktu pengiriman bervariasi tergantung lokasi, biasanya 2-5 hari kerja untuk area Pulau Jawa dan 5-10 hari kerja untuk luar Pulau Jawa.'
    },
    {
      question: 'Apakah bisa return/refund?',
      answer: 'Ya, kami menerima return dalam waktu 3 hari setelah barang diterima jika produk tidak sesuai deskripsi atau ada kerusakan.'
    },
    {
      question: 'Bagaimana cara menjadi seller?',
      answer: 'Saat ini fitur seller sedang dalam pengembangan. Hubungi kami untuk informasi lebih lanjut.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hubungi Kami
            </h1>
            <p className="text-lg text-white/80">
              Ada pertanyaan atau masukan? Tim kami siap membantu Anda
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                Kirim Pesan
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Pesan Terkirim!
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <Alert variant="error">{error}</Alert>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama Anda"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Subjek <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Tentang apa pesan Anda?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tulis pesan Anda di sini..."
                      rows="5"
                      required
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Informasi Kontak</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{info.title}</p>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-slate-900 font-medium hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-slate-900 font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Ikuti Kami</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`p-3 rounded-lg bg-slate-100 text-slate-600 ${social.color} transition-colors`}
                      title={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="aspect-video bg-slate-100 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Peta Lokasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-slate-600">
              Temukan jawaban untuk pertanyaan umum di sini
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-slate-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
