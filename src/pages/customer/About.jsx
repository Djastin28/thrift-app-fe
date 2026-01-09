import { Link } from 'react-router-dom';
import {
  Package,
  Recycle,
  Heart,
  Shield,
  Users,
  Leaf,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Produk Terjual', value: '10K+', icon: Package },
    { label: 'Pelanggan Puas', value: '5K+', icon: Users },
    { label: 'Rating', value: '4.9', icon: Award },
    { label: 'Tahun Berjalan', value: '3+', icon: TrendingUp },
  ];

  const values = [
    {
      icon: Recycle,
      title: 'Sustainable Fashion',
      description: 'Kami percaya fashion tidak harus merusak lingkungan. Dengan membeli preloved, kamu ikut mengurangi limbah tekstil.'
    },
    {
      icon: Heart,
      title: 'Kualitas Terjamin',
      description: 'Setiap produk melalui proses kurasi ketat untuk memastikan kualitas terbaik sampai ke tangan kamu.'
    },
    {
      icon: Shield,
      title: 'Transaksi Aman',
      description: 'Sistem pembayaran yang aman dan terpercaya. Garansi uang kembali jika produk tidak sesuai.'
    },
    {
      icon: Leaf,
      title: 'Ramah Lingkungan',
      description: 'Setiap pembelian membantu mengurangi jejak karbon dan mendukung ekonomi sirkular.'
    },
  ];

  const team = [
    { name: 'Kondang Team', role: 'Founder & CEO', initial: 'KT' },
    { name: 'Quality Team', role: 'Quality Assurance', initial: 'QT' },
    { name: 'Support Team', role: 'Customer Support', initial: 'ST' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tentang Kondang Thrift
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Platform marketplace preloved terpercaya di Indonesia. Kami menghubungkan 
              penjual dan pembeli untuk memberikan kehidupan baru pada barang-barang berkualitas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Mulai Belanja
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Cerita Kami</h2>
          <p className="text-slate-600 leading-relaxed">
            Kondang Thrift lahir dari kecintaan kami terhadap fashion berkelanjutan. 
            Berawal dari garasi kecil di tahun 2022, kami bermimpi menciptakan platform 
            di mana setiap orang bisa menemukan barang berkualitas dengan harga terjangkau, 
            sambil berkontribusi pada lingkungan yang lebih baik.
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            Hari ini, Kondang Thrift telah menjadi rumah bagi ribuan penjual dan pembeli 
            yang berbagi visi yang sama: fashion yang stylish, terjangkau, dan ramah lingkungan.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nilai-Nilai Kami</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Prinsip yang menjadi fondasi setiap langkah kami
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Mengapa Memilih Kondang Thrift?
            </h2>
            <div className="space-y-4">
              {[
                'Produk berkualitas dengan harga terjangkau',
                'Proses kurasi ketat untuk setiap produk',
                'Pengiriman cepat ke seluruh Indonesia',
                'Customer service yang responsif',
                'Garansi kepuasan pelanggan',
                'Mendukung sustainable fashion'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary/10 rounded-2xl p-8">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                <Recycle className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Bergabunglah dengan Gerakan Kami
              </h3>
              <p className="text-slate-600 mb-6">
                Setiap pembelian adalah langkah kecil untuk bumi yang lebih baik
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Daftar Sekarang
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tim Kami</h2>
            <p className="text-slate-600">
              Orang-orang di balik Kondang Thrift
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                  {member.initial}
                </div>
                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm text-slate-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pelanggan yang sudah merasakan pengalaman 
            berbelanja preloved terbaik di Kondang Thrift
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Jelajahi Produk
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
