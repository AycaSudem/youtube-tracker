YouTube Playlist Tracker

Bu proje, YouTube çalma listelerini takip etmeyi kolaylaştırmak için geliştirilmiş basit bir web uygulamasıdır.
Kullanıcı, bir YouTube çalma listesi linkini girerek listedeki tüm videoları görüntüleyebilir ve izlediklerini manuel olarak işaretleyebilir.

Uygulama otomatik olarak YouTube Data API üzerinden en güncel listeyi çeker.
Kullanıcı “izlendi” işaretlemelerini kendi tarayıcısında kaydeder (LocalStorage), böylece sayfa yenilense bile kendi işaretlemeleri kaybolmaz.

Özellikler

YouTube çalma listesi linki ile otomatik video yükleme

Listedeki videoların başlık + thumbnail gösterimi

Manuel “İzlendi” işaretleme

İşaretlemelerin LocalStorage’da saklanması

Çalma listesine yeni video eklenince uygulamanın otomatik güncellemesi

API anahtarı kullanarak YouTube Data API v3 entegrasyonu

Next.js 13+ App Router kullanımı

Kullanım

Sayfadaki input alanına bir YouTube çalma listesi linki girin.

“Fetch Videos” tuşuna tıklayın.

Liste yüklendiğinde her videonun yanında “İzlendi” kutusu görünür.

İstediğiniz videoları işaretleyerek kendi ilerlemenizi takip edebilirsiniz.

Aynı çalma listesine yeni videolar eklendiğinde tekrar “Fetch Videos” yaparak güncelleme alabilirsiniz.

Geliştirme

Projeyi kendi bilgisayarınızda çalıştırmak için:

1. Depoyu klonlayın
git clone https://github.com/AycaSudem/youtube-tracker.git
cd youtube-tracker

2. Bağımlılıkları yükleyin
npm install

3. Ortam dosyasını oluşturun

Klasör içine .env.local adında bir dosya oluşturun ve içine şu satırı ekleyin:

NEXT_PUBLIC_YT_API_KEY=YOUR_API_KEY_HERE

4. Geliştirme modunda çalıştırın
npm run dev


Uygulama şu adresten açılır:

http://localhost:3000

Deploy

Bu proje Vercel ile kolayca deploy edilebilir.

GitHub repo'yu bağlayın

Vercel otomatik olarak Next.js projesini tanır

Environment Variables bölümüne API key'i ekleyin

Deploy tuşuna basın

Kullanılan Teknolojiler

Next.js

React

TailwindCSS

YouTube Data API v3

LocalStorage

Lisans

Bu proje açık kaynak olarak paylaşılmıştır.
İsteyen herkes kullanabilir, geliştirebilir.
