# CI/CD & DevOps Sunum Konuşma Metni

**Toplam Süre:** 35-40 dakika
**Hedef Kitle:** Junior, Mid-Level ve Senior geliştiriciler

---

## GİRİŞ (3-4 dakika)

### Açılış

Merhaba arkadaşlar, bugün sizlerle CI/CD ve DevOps dünyasının temel taşlarını konuşacağız. Ama önce şunu sorayım: Kaç kişi daha önce "benim bilgisayarımda çalışıyordu" cümlesini duydu veya söyledi?

*[Kısa bir tebessüm için bekle]*

Bu cümle, yazılım geliştirme dünyasının en eski ve en can sıkıcı problemlerinden birini özetliyor. İşte bugün konuşacağımız teknolojilerin hepsi, aslında bu problemi çözmek için var.

### Neden CI/CD Önemli?

Şunu düşünün: 2010'lu yılların başında çoğu şirket ayda bir, hatta yılda birkaç kez deployment yapardı. Şimdi Netflix günde 500'den fazla, Amazon ise saniyede ortalama bir deployment yapıyor. Bu nasıl mümkün?

Cevap basit: Otomasyon ve güvenilir süreçler.

CI/CD sadece bir teknoloji değil, bir kültür değişimi. Manuel test, manuel deployment ve "deployment günü" korkusu artık geçmişte kaldı. Doğru araçlar ve süreçlerle, her gün huzur içinde production'a kod gönderebiliriz.

### Bugün Neler Öğreneceğiz?

Bugünkü sunumda 5 ana konuyu ele alacağız:

1. **GitHub Actions** - CI/CD pipeline'larımızı nasıl oluşturacağız
2. **Vercel ve Netlify** - Modern web uygulamalarını saniyeler içinde nasıl deploy edeceğiz
3. **Docker** - "Benim bilgisayarımda çalışıyordu" problemini nasıl çözeceğiz
4. **Kubernetes** - Container'ları production'da nasıl yöneteceğiz
5. **Deployment Stratejileri** - Sıfır downtime ile nasıl deployment yapacağız

Her konuyu önce "neden" sorusunu cevaplayarak başlayacağız, sonra "nasıl" kısmına geçeceğiz. Kodları gösterirken de pratik örnekler üzerinden gideceğiz.

Hazırsanız, GitHub Actions ile başlayalım.

---

## BÖLÜM 1: GITHUB ACTIONS (6-7 dakika)

### 1.1 GitHub Actions Nedir?

Şimdi ilk konumuza geçelim: GitHub Actions. Muhtemelen çoğunuz adını duymuşsunuzdur ama tam olarak ne işe yaradığını, neden bu kadar popüler olduğunu birlikte inceleyelim.

Şöyle bir senaryo hayal edin: Yeni bir özellik geliştirdiniz, testlerinizi kendi bilgisayarınızda çalıştırdınız, her şey yeşil, kod çalışıyor. Pull request açtınız, takım arkadaşınız onayladı, main branch'e merge ettiniz. Ertesi gün geldiniz, production patlamış. Neden? Çünkü takım arkadaşınızın bir hafta önce yaptığı değişiklikle sizin kodunuz çakışmış. Ya da siz Node 20 kullanıyorsunuz ama production'da Node 18 var, ufak bir syntax farkı her şeyi bozmuş.

İşte GitHub Actions tam olarak bu tür sorunları çözmek için var. Her push'ta, her pull request'te otomatik olarak testlerinizi çalıştırıyor, build alıyor, hatta isterseniz direkt production'a deploy ediyor. Siz daha merge tuşuna basmadan, kodunuzun tüm ortamlarda çalışıp çalışmadığını görüyorsunuz.

En büyük avantajı şu: GitHub ile birebir entegre. Eskiden CI/CD için ayrı bir Jenkins server kurardık, CircleCI hesabı açardık, webhook'lar tanımlardık, bir sürü konfigürasyon yapardık. Şimdi her şey repo içinde, birkaç YAML dosyasıyla tanımlanıyor. Reponuz neredeyse, CI/CD'niz de orada.

### 1.2 Temel Mimari

*[Mimari diyagramını göster]*

GitHub Actions mimarisini anlamak için 5 temel kavramı bilmemiz gerekiyor. Bunları bir kez anladığınızda, herhangi bir workflow dosyasını rahatlıkla okuyabilir ve yazabilirsiniz.

Birincisi Event. Event, workflow'u tetikleyen olay demek. Birileri push yaptığında tetiklenebilir, pull request açıldığında tetiklenebilir, hatta cron job gibi her gece saat 3'te bile tetiklenebilir. "Hangi durumda bu otomasyon çalışsın?" sorusunun cevabı event'tir.

İkincisi Workflow. Workflow, `.github/workflows` klasöründeki YAML dosyalarıdır. Tüm otomasyonunuzu burada tanımlıyorsunuz. Bir repo'da birden fazla workflow olabilir - biri test için, biri deployment için, biri güvenlik taraması için gibi.

Üçüncüsü Job. Job, bir workflow içindeki iş parçacıklarıdır. Mesela bir workflow'da "test" job'ı var, "build" job'ı var, "deploy" job'ı var. Bunlar paralel çalışabilir ya da birbirlerini bekleyebilir. "Testler geçmedikçe build yapma" gibi bağımlılıklar tanımlayabilirsiniz.

Dördüncüsü Step. Step, job içindeki adımlardır. Ya hazır bir action kullanırsınız - mesela `actions/checkout` repo'yu klonlar - ya da direkt shell komutu çalıştırırsınız, `npm test` gibi.

Beşincisi Runner. Runner, işlerin çalıştığı makinedir. GitHub size Ubuntu, Windows, macOS seçenekleri sunuyor. Hatta isterseniz kendi sunucunuzu self-hosted runner olarak tanımlayabilirsiniz. Özel hardware gereksinimleriniz varsa ya da private network'e erişim gerekiyorsa bu çok işe yarıyor.

### 1.3 Örnek Workflow

*[Workflow kodunu göster]*

Şimdi gerçek bir workflow örneğine bakalım. Bu dosyayı satır satır okuyacağız ki ne yaptığını tam anlayalım.

İlk kısımda trigger'ları görüyoruz:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

Bu ne diyor? Main veya develop branch'ine push yapıldığında çalış. Ayrıca main'e açılan pull request'lerde de çalış. Yani hem merge sonrası hem de merge öncesi kontrol ediyoruz. PR aşamasında yakalarsak, hatalı kodu hiç main'e almamış oluruz.

Sonra job tanımına bakıyoruz:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
```

Burada çok güçlü bir özellik var: matrix strategy. Bu ne demek? Aynı testi 3 farklı Node versiyonunda paralel olarak çalıştır. Tek bir job tanımıyla aslında 3 ayrı iş çalıştırıyorsunuz. Node 18'de çalışıyor ama Node 22'de hata veriyor gibi durumları anında yakalıyorsunuz. Özellikle açık kaynak projelerde veya farklı müşteri ortamlarını destekliyorsanız bu hayat kurtarıcı.

Bir de job'lar arası bağımlılığa bakalım:

```yaml
  build:
    needs: test
```

Build job'ı "needs: test" diyor. Yani testler geçmedikçe build başlamıyor. Bu çok önemli bir prensip: Hatalı kodu asla bir sonraki aşamaya taşımayın. Test kırmızıysa, build'e gerek yok, deploy'a hiç gerek yok.

### 1.4 Secrets Yönetimi

*[Secrets kodunu göster]*

Şimdi kritik bir konuya değinelim: Hassas bilgilerin yönetimi. Bu konu özellikle junior arkadaşların sıkça hata yaptığı bir alan.

API key'leri, database şifreleri, private token'lar asla ama asla koda yazılmaz. Git history sonsuza kadar saklar, bir kez commit'lediyseniz o bilgi artık orada. Repo public olsa da olmasa da, bu bilgiler güvende değil demektir.

GitHub Secrets tam olarak bunun için var. Üç farklı seviyede secret tanımlayabilirsiniz:

Repository Secrets: Sadece o repo'ya özel. Mesela projenizin Vercel deploy token'ı.

Organization Secrets: Tüm organizasyondaki repolarda kullanılabilir. Mesela şirketin npm private registry token'ı. Bir kez tanımlarsınız, 50 repo'da kullanırsınız.

Environment Secrets: Bu en gelişmiş olanı. Production, staging, development gibi ortamlar tanımlıyorsunuz. Her ortamın kendi secret'ları var. Production database şifresi staging'den farklı oluyor doğal olarak.

Environment'ların bir güzel özelliği daha var: Protection Rules. Mesela diyorsunuz ki "production environment'ına deploy için 2 kişinin onayı gerekli" ya da "sadece main branch'ten deploy yapılabilir". Bu tür kurallar, yanlışlıkla production'a hatalı kod göndermenizi engelliyor.

### 1.5 Best Practices

*[Best practices listesini göster]*

GitHub Actions kullanırken yıllar içinde öğrendiğimiz bazı best practice'ler var. Bunları baştan bilmek sizi çok fazla baş ağrısından kurtarır.

Önce performans tarafına bakalım. Cache kullanın. Her workflow çalıştığında npm paketlerini sıfırdan indirmek hem yavaş hem de gereksiz. GitHub'ın cache action'ı ile node_modules'ı cache'leyebilirsiniz, workflow süreniz yarıya düşer. Matrix builds ile paralel çalıştırın demiştik, 3 test seri çalışacağına paralel çalışsın, 3 kat hızlansın. Bir de timeout belirlemeyi unutmayın. Bazen bir test sonsuz döngüye girer ya da network beklerken takılır. Timeout koymazsanız dakikalarınızı, hatta saatlerinizi yer. 10 dakikalık bir timeout çoğu iş için yeterlidir.

Güvenlik tarafında ise şunu bilin: Action versiyonlarını SHA ile pinleyin. Ne demek bu? `actions/checkout@v4` yazmak yerine `actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11` gibi tam commit hash'i yazın. Neden? Çünkü v4 etiketi değiştirilebilir. Birisi o action'ın sahibiyse, v4'ün gösterdiği kodu değiştirebilir. Ama commit hash değiştirilemez, o hash her zaman aynı kodu gösterir. Paranoyakça gelebilir ama supply chain attack'lar gerçek bir tehdit.

Bir de GITHUB_TOKEN konusu var. Her workflow otomatik olarak bir GITHUB_TOKEN alır. Varsayılan olarak bu token'ın oldukça geniş yetkileri var. Workflow'unuz sadece PR'a yorum atacaksa, ona sadece `pull-requests: write` yetkisi verin, repo'yu silme yetkisi vermeyin. Minimum yetki prensibi burada da geçerli.

---

## BÖLÜM 2: VERCEL VS NETLIFY (5-6 dakika)

### 2.1 Neden Bu Platformlar?

Pekala, GitHub Actions ile CI/CD pipeline'larımızı kurabiliyoruz artık. Testler çalışıyor, build alınıyor. Ama bir dakika, bu build'i nereye deploy edeceğiz?

Geleneksel yöntemi düşünelim: Bir VPS kiralarsınız, sunucuya SSH ile bağlanırsınız, nginx kurarsınız, reverse proxy ayarlarsınız, SSL sertifikası için Let's Encrypt kurarsınız, cron job'lar yazarsınız, deployment script'leri hazırlarsınız... Bu süreç saatler, hatta günler alır. Üstelik her deployment'ta aynı şeyleri tekrarlamanız gerekir.

Şimdi modern yönteme bakalım: Git push yaparsınız, 30 saniye sonra siteniz canlı. SSL hazır, CDN hazır, her şey otomatik. Kulağa hayal gibi geliyor değil mi? Ama gerçek.

İşte Vercel ve Netlify bu ikinci yöntemi sunan platformlar. İkisi de "Platform as a Service" kategorisinde ve özellikle frontend uygulamalar için optimize edilmiş. JAMstack - yani JavaScript, API, Markup - mimarisine ve serverless yaklaşıma odaklanıyorlar. Bugün bu iki platformu karşılaştıracağız ki sizin projeniz için hangisinin daha uygun olduğuna karar verebilesiniz.

### 2.2 Platform Karşılaştırması

*[Karşılaştırma tablosunu göster]*

Her iki platformun da güçlü yanları var, birlikte bakalım.

Vercel'den başlayalım. Vercel'in kurucusu Guillermo Rauch aynı zamanda Next.js'in de yaratıcısı. Bu ne demek? Vercel, Next.js için biçilmiş kaftan. React Server Components, Incremental Static Regeneration, Edge Functions - Next.js'in tüm gelişmiş özellikleri Vercel'de en iyi şekilde çalışıyor. Hatta bazı özellikler Vercel'de çalışıp başka platformlarda düzgün çalışmıyor bile. Next.js kullanıyorsanız, Vercel doğal seçim.

Netlify ise JAMstack hareketinin öncüsü. Bu hareketi başlatan, popülerleştiren platform diyebiliriz. Netlify daha framework-agnostic bir yaklaşım sergiliyor. Next.js kullanın, Vue kullanın, Svelte kullanın, Angular kullanın, hatta sadece statik HTML kullanın - hepsinde iyi çalışır. Netlify'ın ek olarak sunduğu built-in form handling özelliği var. Sayfanıza bir form koyuyorsunuz, backend yazmadan form verilerini toplayabiliyorsunuz. Küçük projeler için çok pratik. Identity management özelliği de var - kullanıcı giriş/kayıt sistemi hazır geliyor.

Her iki platformda da ortak özellikler mevcut: Git push yaptığınızda otomatik deployment, her pull request için ayrı bir preview URL, global CDN üzerinden dağıtım, serverless function desteği. Temel özellikler açısından birbirlerine çok yakınlar.

### 2.3 Konfigürasyon

*[Config dosyalarını göster]*

Konfigürasyon yaklaşımlarına bakalım çünkü günlük kullanımda bu dosyalarla çok muhatap olacaksınız.

Vercel JSON formatı kullanıyor. Örneğin:

```json
{
  "functions": {
    "api/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

Burada api klasöründeki TypeScript fonksiyonlarının 1GB memory kullanabileceğini ve maksimum 30 saniye çalışabileceğini tanımlıyoruz. JSON formatı size tanıdık gelecektir, basit ve okunabilir.

Netlify ise TOML formatını tercih ediyor:

```toml
[context.production]
  environment = { API_URL = "https://api.prod.com" }

[context.deploy-preview]
  environment = { API_URL = "https://api.staging.com" }
```

Netlify'ın burada çok güzel bir özelliği var: Context bazlı konfigürasyon. Production deployment için bir API URL'i, preview deployment'lar için farklı bir API URL'i tanımlayabiliyorsunuz. Dosya içinde her şey açık ve net. Vercel'de de aynı şeyi yapabilirsiniz ama dashboard üzerinden, dosya bazlı değil.

### 2.4 Serverless Functions

*[Function kodlarını göster]*

Her iki platformda da serverless function yazabiliyorsunuz. Bu, basit backend ihtiyaçlarınızı karşılayabileceğiniz anlamına geliyor. Tam teşekküllü bir backend server'a ihtiyacınız olmadan API endpoint'leri oluşturabilirsiniz.

Vercel'de iki tür function var: Serverless Functions ve Edge Functions. Serverless Functions klasik Lambda tarzı, Node.js runtime'da çalışıyor, bir data center'da. Edge Functions ise kullanıcıya en yakın lokasyonda çalışıyor. Bir kullanıcı İstanbul'daysa, function İstanbul'daki edge node'da çalışır. Bu da çok düşük latency demek. Özellikle authentication kontrolü, A/B testing, geolocation bazlı yönlendirme gibi işler için mükemmel.

Netlify'da da benzer şekilde Functions ve Edge Functions var. Netlify'ın ek bir avantajı: Background Functions. Normal function'lar 10-30 saniye içinde cevap vermek zorunda. Ama bazen uzun süren işler var - video processing, büyük data export, toplu email gönderimi gibi. Background Functions 15 dakikaya kadar çalışabiliyor. İşi başlatıyorsunuz, arka planda devam ediyor, kullanıcı beklemek zorunda kalmıyor.

### 2.5 Hangisini Seçmeli?

*[Karar ağacını göster]*

Peki hangisini seçmeliyiz? Size basit bir karar ağacı sunayım.

Eğer Next.js kullanıyorsanız, Vercel seçin. Bu konuda tartışma yok. Next.js Vercel için, Vercel Next.js için tasarlandı. En iyi deneyimi orada alırsınız.

Eğer farklı bir framework kullanıyorsanız - Vue, Svelte, Nuxt, Gatsby, Astro ne olursa olsun - Netlify genellikle daha iyi uyumluluk sunuyor. Framework agnostic yaklaşımı sayesinde her şeyle iyi çalışıyor.

Eğer sitenizde form'lar var ve backend yazmak istemiyorsanız, Netlify'ın built-in form handling özelliği çok işinize yarayacak. Contact form, feedback form, newsletter signup - hepsini backend olmadan çözebilirsiniz.

Eğer edge computing sizin için kritikse, düşük latency her şeyin önündeyse, Vercel'in edge network'ü şu an daha gelişmiş durumda.

Sonuç olarak şunu söyleyeyim: İkisi de mükemmel platformlar. Yanlış seçim yok aslında. İkisini de denemek de bir seçenek - ikisinin de ücretsiz tier'ı oldukça cömert. Küçük bir proje alın, ikisinde de deploy edin, hangisinin developer experience'ını daha çok sevdiğinize kendiniz karar verin.

---

## BÖLÜM 3: DOCKER (7-8 dakika)

### 3.1 Docker Neden Gerekli?

Şimdi bugünkü sunumun belki de en temel konusuna geliyoruz: Docker. Eğer modern yazılım geliştirme dünyasında çalışıyorsanız, Docker bilmek artık bir tercih değil, zorunluluk haline geldi.

Şöyle bir senaryo düşünelim: 5 kişilik bir ekipsiniz. Projeniz Node.js 18 gerektiriyor. Ama takım arkadaşınızın bilgisayarında Node 16 var, bir başkasında Node 20 var. Siz macOS kullanıyorsunuz, frontend developer Windows'ta, DevOps arkadaşınız Linux'ta. Database olarak PostgreSQL 15 kurdunuz, ama QA ekibinde PostgreSQL 13 var. Ayrıca siz Redis 7 kullanıyorsunuz, başka birinin bilgisayarında Redis kurulu bile değil.

Bu kadar değişkenlik varken ne oluyor? Bir gün birileri gelip "benim bilgisayarımda çalışıyordu" diyor. Ve haklı olarak diyor - gerçekten onun bilgisayarında çalışıyordu. Ama farklı bir ortamda çalışmıyor işte.

Docker bu problemi kökten çözüyor. Uygulamanızı, tüm bağımlılıklarıyla birlikte - Node versiyonu, sistem kütüphaneleri, environment variable'ları, her şeyiyle - tek bir paket haline getiriyorsunuz. Bu paketi hangi makinede çalıştırırsanız çalıştırın, aynı sonucu alıyorsunuz. Geliştirici bilgisayarı, test sunucusu, production sunucusu - hepsi aynı ortamı görüyor.

### 3.2 Container vs VM

*[Karşılaştırma diyagramını göster]*

Şimdi akla gelebilecek bir soru: "Peki virtual machine de aynı şeyi yapmıyor mu? Yıllardır VM kullanıyoruz, izole ortamlar oluşturuyoruz." Haklı bir soru ama container'lar ve VM'ler arasında çok büyük farklar var.

Virtual Machine'de neler oluyor? Her VM için ayrı bir işletim sistemi kuruyorsunuz. 3 tane VM çalıştıracaksanız, 3 ayrı Ubuntu kurulumu demek bu. Her birinin kernel'ı var, sistem kütüphaneleri var, init process'i var. Bu da ne demek? Her VM gigabyte'larca disk alanı kaplıyor. Bir VM'i açmak dakikalar alıyor çünkü tam bir işletim sistemi boot ediliyor. Ve bir sunucuya en fazla 5-10 VM sığdırabilirsiniz.

Container'larda durum çok farklı. Container'lar host işletim sisteminin kernel'ını paylaşıyor. Ayrı bir OS yok, sadece uygulamanız ve onun bağımlılıkları izole ediliyor. Sonuç olarak bir container 50-100 megabyte'lık bir alan kaplıyor. Bir container saniyeler içinde ayağa kalkıyor. Ve aynı sunucuya yüzlerce container sığdırabilirsiniz.

Pratik bir örnek vereyim: Tipik bir Ubuntu VM 2-3 GB disk alanı kaplar, açılması 30-60 saniye sürer. Tipik bir Node.js container'ı 100-200 MB disk alanı kaplar, açılması 2-3 saniye sürer. Aradaki fark devasa.

### 3.3 Temel Kavramlar

*[Kavramlar diyagramını göster]*

Docker dünyasına girmeden önce 4 temel kavramı anlamamız gerekiyor. Bu kavramları bir kez oturttunuz mu, geri kalan her şey yerine oturur.

Birincisi Image. Image, uygulamanızın read-only şablonudur. Bir tarif gibi düşünün. Dockerfile adlı bir dosyada tarifi yazıyorsunuz - hangi base image kullanılacak, hangi dosyalar kopyalanacak, hangi komutlar çalıştırılacak. Bu tariften çıkan ürün image'dır.

İkincisi Container. Container, image'ın çalışan halidir. Image'ı tarif demiştik, container da o tariften yapılmış yemek. Bir image'dan istediğiniz kadar container çalıştırabilirsiniz. 10 kullanıcı aynı anda sistemi kullanacaksa, aynı image'dan 10 container çalıştırırsınız.

Üçüncüsü Registry. Registry, image'ların depolandığı ve paylaşıldığı yerdir. En popüleri Docker Hub - açık kaynak image'lar burada. node, postgres, nginx gibi resmi image'lar Docker Hub'da. Şirketler genellikle kendi private registry'lerini kullanır - AWS ECR, Google GCR, GitHub Container Registry gibi.

Dördüncüsü Volume. Container'lar varsayılan olarak ephemeral'dır, yani geçicidir. Container'ı sildiğinizde içindeki tüm veriler gider. Ama database verilerinin kalıcı olmasını istiyorsunuz değil mi? İşte volume'lar bunun için. Container silinse bile volume'daki veriler kalır.

### 3.4 Dockerfile Yazımı

*[Dockerfile kodunu göster]*

Şimdi pratik kısma geçelim. İyi bir Dockerfile nasıl yazılır? Burada çok önemli bir teknik var: Multi-stage build.

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
COPY --from=builder /app/.next/standalone ./
```

Burada ne oluyor? Üç ayrı aşama var ve her birinin farklı bir görevi var.

İlk aşamada sadece package.json'ı alıp dependency'leri yüklüyoruz. Bu aşamada devDependency'ler de dahil, hepsi yükleniyor.

İkinci aşamada build yapıyoruz. Kaynak kodları alıyoruz, derleyicileri çalıştırıyoruz, production için optimize edilmiş çıktı üretiyoruz.

Üçüncü ve son aşamada sadece production'da çalışması gereken dosyaları alıyoruz. Kaynak kodlar yok, devDependency'ler yok, build araçları yok. Sadece çalıştırılabilir kod var.

Sonuç ne oluyor? Normal bir build yapsaydınız 1 GB civarı bir image olacaktı. Multi-stage build ile 100-150 MB'a düşürüyorsunuz. Bu ne demek? Daha hızlı deploy demek - image'ı çekmek çok daha kısa sürüyor. Daha güvenli demek - saldırganın erişebileceği gereksiz araçlar yok. Daha az depolama alanı demek - registry maliyetleriniz düşüyor.

### 3.5 Docker Compose

*[Docker Compose kodunu göster]*

Gerçek dünyada bir uygulama tek başına çalışmaz. Web uygulamanız var, arkasında PostgreSQL database var, performans için Redis cache var, arkaplanda job'lar çalıştırmak için RabbitMQ var. Bunların hepsini ayrı ayrı docker run komutuyla çalıştırmak hem zahmetli hem de hata yapmaya açık.

Docker Compose tam olarak bu problem için var. Tüm servislerinizi tek bir YAML dosyasında tanımlıyorsunuz ve tek komutla hepsini ayağa kaldırıyorsunuz.

```yaml
services:
  app:
    build: .
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
```

Burada iki önemli kavram var. Birincisi depends_on - bu servis şu servise bağımlı demek. Ama sadece "bağımlı" demek yetmiyor çünkü bir servisin container'ı başladı diye hazır olduğu anlamına gelmiyor. PostgreSQL container'ı başladı ama henüz connection kabul etmiyorsa ne olacak?

İşte bu yüzden ikinci kavram var: healthcheck. Database'e "hazır mısın?" diye soruyoruz. pg_isready komutu PostgreSQL'in bağlantı kabul etmeye hazır olup olmadığını kontrol ediyor. condition: service_healthy dediğimizde, uygulama ancak database sağlıklı duruma geçtikten sonra başlıyor.

Geliştirme ortamınızı tek komutla ayağa kaldırıyorsunuz: docker compose up -d. Arka planda çalışıyor, terminali meşgul etmiyor. İşiniz bittiğinde docker compose down ile her şeyi kapatıyorsunuz.

### 3.6 Güvenlik

*[Güvenlik best practices listesini göster]*

Docker güvenliği sık sık göz ardı edilen ama kritik öneme sahip bir konu. Birkaç temel kuralı bilmek sizi çok fazla dertten kurtarır.

Birincisi: Container'ları root olarak çalıştırmayın. Varsayılan olarak container'lar root kullanıcısıyla çalışır. Bu çok tehlikeli çünkü bir güvenlik açığı varsa saldırgan root yetkilerine sahip oluyor. Dockerfile'ınızda bir non-root user oluşturun ve USER komutuyla o kullanıcıya geçin.

İkincisi: Resmi base image'lar kullanın. Docker Hub'da node, postgres, nginx gibi "Official Images" etiketli image'lar var. Bunlar düzenli olarak güvenlik taramasından geçiyor ve güncelleniyor. Rastgele birinin yaptığı image'a güvenmeyin - içinde ne olduğunu bilemezsiniz.

Üçüncüsü: Image'larınızı düzenli olarak güvenlik taramasından geçirin. Trivy, Snyk, Clair gibi araçlar image'larınızdaki bilinen güvenlik açıklarını tespit ediyor. Bu taramayı CI/CD pipeline'ınıza ekleyebilirsiniz - her build'de otomatik tarama yapılsın.

Dördüncüsü: Resource limit'ler koyun. Bir container'ın tüm CPU'yu veya tüm memory'yi tüketmesine izin vermeyin. Bir bug veya saldırı sonucu bir container çıldırırsa, diğer container'ları ve host sistemini de etkiler. Memory ve CPU limit'leri koyarak bunu önlüyorsunuz.

---

## BÖLÜM 4: KUBERNETES (8-9 dakika)

### 4.1 Kubernetes Neden Gerekli?

Docker ile container'lar oluşturmayı öğrendik, harika. Ama şimdi şöyle düşünelim: Bir container çalıştırmak kolay. Peki 10 tane container yöneteceksek? 100 tane? Ya da Netflix gibi binlerce container'ımız varsa?

Birkaç soru soralım kendimize: Gece 3'te bir container crash oldu, kim restart edecek? Cuma günü Black Friday kampanyası başladı, traffic 10 katına çıktı, yeni container'lar kim oluşturacak? Eski mühendis gitti, yeni mühendis geldi, sistemin nasıl çalıştığını nasıl anlayacak? Yeni versiyon deploy edeceğiz, kullanıcılar kesinti yaşamadan nasıl yapacağız?

İşte Kubernetes - kısaca K8s diyoruz, çünkü K ile s arasında 8 harf var - tam olarak bu soruların cevabı. Container orchestration platformu deniyor. Orkestra şefinin müzisyenleri yönetmesi gibi, Kubernetes de container'larınızı yönetiyor.

Üç temel özelliğine bakalım. Birincisi self-healing: Bir container crash olursa, Kubernetes otomatik olarak yenisini başlatıyor. Sizin müdahalenize gerek yok, gece uyurken bile sistem kendini iyileştiriyor. İkincisi auto-scaling: CPU kullanımı yükseldi mi, Kubernetes otomatik olarak yeni container'lar oluşturuyor. Trafik düştü mü, gereksiz container'ları kapatıyor. Kaynaklarınızı verimli kullanıyorsunuz. Üçüncüsü zero-downtime deployment: Yeni versiyon deploy ederken eski versiyon çalışmaya devam ediyor. Yeni versiyon tamamen hazır olunca trafik oraya yönlendiriliyor. Kullanıcılar hiçbir kesinti yaşamıyor.

Kubernetes nereden çıktı? Google'ın Borg adlı internal sisteminden esinlenilmiş. Google günde milyarlarca container çalıştırıyor - Gmail, YouTube, Search, hepsi container'lar üzerinde. 15 yıllık deneyimlerini alıp açık kaynak olarak paylaştılar. Şimdi Cloud Native Computing Foundation altında geliştiriliyor ve bulut dünyasının de facto standardı haline geldi.

### 4.2 Mimari

*[Mimari diyagramını göster]*

Kubernetes mimarisini anlamak için onu iki ana parçaya ayıralım: Control Plane ve Worker Nodes. Control Plane beyindir, kararları alır. Worker Nodes ise kollardır, işi yapar.

Control Plane'de 4 kritik bileşen var:

API Server tüm iletişimin merkezidir. Siz kubectl komutu çalıştırdığınızda, o komut API Server'a gider. Başka bir pod cluster'daki bir servisi sorguladığında, API Server'a gider. Her şey buradan geçer. Bu yüzden API Server'ın yüksek erişilebilirliği kritik öneme sahiptir.

etcd bir key-value veritabanıdır ve cluster'ın tüm state'ini tutar. Hangi pod nerede çalışıyor, hangi servis hangi pod'lara yönlendiriyor, configmap'ler ne içeriyor - hepsi burada kayıtlı. etcd çökerse, cluster'ın hafızası gider. Bu yüzden production'da etcd her zaman yedekli çalıştırılır.

Scheduler yeni oluşturulacak pod'lar için yer belirler. "Bu pod 2GB memory istiyor, hangi node'da 2GB boş yer var?" sorusuna cevap verir. Node'ların kaynak durumunu, pod'un gereksinimlerini, affinity kurallarını değerlendirir ve en uygun node'u seçer.

Controller Manager cluster'ın istenen durumuyla gerçek durumunu sürekli karşılaştırır. Siz "3 replica çalışsın" dediniz, o 3 tane çalıştığından emin olur. Birisi öldü mü? Yenisini başlatır. Fazla mı var? Fazlalığı kapatır. Bu sürekli döngüye "reconciliation loop" deniyor.

Worker Node'larda da 3 bileşen var:

kubelet her node'da çalışan bir agent'tır. Control Plane'den "bu pod'u çalıştır" emrini alır ve çalıştırır. Pod'un sağlığını izler, sorun varsa raporlar.

kube-proxy networking'den sorumludur. Bir pod başka bir servise bağlanmak istediğinde, kube-proxy o trafiği doğru pod'a yönlendirir. Aslında bir load balancer gibi çalışır.

Container Runtime container'ları çalıştıran yazılımdır. Eskiden Docker kullanılıyordu, şimdi genellikle containerd kullanılıyor. Kubernetes "container runtime interface" denen bir standart tanımladı, bu standarda uyan her runtime kullanılabilir.

### 4.3 Temel Objeler

*[Objeler listesini göster]*

Kubernetes'te her şey bir objedir. Bu objeleri YAML dosyalarıyla tanımlarsınız ve kubectl apply komutuyla cluster'a uygularsınız. En sık karşılaşacağınız objelere bakalım.

Pod, Kubernetes'in en küçük deploy edilebilir birimidir. İçinde bir veya daha fazla container olabilir. Pratikte çoğu zaman tek container olur ama bazen sidecar pattern'ı için birden fazla container kullanılır - mesela ana uygulama bir container'da, log toplayan agent başka bir container'da, aynı pod içinde.

Deployment, pod'ların yöneticisidir. Siz "3 tane nginx çalıştır" dersiniz, Deployment 3 pod oluşturur. Birisi crash olursa yenisini yaratır. Yeni versiyon deploy etmek istediğinizde, Deployment rolling update yapar. Doğrudan pod oluşturmak yerine hep Deployment kullanmalısınız.

Service, pod'lara sabit bir erişim noktası sağlar. Pod'ların IP adresleri sürekli değişir - pod ölür yenisi doğar, farklı IP alır. Ama Service IP'si sabit kalır. Diğer pod'lar servise IP veya isimle bağlanır, Service de trafiği arkadaki pod'lara dağıtır.

Ingress, dış dünyadan gelen HTTP trafiğini yönetir. Tek bir IP'den birden fazla servise yönlendirme yapabilirsiniz. "/api" ile başlayan istekleri backend servisine, "/" ile başlayanları frontend servisine gönderebilirsiniz. SSL sertifikası yönetimi de Ingress üzerinden yapılır.

ConfigMap ve Secret konfigürasyon verilerini tutar. Environment variable'ları, config dosyalarını pod'un dışında tutarsınız. Pod değişse bile config aynı kalır. Secret'lar hassas veriler için - şifreler, API anahtarları gibi. Base64 encoded olarak saklanır, ama gerçek güvenlik için ek önlemler gerekir.

### 4.4 Deployment Manifest

*[Deployment YAML'ını göster]*

Şimdi gerçek bir Deployment YAML'ına bakalım. Bu dosya Kubernetes'e ne istediğinizi söylüyor.

```yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

replicas: 3 diyor - 3 pod çalışsın. RollingUpdate stratejisi var, bu da yeni versiyon deploy ederken nasıl davranılacağını belirliyor. maxSurge: 1 demek geçici olarak 1 fazla pod olabilir, yani toplam 4 pod çalışabilir. maxUnavailable: 0 demek her zaman en az 3 pod hazır olmalı.

Bu iki ayar birlikte ne sağlıyor? Sıfır downtime. Yeni pod ayağa kalkıp hazır olmadan eski pod asla kapatılmıyor. 3 pod çalışıyordu, 1 yeni pod ekleniyor, 4 oldu. Yeni pod hazır olduktan sonra 1 eski pod kapatılıyor, tekrar 3 oldu. Bu şekilde teker teker tüm pod'lar güncelleniyor.

```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "500m"
```

Resource yönetimi production'da kritik önem taşıyor. requests pod'un minimum ihtiyacını belirtiyor - Scheduler bu pod'u yerleştirirken en az bu kadar boş kaynak olan node arayacak. limits ise maksimum kullanımı belirtiyor - pod bundan fazlasını kullanamaz. Memory limit'i aşarsa pod OOMKilled olur yani öldürülür. CPU limit'i aşarsa throttle edilir yani yavaşlatılır.

```yaml
livenessProbe:
  httpGet:
    path: /health
readinessProbe:
  httpGet:
    path: /ready
```

Health check'ler pod'un durumunu izlemek için kullanılır. livenessProbe "bu pod hala yaşıyor mu?" sorusuna cevap verir. Cevap hayırsa, Kubernetes pod'u restart eder. readinessProbe ise "bu pod trafik almaya hazır mı?" sorusuna cevap verir. Cevap hayırsa, Service bu pod'a trafik göndermez. Mesela uygulama açılırken database bağlantısını bekliyor olabilir - o sırada ready değildir ama alive'dır.

### 4.5 kubectl Komutları

*[Komutlar listesini göster]*

Kubernetes ile günlük çalışırken en çok kullanacağınız komutlara bakalım. kubectl Kubernetes'in komut satırı aracı.

```bash
kubectl get pods              # Pod listesi
kubectl describe pod <name>   # Pod detayı
kubectl logs <pod> -f         # Log takibi
kubectl exec -it <pod> -- sh  # Pod içine gir
kubectl apply -f manifest.yaml  # Manifest uygula
kubectl rollout undo deployment/app  # Rollback
```

kubectl get pods mevcut pod'ları listeler. Durumları, kaç kez restart olduklarını, ne kadar süredir çalıştıklarını görebilirsiniz. kubectl describe pod daha detaylı bilgi verir - events, resource kullanımı, hangi node'da çalıştığı gibi. Bir pod sorunluysa describe ile sebebe bakarsınız.

kubectl logs pod'un stdout'unu gösterir. -f flag'i ile canlı takip edersiniz, yeni loglar geldikçe ekrana düşer. Hata ayıklarken vazgeçilmez.

kubectl exec ile çalışan pod'un içine girip komut çalıştırabilirsiniz. Debug için bazen pod içinden ağ testleri yapmak, dosyalara bakmak gerekebilir.

kubectl apply manifest dosyanızı cluster'a uygular. Deployment güncellemek, yeni servis eklemek, config değiştirmek - hep apply kullanırsınız.

Ve belki de en önemlisi kubectl rollout undo. Yeni versiyon deploy ettiniz, bir şeyler ters gitti. Bu komutla bir önceki versiyona anında geri dönersiniz. Kubernetes önceki versiyonların bilgisini tutar, rollback saniyeler içinde gerçekleşir.

### 4.6 Helm

*[Helm kodunu göster]*

Kubernetes manifest dosyaları büyüyünce yönetmek zorlaşıyor. 10 tane mikro servisiniz var, her birinin Deployment'ı, Service'i, ConfigMap'i var. Staging ve production için farklı değerler kullanmanız gerekiyor. Her yerde aynı şeyleri tekrar ediyorsunuz.

Helm, Kubernetes için bir package manager'dır. apt veya npm gibi düşünün ama Kubernetes uygulamaları için.

values.yaml adlı bir dosyada değişkenlerinizi tanımlıyorsunuz:

```yaml
replicaCount: 3
image:
  repository: myapp
  tag: "1.0.0"
```

Template dosyalarında bu değerleri kullanıyorsunuz. Farklı ortamlar için farklı values dosyaları oluşturuyorsunuz - values-dev.yaml, values-staging.yaml, values-prod.yaml gibi. Development'ta 1 replica, production'da 5 replica. Development'ta 256MB memory, production'da 2GB memory.

Kurulum tek komutla: helm install myapp ./chart -f values-prod.yaml. Güncelleme: helm upgrade. Geri alma: helm rollback. Kaldırma: helm uninstall. Tüm Kubernetes objeleriniz tek birim olarak yönetiliyor.

---

## BÖLÜM 5: DEPLOYMENT STRATEGIES (5-6 dakika)

### 5.1 Neden Strateji Önemli?

Şimdi bugünkü sunumun belki de en kritik konusuna geldik: Deployment stratejileri. Bu konu neden bu kadar önemli? Çünkü yanlış strateji seçimi doğrudan para kaybına, müşteri kaybına ve itibar kaybına yol açıyor.

Bir rakam vereyim: Amazon'un hesaplamalarına göre, 1 dakikalık downtime şirkete yaklaşık 220.000 dolar kaybettiriyor. Dakikada 220.000 dolar. Bu sadece Amazon için değil, sizin şirketiniz için de orantılı bir maliyet var. E-ticaret sitesiyseniz, Black Friday'de 5 dakikalık kesinti ayın gelirini götürebilir. SaaS ürününüz varsa, kesinti müşteri güvenini sarsar, rakibe geçerler.

Peki doğru stratejiyi nasıl seçeceğiz? İki temel faktöre bakmalıyız. Birincisi risk toleransınız: Bu sistem ne kadar kritik? Internal bir dashboard mı yoksa canlı ödeme sistemi mi? İkincisi kaynak durumunuz: İki kat sunucu maliyetini karşılayabilir misiniz? Bazı stratejiler daha fazla kaynak gerektiriyor.

Dört ana deployment stratejisi var ve her birinin kendine göre avantajları ve dezavantajları var. Hepsini inceleyelim ki hangi durumda hangisini kullanacağınızı bilin.

### 5.2 Recreate

*[Recreate diyagramını göster]*

İlk strateji en basit olanı: Recreate. Ne yapıyor? Mevcut versiyonu tamamen durdur, sonra yeni versiyonu başlat. Tek satırlık konfigürasyon:

```yaml
strategy:
  type: Recreate
```

Avantajı ne? Çok basit, anlaşılması kolay. Ayrıca clean state garantisi var - eski ve yeni versiyon asla aynı anda çalışmıyor. Bazı durumlarda bu gerekli olabiliyor, mesela database schema değişikliği yaptıysanız ve eski kod yeni şemayla çalışamıyorsa.

Dezavantajı ne? Downtime var. Eski versiyon kapanıyor, yeni versiyon açılıyor, arada bir boşluk oluyor. Bu boşlukta kullanıcılar servise erişemiyor.

Ne zaman kullanmalı? Development ve test ortamlarında rahatlıkla kullanabilirsiniz, downtime kimseyi etkilemiyor. Ya da breaking change yapıyorsanız ve iki versiyonun aynı anda çalışması mümkün değilse.

Production'da müşteriye dönük sistemler için uygun değil.

### 5.3 Rolling Update

*[Rolling Update diyagramını göster]*

İkinci strateji Kubernetes'in varsayılan stratejisi: Rolling Update. Pod'lar teker teker güncelleniyor.

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

Mantık şu: 3 pod'unuz var. Önce 1 yeni pod ekleniyor, 4 oldu. Yeni pod hazır olunca 1 eski pod kapatılıyor, 3 oldu ama artık 2 eski 1 yeni. Bu döngü devam ediyor, sonunda 3 yeni pod'unuz oluyor. Hiçbir zaman 3'ün altına düşmüyorsunuz, yani her zaman trafik karşılayabilecek kapasiteniz var.

Avantajları: Sıfır downtime - kullanıcılar kesinti yaşamıyor. Resource efficient - sadece geçici olarak 1 ekstra pod lazım, kalıcı değil.

Dezavantajı: Güncelleme sırasında eski ve yeni versiyon aynı anda çalışıyor. Bu ne demek? Bir kullanıcının isteği eski versiyona gidebilir, bir sonraki isteği yeni versiyona. API'niz backward compatible olmalı. Yeni versiyon eskinin beklediği response'ları verememiyorsa sorun çıkar.

Çoğu proje için Rolling Update yeterli ve önerilen strateji. Eğer API'niz backward compatible tasarlanmışsa - ki bu zaten iyi bir pratik - Rolling Update ile devam edin.

### 5.4 Blue-Green

*[Blue-Green diyagramını göster]*

Üçüncü strateji Blue-Green deployment. Burada iki ayrı ortam var: Blue mevcut çalışan versiyon, Green yeni versiyon.

Akış şöyle işliyor: Önce Green ortamını deploy ediyorsunuz ama henüz trafik almıyor. Green'i iyice test ediyorsunuz - smoke testler, integration testler, hatta manual test. Her şey yolundaysa, load balancer'ı Green'e yönlendiriyorsunuz. Tek bir switch ile tüm trafik yeni versiyona geçiyor.

```yaml
# Service selector'ı değiştirerek switch
selector:
  app: myapp
  version: green  # blue'dan green'e çevir
```

Ve işin güzel tarafı: Problem olursa, aynı switch'i geri çeviriyorsunuz ve anında Blue'ya dönüyorsunuz. Rollback saniyeler içinde oluyor.

Avantajları: Anında geçiş, anında geri dönüş. Test edilmiş versiyona geçiyorsunuz, risk düşük.

Dezavantajı: İki kat kaynak gerekiyor. 3 pod yerine 6 pod çalışıyor. Bir ortam aktif, biri beklemede. Altyapı maliyetiniz artıyor.

Ne zaman kullanmalı? Kritik production sistemlerinde. Finans uygulamaları, e-ticaret siteleri, ödeme sistemleri - hata kabul edilemeyecek yerlerde. Maliyet artışı, downtime riskine kıyasla kabul edilebilir.

### 5.5 Canary

*[Canary diyagramını göster]*

Dördüncü strateji en düşük riskli olanı: Canary deployment. İsim nereden geliyor? Eskiden madenciler, madene girerken yanlarında kanarya kuşu götürürmüş. Zehirli gaz sızıntısı olursa kanarya önce etkilenir, madenciler uyarılmış olur. Aynı mantık burada da geçerli - küçük bir grup kullanıcı önce yeni versiyonu deneyimliyor.

Akış şöyle: Önce trafiğin sadece %5'ini yeni versiyona yönlendiriyorsunuz. Metrikleri izliyorsunuz - error rate arttı mı, latency yükseldi mi, conversion düştü mü. Her şey normalse %25'e çıkıyorsunuz. Sonra %50, sonra %75, en sonunda %100. Yavaş yavaş, kontrollü bir şekilde tüm trafiği yeni versiyona taşıyorsunuz.

```yaml
# Istio ile traffic splitting
route:
  - destination:
      host: myapp-stable
    weight: 95
  - destination:
      host: myapp-canary
    weight: 5
```

Avantajı: Minimum risk. Yeni versiyonda ciddi bir bug varsa, sadece %5 kullanıcı etkileniyor, %95'i sağlam versiyon kullanmaya devam ediyor. Sorunu tespit ettiğinizde canary'yi kapatıyorsunuz, %5 bile etkilenmiyor artık.

Dezavantajları: Yavaş rollout - tam geçiş saatler, hatta günler alabilir. Ve monitoring şart - metrikleri sürekli izlemezseniz canary'nin anlamı kalmıyor. Observability altyapınız güçlü olmalı.

Netflix, Google, Facebook gibi büyük şirketler Canary kullanıyor. Milyonlarca kullanıcınız varsa, %1'lik bir canary bile on binlerce kişi demek - yeterli veri topluyorsunuz.

### 5.6 GitOps ve ArgoCD

*[GitOps diyagramını göster]*

Son olarak modern deployment dünyasının standardı haline gelen bir yaklaşımdan bahsedelim: GitOps.

GitOps'un prensibi çok basit: Git, tek gerçek kaynaktır - Single Source of Truth. Kubernetes manifest'leriniz, Helm chart'larınız, konfigürasyonlarınız - hepsi Git'te saklanıyor. Ve sadece Git'te olan şey cluster'da çalışıyor.

ArgoCD bu prensibi uygulayan en popüler araçlardan biri. ArgoCD Git repository'nizi sürekli izliyor. Siz Git'e bir değişiklik push'ladığınızda, ArgoCD bunu görüyor ve cluster'ı otomatik olarak senkronize ediyor. Kimsenin kubectl apply çalıştırmasına gerek yok.

Bu yaklaşımın birçok avantajı var. Birincisi audit trail: Kim ne zaman ne değiştirdi? Git history'de. Compliance gereksinimleriniz varsa, bu çok değerli. İkincisi easy rollback: Bir şey ters giderse git revert ile anında geri alabilirsiniz. Üçüncüsü review process: Deployment değişiklikleri de normal kod gibi PR süreci geçiyor. Takım arkadaşınız review ediyor, onaylıyor, sonra merge oluyor.

Artık "production'a kim deploy etti?" sorusu yok. Git history'ye bakıyorsunuz, orada yazıyor.

---

## KAPANIŞ (2-3 dakika)

### Özet

Bugün birlikte uzun bir yolculuk yaptık. Beş farklı ama birbiriyle bağlantılı konuyu ele aldık. Şimdi bunları bir özet geçelim ve bütünü görelim.

GitHub Actions ile başladık. CI/CD pipeline'larımızı nasıl oluşturacağımızı, testleri nasıl otomatize edeceğimizi, secrets yönetimini nasıl yapacağımızı gördük. Artık her push'ta kodunuzun test edildiğini, build edildiğini biliyorsunuz.

Vercel ve Netlify ile devam ettik. Modern web uygulamalarını saniyeler içinde nasıl deploy edeceğimizi, preview URL'lerin ne kadar güçlü bir özellik olduğunu, serverless function'ların ne zaman işe yarayacağını konuştuk.

Docker ile "benim bilgisayarımda çalışıyordu" problemini ele aldık. Container kavramını, VM'lerden farkını, multi-stage build ile optimize image oluşturmayı, Docker Compose ile multi-container uygulamaları öğrendik.

Kubernetes ile container orchestration dünyasına girdik. Yüzlerce container'ı nasıl yöneteceğimizi, self-healing ve auto-scaling kavramlarını, Deployment ve Service objelerini, Helm ile package management'ı inceledik.

Son olarak deployment stratejilerini ele aldık. Recreate, Rolling Update, Blue-Green, Canary - her birinin ne zaman kullanılacağını, avantaj ve dezavantajlarını, GitOps yaklaşımını gördük.

### Sonraki Adımlar

Peki bundan sonra ne yapmalı? Deneyim seviyenize göre farklı önerilerim var.

Junior arkadaşlar için önerim şu: Docker ile başlayın. Mevcut bir projeniz varsa, onun için bir Dockerfile yazın. Local'de build edip çalıştırın. "Benim makinemde çalışıyordu" problemini bir kez çözdüğünüzde, Docker'ın değerini anlayacaksınız. Sonra GitHub Actions'a geçin. Basit bir CI pipeline kurun - push'ta test çalıştırsın. Adım adım karmaşıklaştırın.

Mid-level arkadaşlar için önerim: Mevcut projenize Docker entegre edin. Development ortamını Docker Compose ile ayağa kaldırın. Vercel veya Netlify hesabı açın, bir yan proje deploy edin. Kubernetes'i local'de deneyin - Docker Desktop veya minikube ile başlayabilirsiniz. Production'a çıkmadan önce konseptleri öğrenin.

Senior arkadaşlar için önerim: GitOps workflow kurun. ArgoCD veya Flux deneyin. Canary deployment implement edin - Istio veya Linkerd ile traffic splitting yapabilirsiniz. Production monitoring ve alerting sisteminizi gözden geçirin. Observability'yi ciddiye alın - çünkü göremediğiniz şeyi yönetemezsiniz.

### Kapanış Sözü

Son olarak bir şey söylemek istiyorum. Bugün birçok araç ve teknoloji konuştuk. Ama unutmayın: CI/CD sadece bir araç seti değil, bir kültür değişimi.

DevOps dünyasında çok sevilen bir motto var: "Deploy often, deploy small, monitor everything." Sık deploy yapın. Küçük değişiklikler yapın. Her şeyi izleyin.

Eskiden deployment büyük bir olaydı. Aylar öncesinden planlanır, deployment günü herkes geç saatlere kalır, bir şey patlarsa panik başlardı. Bu model artık çalışmıyor. Rekabet çok hızlı, müşteri beklentileri çok yüksek.

Bugün konuştuğumuz araçlar ve pratiklerle, deployment artık korkulacak bir şey olmaktan çıkar. Günlük rutininizin sıradan bir parçası haline gelir. Güvenle deploy edersiniz çünkü testleriniz var, rollback stratejiniz var, monitoring'iniz var.

Bu dönüşümü yapan ekiplerin hem daha mutlu hem de daha üretken olduğunu görüyoruz. Çünkü geceleri uyuyabiliyorlar, tatillerinde bilgisayar açmak zorunda kalmıyorlar, "acaba bir şey bozuldu mu" endişesi yaşamıyorlar.

Size bu yolculukta başarılar diliyorum.

---

### Sorular?

Evet arkadaşlar, sunumun içerik kısmını tamamladık. Şimdi sorularınızı alabilirim. Herhangi bir konu hakkında - GitHub Actions, Docker, Kubernetes, deployment stratejileri, hatta bugün bahsetmediğimiz ama merak ettiğiniz konular olabilir. Buyurun.

*[5-10 dakika soru-cevap için ayır]*

---

## EK: HIZLI REFERANS KARTI

### GitHub Actions - Temel Workflow
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
```

### Docker - Temel Komutlar
```bash
docker build -t app .        # Image oluştur
docker run -p 3000:3000 app  # Container çalıştır
docker compose up -d         # Compose stack başlat
```

### Kubernetes - Temel Komutlar
```bash
kubectl apply -f manifest.yaml   # Deploy
kubectl get pods                 # Pod listesi
kubectl rollout undo deployment  # Rollback
```

### Deployment Strateji Seçimi
- **Dev/Test**: Recreate
- **Çoğu Production**: Rolling Update
- **Kritik Sistemler**: Blue-Green
- **En Düşük Risk**: Canary
