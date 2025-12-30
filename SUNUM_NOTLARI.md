# CI/CD & DevOps Sunum Konuşma Metni

**Toplam Süre:** 35-40 dakika
**Hedef Kitle:** Junior, Mid-Level ve Senior geliştiriciler

---

## GİRİŞ (3-4 dakika)

### Açılış

Merhaba arkadaşlar, bugün sizlerle CI/CD ve DevOps dünyasının temel taşlarını konuşacağız.

### Neden CI/CD Önemli?

Şunu düşünün: 2010'lu yılların başında çoğu şirket ayda bir, hatta yılda birkaç kez deployment yapardı. Şimdi Netflix günde 500'den fazla, Amazon ise saniyede ortalama bir deployment yapıyor. Bu nasıl mümkün?

Cevap basit: Otomasyon ve güvenilir süreçler.

CI/CD sadece bir teknoloji değil, bir kültür değişimi. Manuel test ve manuel deployment artık geçmişte kaldı diyebiliriz.

### Bugün Neler Öğreneceğiz?

Bugünkü sunumda 5 ana konuyu ele alacağız:

1. **GitHub Actions** - CI/CD pipeline'larımızı nasıl oluşturacağız
2. **Vercel ve Netlify** - Modern web uygulamalarını saniyeler içinde nasıl deploy edeceğiz
3. **Docker** - "Benim bilgisayarımda çalışıyordu" problemini nasıl çözeceğiz
4. **Kubernetes** - Container'ları production'da nasıl yöneteceğiz
5. **Deployment Stratejileri** - Sıfır downtime ile nasıl deployment yapacağız

Hazırsanız, GitHub Actions ile başlayalım.

---

## BÖLÜM 1: GITHUB ACTIONS (6-7 dakika)

### 1.1 GitHub Actions Nedir?

Muhtemelen çoğunuz adını duymuşsunuzdur

Şöyle bir senaryo hayal edin: Yeni bir özellik geliştirdiniz, testlerinizi kendi bilgisayarınızda çalıştırdınız, her şey yeşil, kod çalışıyor. Pull request açtınız, takım arkadaşınız onayladı, main branch'e merge ettiniz. Ertesi gün geldiniz, production patlamış. Neden? Çünkü takım arkadaşınızın bir hafta önce yaptığı değişiklikle sizin kodunuz çakışmış. Ya da siz Node 20 kullanıyorsunuz ama production'da Node 18 var, ufak bir syntax farkı her şeyi bozmuş.

İşte GitHub Actions tam olarak bu tür sorunları çözmek için var. Her push'ta, her pull request'te otomatik olarak testlerinizi çalıştırıyor, build alıyor, hatta isterseniz direkt production'a deploy ediyor. Siz daha merge etmeden, kodunuzun tüm ortamlarda çalışıp çalışmadığını görüyorsunuz.

En büyük avantajı şu: GitHub ile birebir entegre. Birkaç YAML dosyasıyla tanımlanıyor. Reponuz neredeyse, CI/CD'niz de orada.

### 1.2 Temel Mimari

_[Mimari diyagramını göster]_

GitHub Actions mimarisini anlamak için 5 temel kavramı bilmemiz gerekiyor.

Birincisi Event. Event, workflow'u tetikleyen olay demek. Birileri push yaptığında tetiklenebilir, pull request açıldığında tetiklenebilir, "Hangi durumda bu otomasyon çalışsın?" sorusunun cevabı event'tir.

İkincisi Workflow. Tüm otomasyonunuzu burada tanımlıyorsunuz. Bir repo'da birden fazla workflow olabilir - biri test için, biri deployment için gibi.

Üçüncüsü Job. Job, bir workflow içindeki iş parçacıklarıdır. Mesela bir workflow'da "test" job'ı var, "build" job'ı var, "deploy" job'ı var. Bunlar paralel çalışabilir ya da birbirlerini bekleyebilir. "Testler geçmedikçe build yapma" gibi bağımlılıklar tanımlayabilirsiniz.

Dördüncüsü Step. Step, job içindeki adımlardır.

Beşincisi Runner. Runner, işlerin çalıştığı makinedir. GitHub size Ubuntu, Windows, macOS seçenekleri sunuyor. Hatta isterseniz kendi sunucunuzu self-hosted runner olarak tanımlayabilirsiniz.

### 1.3 Örnek Workflow

_[Workflow kodunu göster]_

Şimdi gerçek bir workflow örneğine bakıp ne yaptığını tam anlayalım.

İlk kısımda trigger'ları görüyoruz:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

Bu ne diyor? Main veya develop branch'ine push yapıldığında çalış. Ayrıca main'e açılan pull request'lerde de çalış. Yani hem merge sonrası hem de merge öncesi kontrol ediyoruz.

Sonra job tanımına bakıyoruz:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
```

Burada çok güçlü bir özellik var: matrix strategy. Bu ne demek? Aynı testi 3 farklı Node versiyonunda paralel olarak çalıştır. Tek bir job tanımıyla aslında 3 ayrı iş çalıştırıyorsunuz. Node 18'de çalışıyor ama Node 22'de hata veriyor gibi durumları anında yakalıyorsunuz.

Bir de job'lar arası bağımlılığa bakalım:

```yaml
build:
  needs: test
```

Build job'ı "needs: test" diyor. Yani testler geçmedikçe build başlamıyor.

### 1.4 Secrets Yönetimi

_[Secrets kodunu göster]_

Şimdi kritik bir konuya değinelim: Hassas bilgilerin yönetimi. Bu konu özellikle junior arkadaşların sıkça hata yaptığı bir alan.

API key'leri, database şifreleri, private token'lar asla ama asla koda yazılmaz. Git history sonsuza kadar saklar, bir kez commit'lediyseniz o bilgi artık orada. Repo public olsa da olmasa da, bu bilgiler güvende değil demektir.

GitHub Secrets tam olarak bunun için var. Üç farklı seviyede secret tanımlayabilirsiniz:

Repository Secrets: Sadece o repo'ya özel. Mesela projenizin Vercel deploy token'ı.

Organization Secrets: Tüm organizasyondaki repolarda kullanılabilir. Bir kez tanımlarsınız, 50 repo'da kullanırsınız.

Environment Secrets: Bu en gelişmiş olanı. Production, staging, development gibi ortamlar tanımlıyorsunuz. Her ortamın kendi secret'ları var.

### 1.5 Best Practices

_[Best practices listesini göster]_

GitHub Actions kullanırken yıllar içinde öğrendiğimiz bazı best practice'ler var.

Önce performans tarafına bakalım. Her workflow çalıştığında npm paketlerini sıfırdan indirmek hem yavaş hem de gereksiz. GitHub'ın cache action'ı ile node_modules'ı cache'leyebilirsiniz, workflow süreniz yarıya düşer.

Matrix builds ile paralel çalıştırabildiğimizi görmüştük, 3 test seri çalışacağına paralel çalışsın, 3 kat hızlansın. Bazen bir test sonsuz döngüye girer ya da network beklerken takılır. Timeout koymazsanız dakikalarınızı, hatta saatlerinizi yiyebilir.

Güvenlik tarafında ise şunu bilin: Action versiyonlarını SHA ile pinleyin. Ne demek bu? `actions/checkout@v4` yazmak yerine `actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11` gibi tam commit hash'i yazın. Neden? Çünkü v4 etiketi değiştirilebilir. Birisi o action'ın sahibiyse, v4'ün gösterdiği kodu değiştirebilir. Ama commit hash değiştirilemez, o hash her zaman aynı kodu gösterir. Paranoyakça gelebilir ama supply chain attack'lar gerçek bir tehdit.

Bir de GITHUB_TOKEN konusu var. Her workflow otomatik olarak bir GITHUB_TOKEN alır. Varsayılan olarak bu token'ın oldukça geniş yetkileri var. Workflow'unuz sadece PR'a yorum atacaksa, ona sadece `pull-requests: write` yetkisi verin, repo'yu silme yetkisi vermeyin. Minimum yetki prensibi burada da geçerli.

---

## BÖLÜM 2: VERCEL VS NETLIFY (5-6 dakika)

### 2.1 Neden Bu Platformlar?

Pekala, GitHub Actions ile CI/CD pipeline'larımızı kurabiliyoruz artık. Testler çalışıyor, build alınıyor. Ama bu build'i nereye deploy edeceğiz onu göreceğiz.

Geleneksel yöntemi düşünelim: Bir VPS kiralarsınız, sunucuya SSH ile bağlanırsınız, reverse proxy ayarlarsınız, SSL sertifikası kurarsınız gibi gibi Bu süreç saatler, hatta günler alır. Üstelik her deployment'ta aynı şeyleri tekrarlamanız gerekir.

Şimdi modern yönteme bakalım: Git push yaparsınız, 30 saniye sonra siteniz canlı. SSL hazır, CDN hazır.

İşte Vercel ve Netlify bu ikinci yöntemi sunan platformlar. İkisi de özellikle frontend uygulamalar için optimize edilmiş. JAMstack - yani JavaScript, API ve serverless yaklaşıma odaklanıyorlar.

Bugün bu iki platformu karşılaştıracağız ki sizin projeniz için hangisinin daha uygun olduğuna karar verebilesiniz.

### 2.2 Platform Karşılaştırması

_[Karşılaştırma tablosunu göster]_

Her iki platformun da güçlü yanları var, birlikte bakalım.

Vercel'den başlayalım. Vercel'in kurucusu aynı zamanda Next.js'in de yaratıcısı. Bu ne demek? Vercel, Next.js için biçilmiş kaftan.

Next.js'in tüm gelişmiş özellikleri Vercel'de en iyi şekilde çalışıyor. Hatta bazı özellikler Vercel'de çalışıp başka platformlarda düzgün çalışmıyor bile. Next.js kullanıyorsanız, Vercel doğal seçim.

Netlify ise JAMstack hareketinin öncüsü. Netlify daha framework-agnostic bir yaklaşım sergiliyor. Next.js, vue, angular gibi tekknolojilerin hepsinde iyi çalışır. Netlify'ın ek olarak sunduğu built-in form handling özelliği var. Sayfanıza bir form koyuyorsunuz, backend yazmadan form verilerini toplayabiliyorsunuz.

Her iki platformda da ortak özellikler mevcut: Git push yaptığınızda otomatik deployment, her pull request için ayrı bir preview URL, global CDN üzerinden dağıtım, serverless function desteği sunuyolar.

Temel özellikler açısından birbirlerine çok yakınlar.

### 2.3 Konfigürasyon

_[Config dosyalarını göster]_

Konfigürasyon yaklaşımlarına bakalım

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

Netlify'ın burada çok güzel bir özelliği var: Context bazlı konfigürasyon. Production deployment için bir API URL'i, preview deployment'lar için farklı bir API URL'i tanımlayabiliyorsunuz. Vercel'de de aynı şeyi yapabilirsiniz ama dashboard üzerinden, dosya bazlı değil.

### 2.4 Serverless Functions

_[Function kodlarını göster]_

Her iki platformda da serverless function yazabiliyorsunuz. Bu, basit backend ihtiyaçlarınızı karşılayabileceğiniz anlamına geliyor. Tam teşekküllü bir backend server'a ihtiyacınız olmadan API endpoint'leri oluşturabilirsiniz.

Vercel'de iki tür function var:

Serverless Functions ve Edge Functions. Serverless Functions klasik Lambda tarzı, Node.js runtime'da çalışıyor.

Edge Functions ise kullanıcıya en yakın lokasyonda çalışıyor. Bir kullanıcı İstanbul'daysa, function İstanbul'daki edge node'da çalışır. Bu da çok düşük latency demek.

Netlify’da Functions ve Edge Functions’a ek olarak Background Functions da var.
Uzun süren işler için ideal: 15 dakikaya kadar arka planda çalışır, kullanıcıyı bekletmiyor.

### 2.5 Hangisini Seçmeli?

_[Karar ağacını göster]_

Peki hangisini seçmeliyiz? Size basit bir karar ağacı sunayım.

Eğer Next.js kullanıyorsanız, Vercel seçin. Bu konuda tartışmaya gerek yok.

Eğer farklı bir framework kullanıyorsanız - Vue, angular ne olursa olsun - Netlify genellikle daha iyi uyumluluk sunuyor.

Eğer sitenizde form'lar var ve backend yazmak istemiyorsanız, Netlify'ın built-in form handling özelliği çok işinize yarayacaktır eminim ki.

Sonuç olarak şunu söyleyeyim: İkisi de mükemmel platformlar. Yanlış seçim yok aslında. Hangisinin developer experience'ını daha çok sevdiğinize kendiniz karar verebilirsiniz.

---

## BÖLÜM 3: DOCKER (7-8 dakika)

### 3.1 Docker Neden Gerekli?

Şimdi bugünkü sunumun belki de en temel konusuna geliyoruz: Docker. Docker bilmek artık bir tercih değil, zorunluluk haline geldi.

Şöyle bir senaryo düşünelim: 5 kişilik bir ekipsiniz. Projeniz Node.js 18 gerektiriyor. Ama takım arkadaşınızın bilgisayarında Node 16 var, bir başkasında Node 20 var. Siz macOS kullanıyorsunuz.

Docker bu problemi kökten çözüyor. Uygulamanızı, tüm bağımlılıklarıyla birlikte - Node versiyonu, sistem kütüphaneleri, environment variable'ları, her şeyiyle - tek bir paket haline getiriyorsunuz. Bu paketi hangi makinede çalıştırırsanız çalıştırın, aynı sonucu alıyorsunuz.

### 3.2 Container vs VM

_[Karşılaştırma diyagramını göster]_

Virtual Machine'de neler oluyor? Her VM için ayrı bir işletim sistemi kuruyorsunuz. 3 tane VM çalıştıracaksanız, 3 ayrı Ubuntu kurulumu demek bu. Her birinin kernel'ı var, sistem kütüphaneleri var, init process'i var. Bu da ne demek? Her VM gigabyte'larca disk alanı kaplıyor. Bir VM'i açmak dakikalar alıyor çünkü tam bir işletim sistemi boot ediliyor. Ve bir sunucuya en fazla 5-10 VM sığdırabilirsiniz.

Container'larda durum çok farklı. Container'lar host işletim sisteminin kernel'ını paylaşıyor. Ayrı bir işletim sistemi yok, sadece uygulamanız ve onun bağımlılıkları izole ediliyor.

Pratik bir örnek vereyim: Tipik bir Ubuntu VM 2-3 GB disk alanı kaplar, açılması 30-60 saniye sürer. Tipik bir Node.js container'ı 100-200 MB disk alanı kaplar, açılması 2-3 saniye sürer. Aradaki fark devasa.

### 3.3 Temel Kavramlar

_[Kavramlar diyagramını göster]_

önce 4 temel kavramı anlamamız gerekiyor.

Birincisi Image. Image, uygulamanızın read-only şablonudur. Bir tarif gibi düşünün. Dockerfile adlı bir dosyada tarifi yazıyorsunuz - hangi base image kullanılacak, hangi dosyalar kopyalanacak, hangi komutlar çalıştırılacak. Bu tariften çıkan ürün image'dır.

İkincisi Container. Container, image'ın çalışan halidir. Image'ı tarif demiştik, container da o tariften yapılmış yemek. Bir image'dan istediğiniz kadar container çalıştırabilirsiniz. 10 kullanıcı aynı anda sistemi kullanacaksa, aynı image'dan 10 container çalıştırırsınız.

Üçüncüsü Registry. Registry, image'ların depolandığı ve paylaşıldığı yerdir.

Dördüncüsü Volume. Container'lar varsayılan olarak geçicidir. Container'ı sildiğinizde içindeki tüm veriler gider.Container silinse bile volume'daki veriler kalır.

### 3.4 Dockerfile Yazımı

_[Dockerfile kodunu göster]_

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

Üçüncü ve son aşamada sadece production'da çalışması gereken dosyaları alıyoruz. Sadece çalıştırılabilir kod var.

Sonuç ne oluyor? Normal bir build yapsaydınız 1 GB civarı bir image olacaktı. Multi-stage build ile 100-150 MB'a kadar düşürüyorsunuz. Bu ne demek? Daha hızlı deploy demek - image'ı çekmek çok daha kısa sürüyor.

### 3.5 Docker Compose

_[Docker Compose kodunu göster]_

bir uygulama tek başına çalışmaz. Web uygulamanız var, arkasında PostgreSQL database var, performans için Redis cache var. Bunların hepsini ayrı ayrı docker run komutuyla çalıştırmak hem zahmetli hem de hata yapmaya açık.

Docker Compose tam olarak bu problemi çözüyo. Tüm servislerinizi tek bir YAML dosyasında tanımlıyorsunuz ve tek komutla hepsini ayağa kaldırıyorsunuz.

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

<!-- Burada iki önemli kavram var. Birincisi depends_on - bu servis şu servise bağımlı demek. Ama sadece "bağımlı" demek yetmiyor çünkü bir servisin container'ı başladı diye hazır olduğu anlamına gelmiyor. PostgreSQL container'ı başladı ama henüz connection kabul etmiyorsa ne olacak?

İşte bu yüzden ikinci kavram var: healthcheck. Database'e "hazır mısın?" diye soruyoruz. pg_isready komutu PostgreSQL'in bağlantı kabul etmeye hazır olup olmadığını kontrol ediyor. condition: service_healthy dediğimizde, uygulama ancak database sağlıklı duruma geçtikten sonra başlıyor. -->

docker compose up -d. Arka planda çalışıyor, terminali meşgul etmiyor. İşiniz bittiğinde docker compose down ile her şeyi kapatıyorsunuz.

## BÖLÜM 4: KUBERNETES (8-9 dakika)

### 4.1 Kubernetes Neden Gerekli?

Docker ile container'lar oluşturmayı öğrendik, Ama şimdi şöyle düşünelim: Bir container çalıştırmak kolay. Peki 10 tane container yöneteceksek? 100 tane?

örneğin gece 3'te bir container crash oldu, kim restart edecek? traffic 10 katına çıktı, yeni container'lar kim oluşturacak? yeni versiyon deploy edeceğiz, kullanıcılar kesinti yaşamadan nasıl yapacağız?

İşte Kubernetes tam olarak bu soruların cevabı.

Üç temel özelliğine bakalım.

Birincisi self-healing: Bir container crash olursa, Kubernetes otomatik olarak yenisini başlatıyor. Sizin müdahalenize gerek yok, gece uyurken bile sistem kendini iyileştiriyor.

İkincisi auto-scaling: CPU kullanımı yükseldi mi, Kubernetes otomatik olarak yeni container'lar oluşturuyor. Trafik düştü mü, gereksiz container'ları kapatıyor.

Üçüncüsü zero-downtime deployment: Yeni versiyon deploy ederken eski versiyon çalışmaya devam ediyor. Yeni versiyon tamamen hazır olunca trafik oraya yönlendiriliyor. Kullanıcılar hiçbir kesinti yaşamıyor.

### 4.2 Mimari

_[Mimari diyagramını göster]_

Kubernetes mimarisini anlamak için onu iki ana parçaya ayıralım: Control Plane ve Worker Nodes. Control Plane beyindir, kararları alır. Worker Nodes ise kollardır, işi yapar.

Control Plane'de 4 kritik bileşen var:

API Server tüm iletişimin merkezidir. Siz kubectl komutu çalıştırdığınızda, o komut API Server'a gider. Her şey buradan geçer.

etcd bir key-value veritabanıdır ve cluster'ın tüm state'ini tutar. Hangi pod nerede çalışıyor, hangi servis hangi pod'lara yönlendiriyor, hepsi burada kayıtlı.

Scheduler yeni oluşturulacak pod'lar için yer belirler. Node'ların kaynak durumunu, pod'un gereksinimlerini ve en uygun node'u seçer.

Controller Manager cluster'ın istenen durumuyla gerçek durumunu sürekli karşılaştırır. Siz "3 replica çalışsın" dediniz, o 3 tane çalıştığından emin olur. Birisi öldü mü? Yenisini başlatır. Fazla mı var? Fazlalığı kapatır.

Worker Node'larda da 3 bileşen var:

kubelet her node'da çalışan bir agent'tır. Control Plane'den "bu pod'u çalıştır" emrini alır ve çalıştırır. Pod'un sağlığını izler, sorun varsa raporlar.

kube-proxy networking'den sorumludur. Bir pod başka bir servise bağlanmak istediğinde, kube-proxy o trafiği doğru pod'a yönlendirir. Aslında bir load balancer gibi çalışır.

Container Runtime container'ları çalıştıran yazılımdır.

### 4.3 Temel Objeler

_[Objeler listesini göster]_

Kubernetes'te her şey bir objedir. Bu objeleri YAML dosyalarıyla tanımlarsınız ve kubectl apply komutuyla cluster'a uygularsınız. En sık karşılaşacağınız objelere bakalım.

Pod, Kubernetes'in en küçük deploy edilebilir birimidir. İçinde bir veya daha fazla container olabilir.

Deployment, pod'ların yöneticisidir. Siz "3 tane nginx çalıştır" dersiniz, Deployment 3 pod oluşturur. Birisi crash olursa yenisini yaratır.

Service, pod'lara sabit bir erişim noktası sağlar. Pod'ların IP adresleri sürekli değişir - pod ölür yenisi doğar, farklı IP alır. Ama Service IP'si sabit kalır. Diğer pod'lar servise IP veya isimle bağlanır, Service de trafiği arkadaki pod'lara dağıtır.

Ingress, dış dünyadan gelen HTTP trafiğini yönetir. Tek bir IP'den birden fazla servise yönlendirme yapabilirsiniz. SSL sertifikası yönetimi de Ingress üzerinden yapılır.

ConfigMap ve Secret konfigürasyon verilerini tutar. Environment variable'ları, config dosyalarını pod'un dışında tutarsınız. Pod değişse bile config aynı kalır.

<!-- ### 4.4 Helm -->

<!-- _[Helm kodunu göster]_

Kubernetes manifest dosyaları büyüyünce yönetmek zorlaşıyor. 10 tane mikro servisiniz var, her birinin Deployment'ı, Service'i, ConfigMap'i var. Staging ve production için farklı değerler kullanmanız gerekiyor. Her yerde aynı şeyleri tekrar ediyorsunuz.

Helm, Kubernetes için bir package manager'dır.npm gibi düşünün ama Kubernetes uygulamaları için.

values.yaml adlı bir dosyada değişkenlerinizi tanımlıyorsunuz:

```yaml
replicaCount: 3
image:
  repository: myapp
  tag: "1.0.0"
```

Template dosyalarında bu değerleri kullanıyorsunuz. Farklı ortamlar için farklı values dosyaları oluşturuyorsunuz - values-dev.yaml, values-staging.yaml, values-prod.yaml gibi. Development'ta 1 replica, production'da 5 replica. Development'ta 256MB memory, production'da 2GB memory.

Kurulum tek komutla: helm install myapp ./chart -f values-prod.yaml. Güncelleme: helm upgrade. Geri alma: helm rollback. Kaldırma: helm uninstall. Tüm Kubernetes objeleriniz tek birim olarak yönetiliyor.

--- -->

## BÖLÜM 5: DEPLOYMENT STRATEGIES (5-6 dakika)

### 5.1 Neden Strateji Önemli?

Şimdi bugünkü sunumun belki de en kritik konusuna geldik: Deployment stratejileri. Bu konu neden bu kadar önemli? Çünkü yanlış strateji seçimi doğrudan para kaybına, müşteri kaybına ve itibar kaybına yol açıyor.

Bir rakam vereyim: Amazon'un hesaplamalarına göre, 1 dakikalık downtime şirkete yaklaşık 220.000 dolar kaybettiriyor. Dakikada 220.000 dolar.

Peki doğru stratejiyi nasıl seçeceğiz? İki temel faktöre bakmalıyız. Birincisi risk toleransınız: Bu sistem ne kadar kritik? Internal bir dashboard mı yoksa canlı ödeme sistemi mi? İkincisi kaynak durumunuz: İki kat sunucu maliyetini karşılayabilir misiniz? Bazı stratejiler daha fazla kaynak gerektiriyor.

Dört ana deployment stratejisi var ve her birinin kendine göre avantajları ve dezavantajları var. Hepsini inceleyelim ki hangi durumda hangisini kullanacağımızı bilelim.

### 5.2 Recreate

_[Recreate diyagramını göster]_

İlk strateji en basit olanı: Recreate. Ne yapıyor? Mevcut versiyonu tamamen durdur, sonra yeni versiyonu başlat. Tek satırlık konfigürasyon:

```yaml
strategy:
  type: Recreate
```

Avantajı ne? Çok basit, anlaşılması kolay. Ayrıca clean state garantisi var - eski ve yeni versiyon asla aynı anda çalışmıyor.

Dezavantajı ne? Downtime var. Eski versiyon kapanıyor, yeni versiyon açılıyor, arada bir boşluk oluyor. Bu boşlukta kullanıcılar servise erişemiyor.

Ne zaman kullanmalı? Development ve test ortamlarında rahatlıkla kullanabilirsiniz, downtime kimseyi etkilemiyor.

Production'da müşteriye dönük sistemler için uygun değil.

### 5.3 Rolling Update

_[Rolling Update diyagramını göster]_

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

Dezavantajı: Güncelleme sırasında eski ve yeni versiyon aynı anda çalışıyor. Bu ne demek? Bir kullanıcının isteği eski versiyona gidebilir, bir sonraki isteği yeni versiyona.

Çoğu proje için Rolling Update yeterli ve önerilen strateji. Eğer API'niz backward compatible tasarlanmışsa - ki bu zaten iyi bir pratik - Rolling Update ile devam edin.

### 5.4 Blue-Green

_[Blue-Green diyagramını göster]_

Üçüncü strateji Blue-Green deployment. Burada iki ayrı ortam var: Blue mevcut çalışan versiyon, Green yeni versiyon.

Akış şöyle işliyor: Önce Green ortamını deploy ediyorsunuz ama henüz trafik almıyor. Green'i iyice test ediyorsunuz - smoke testler, integration testler, hatta manual test. Her şey yolundaysa, load balancer'ı Green'e yönlendiriyorsunuz. Tek bir switch ile tüm trafik yeni versiyona geçiyor.

```yaml
# Service selector'ı değiştirerek switch
selector:
  app: myapp
  version: green # blue'dan green'e çevir
```

Ve işin güzel tarafı: Problem olursa, aynı switch'i geri çeviriyorsunuz ve anında Blue'ya dönüyorsunuz. Rollback saniyeler içinde oluyor.

Avantajları: Anında geçiş, anında geri dönüş. Test edilmiş versiyona geçiyorsunuz, risk düşük.

Dezavantajı: İki kat kaynak gerekiyor. 3 pod yerine 6 pod çalışıyor. Bir ortam aktif, biri beklemede. Altyapı maliyetiniz artıyor.

Ne zaman kullanmalı? Kritik production sistemlerinde. Finans uygulamaları, e-ticaret siteleri, ödeme sistemleri - hata kabul edilemeyecek yerlerde.

### 5.5 Canary

_[Canary diyagramını göster]_

Dördüncü strateji en düşük riskli olanı: küçük bir grup kullanıcı önce yeni versiyonu deneyimliyor.

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

Dezavantajları: Yavaş rollout - tam geçiş saatler, hatta günler alabilir. Ve monitoring şart - metrikleri sürekli izlemezseniz canary'nin anlamı kalmıyor.

Netflix, Google, Facebook gibi büyük şirketler Canary kullanıyor. Milyonlarca kullanıcınız varsa, %1'lik bir canary bile on binlerce kişi demek - yeterli veri topluyorsunuz.

### 5.6 GitOps ve ArgoCD

_[GitOps diyagramını göster]_

Son olarak modern deployment olan GitOps.

GitOps'un prensibi çok basit: Kubernetes manifest'leriniz, Helm chart'larınız, konfigürasyonlarınız - hepsi Git'te saklanıyor. Ve sadece Git'te olan şey cluster'da çalışıyor.

Bizim projelerimizde de kullandığımız, ArgoCD bu prensibi uygulayan en popüler araçlardan biri. ArgoCD Git repository'nizi sürekli izliyor. Siz Git'e bir değişiklik push'ladığınızda, ArgoCD bunu görüyor ve cluster'ı otomatik olarak senkronize ediyor.

Bu yaklaşımın birçok avantajı var.
Birincisi audit trail: Kim ne zaman ne değiştirdi? Git history'de.
İkincisi easy rollback: Bir şey ters giderse git revert ile anında geri alabilirsiniz.
Üçüncüsü review process: Deployment değişiklikleri de normal kod gibi PR süreci geçiyor. Takım arkadaşınız review ediyor, onaylıyor, sonra merge oluyor.

Artık "production'a kim deploy etti?" sorusu yok. Git history'ye bakıyorsunuz, orada yazıyor.

---

## KAPANIŞ (2-3 dakika)

### Sorular?

Evet arkadaşlar, sunumun içerik kısmını tamamladık. Şimdi sorularınızı alabilirim. Herhangi bir konu hakkında - GitHub Actions, Docker, Kubernetes, deployment stratejileri, hatta bugün bahsetmediğimiz ama merak ettiğiniz konular olabilir. Buyurun.

_[5-10 dakika soru-cevap için ayır]_
