# CI/CD & DevOps Sunum Notları

Bu dokümanda her slayt için konuşmacı notları bulunmaktadır.

---

## 1. GitHub Actions

### 1.1 GitHub Actions Nedir?

GitHub Actions, GitHub'ın kendi CI/CD çözümüdür. Repo içinde workflow tanımlayarak kod push edildiğinde, PR açıldığında veya zamanlanmış şekilde otomatik işlemler çalıştırabilirsiniz.

En büyük avantajı GitHub ile native entegrasyon. Ayrı bir CI/CD aracı kurmaya gerek yok. YAML dosyaları ile workflow tanımlıyorsunuz ve GitHub bunu çalıştırıyor.

Marketplace'te 15 binden fazla hazır action var. Yani tekerleği yeniden icat etmenize gerek yok.

---

### 1.2 GitHub Actions Mimarisi

Mimariye bakarsak: En üstte event'ler var - push, pull request, schedule gibi. Bu event'ler workflow'u tetikliyor.

Workflow içinde job'lar var, job'lar içinde step'ler. Her job bir runner üzerinde çalışıyor - Ubuntu, Windows veya macOS olabilir. Kendi self-hosted runner'ınızı da kullanabilirsiniz.

Step'ler iki türlü olabilir: Ya hazır bir action kullanırsınız "uses" ile, ya da direkt komut çalıştırırsınız "run" ile.

---

### 1.3 Workflow Yapısı

İşte tipik bir workflow örneği. "on" kısmında hangi event'lerde çalışacağını belirtiyoruz.

Jobs altında test ve build job'ları var. Test job'ı matrix strategy kullanıyor - 3 farklı Node versiyonunda paralel test çalıştırıyor.

Build job'ı "needs: test" diyor, yani testler geçmeden build başlamıyor. Artifact upload ile build çıktısını saklıyoruz.

---

### 1.4 Secrets & Environment Yönetimi

Hassas bilgileri asla koda yazmıyoruz. GitHub Secrets kullanıyoruz.

Üç seviye secret var: Repository seviyesinde tek repo için, Organization seviyesinde tüm repolar için, Environment seviyesinde production/staging gibi ortamlar için.

Environment'lar ayrıca protection rules da sağlıyor. Mesela production'a deploy için approval gerektirebilirsiniz.

---

### 1.5 Matrix Strategy & Caching

Matrix strategy çok güçlü. Burada 3 OS ve 3 Node versiyonu var - toplamda 9 kombinasyon paralel çalışıyor.

Include ile özel kombinasyonlar ekleyebilir, exclude ile bazılarını çıkarabilirsiniz.

Cache action'ı çok önemli. npm paketlerini her seferinde indirmek yerine cache'den alıyoruz. Build sürelerini ciddi şekilde kısaltıyor.

---

### 1.6 Reusable Workflows

DRY prensibi burada da geçerli. Aynı workflow'u birden fazla yerde kullanacaksanız, reusable workflow oluşturun.

workflow_call event'i ile çağrılabilir hale getiriyorsunuz. Input ve secret parametreleri tanımlayabilirsiniz.

Başka bir workflow "uses" ile bu workflow'u çağırabiliyor. Merkezi değişiklik yapınca tüm kullanan yerler güncelleniyor.

---

### 1.7 GitHub Actions Best Practices

Performans için: Cache kullanın, matrix builds ile paralel çalıştırın, timeout belirleyin.

Güvenlik için: Action versiyonlarını SHA ile pinleyin. Tag yerine commit hash kullanmak daha güvenli çünkü tag değiştirilebilir.

GITHUB_TOKEN'a minimum yetki verin. permissions bloğu ile sadece gereken izinleri tanımlayın.

---

## 2. Vercel vs Netlify

### 2.1 Platform Karşılaştırması

İki platform da modern web uygulamaları için popüler deployment çözümleri.

Vercel, Next.js'in yaratıcısı Guillermo Rauch'un şirketi. Doğal olarak Next.js için optimize edilmiş.

Netlify ise JAMstack'in öncüsü. Daha framework-agnostic bir yaklaşımı var. Built-in form handling ve identity management gibi ekstra özellikleri var.

---

### 2.2 Deployment Modeli

Her ikisi de Git-based deployment sunuyor. Push yaptığınızda otomatik build ve deploy.

Preview deployments ikisinde de var - her PR için ayrı URL.

Vercel'de ISR var - Incremental Static Regeneration. Static sayfaları belirli aralıklarla yenileyebiliyorsunuz.

Netlify'da DPR var - Distributed Persistent Rendering. Benzer konsept, farklı implementasyon.

---

### 2.3 Konfigürasyon Karşılaştırması

Vercel JSON formatında config kullanıyor. Functions, redirects, headers tanımlayabiliyorsunuz.

Netlify TOML formatını tercih ediyor. Context bazlı config yapabiliyorsunuz - production ve preview için farklı ayarlar.

İkisi de benzer yetenekler sunuyor, syntax farklı.

---

### 2.4 Serverless Functions

Vercel'de iki tür function var: Serverless ve Edge. Edge functions daha hızlı cold start'a sahip, kullanıcıya yakın lokasyonlarda çalışıyor.

Netlify'da da benzer şekilde Functions ve Edge Functions var.

Syntax biraz farklı ama konsept aynı. Request alıp response dönüyorsunuz.

---

### 2.5 Fiyatlandırma Karşılaştırması

Free tier'da Vercel daha cömert build dakikası veriyor - 6000 dakika. Netlify'da 300 dakika.

Bandwidth ikisinde de 100 GB.

Netlify'ın avantajı built-in forms ve identity. Vercel'de bunlar yok, harici servis kullanmanız gerekiyor.

Pro tier'da ikisi de benzer fiyatlarda, aylık 20 dolar civarı.

---

### 2.6 Hangi Durumda Hangisi?

Next.js kullanıyorsanız Vercel açık ara önde. Native destek, en iyi performans.

Farklı framework'ler kullanıyorsanız veya form handling, A/B testing gibi built-in özellikler istiyorsanız Netlify mantıklı.

Sonuçta ikisi de mükemmel platformlar. Proje gereksinimlerinize göre seçin.

---

## 3. Docker

### 3.1 Docker Nedir?

Docker, "works on my machine" problemini çözen container teknolojisi.

VM'den farkı: VM'de her uygulama için ayrı OS kuruyorsunuz, gigabyte'larca yer kaplıyor, dakikalar içinde açılıyor.

Container'da OS paylaşılıyor, megabyte'lar seviyesinde, saniyeler içinde ayağa kalkıyor. Çok daha verimli.

---

### 3.2 Docker Bileşenleri

Temel kavramlar: Image read-only şablon, Container çalışan instance.

Dockerfile'dan image oluşturuyorsunuz, image'ı registry'e push ediyorsunuz, başka makineden pull edip container olarak çalıştırıyorsunuz.

Volume ile kalıcı veri saklıyorsunuz, Network ile container'lar arası iletişim sağlıyorsunuz.

---

### 3.3 Dockerfile Best Practices

Multi-stage build çok önemli. Burada 3 stage var: deps, builder, runner.

İlk stage'de dependency'leri yüklüyoruz, ikincide build yapıyoruz, üçüncüde sadece production'a gerekli dosyaları alıyoruz.

Sonuç: 1 GB'lık image 100 MB'a düşüyor. Hem güvenlik hem performans açısından büyük fark.

---

### 3.4 Docker Compose

Birden fazla container'ı birlikte yönetmek için Compose kullanıyoruz.

Bu örnekte app, database ve cache servisleri var. depends_on ile başlatma sırası, healthcheck ile hazırlık kontrolü yapıyoruz.

Tek komutla tüm stack ayağa kalkıyor: docker compose up

---

### 3.5 Sık Kullanılan Komutlar

Günlük kullanacağınız komutlar bunlar.

build ile image oluştur, run ile container başlat, logs ile takip et, exec ile içine gir.

Compose komutları da benzer: up başlat, down durdur, logs takip et.

system prune ile kullanılmayan kaynakları temizlemeyi unutmayın, disk dolabilir.

---

### 3.6 Docker Güvenlik

Güvenlik için: Root kullanmayın, non-root user oluşturun.

Resmi base image'lar kullanın, vulnerability scanner ile tarayın.

Multi-stage build ile gereksiz dosyaları production image'dan çıkarın.

Resource limits tanımlayın - bir container tüm CPU/memory'yi tüketmesin.

---

### 3.7 Docker + CI/CD

GitHub Actions ile Docker build ve push örneği.

Buildx ile multi-platform build yapabiliyorsunuz. Cache-from ve cache-to ile layer cache kullanarak build sürelerini kısaltıyorsunuz.

Metadata action ile otomatik tag oluşturuyorsunuz - semver ve commit SHA.

---

## 4. Kubernetes

### 4.1 Kubernetes Nedir?

Kubernetes, container orchestration platformu. Docker container'ları production'da yönetmek için kullanıyoruz.

Self-healing var - container crash olursa otomatik restart. Auto-scaling var - yük artınca otomatik ölçekleme. Service discovery var - container'lar birbirini buluyor.

Google'ın Borg sisteminden esinlenilmiş, şu an CNCF altında açık kaynak.

---

### 4.2 Kubernetes Mimarisi

İki ana bölüm var: Control Plane ve Worker Nodes.

Control Plane'de API Server var - tüm iletişim buradan geçiyor. etcd key-value store - cluster state burada. Scheduler pod'ları node'lara atıyor. Controller Manager desired state'i korumaya çalışıyor.

Worker Node'larda kubelet var - pod'ları yönetiyor. kube-proxy networking sağlıyor. Container runtime - genellikle containerd.

---

### 4.3 Temel Kubernetes Objeleri

Pod en küçük birim - bir veya daha fazla container içerir.

Deployment pod'ların declarative yönetimini sağlıyor - kaç replica, hangi image, nasıl update.

Service pod'lara stable endpoint veriyor. Pod IP'leri değişir ama Service IP sabit kalır.

ConfigMap ve Secret konfigürasyon için. Ingress HTTP routing için.

---

### 4.4 Deployment Manifest

Tipik bir Deployment YAML'ı. replicas: 3 diyoruz, 3 pod çalışacak.

RollingUpdate strategy ile sıfır downtime güncelleme. maxSurge: 1 - güncelleme sırasında 1 fazla pod olabilir. maxUnavailable: 0 - her zaman en az 3 pod hazır.

Resource limits önemli - request minimum garanti, limit maksimum kullanım.

Liveness ve readiness probe'lar health check için.

---

### 4.5 Service & Ingress

Service türleri: ClusterIP cluster içi, NodePort dışarı açık port, LoadBalancer cloud load balancer.

Ingress HTTP/HTTPS routing sağlıyor. Path-based routing yapabilirsiniz - /api farklı servise, / farklı servise.

TLS termination Ingress seviyesinde. cert-manager ile otomatik Let's Encrypt sertifikası alabilirsiniz.

---

### 4.6 Horizontal Pod Autoscaler

HPA CPU veya memory kullanımına göre otomatik ölçekleme yapıyor.

Bu örnekte CPU %70'i geçince scale-up, altına düşünce scale-down.

Behavior kısmı önemli - stabilization window ile ani dalgalanmaları önlüyorsunuz. Scale-down için 5 dakika bekliyor, scale-up anında.

---

### 4.7 kubectl Komutları

Günlük kubectl komutları bunlar.

get ile resource'ları listele, describe ile detay gör, logs ile log takibi, exec ile pod içine gir.

apply ile YAML'dan resource oluştur veya güncelle.

rollout ile deployment durumunu kontrol et, gerekirse rollback yap.

---

### 4.8 Helm - Kubernetes Package Manager

Helm, Kubernetes için package manager. Karmaşık uygulamaları tek komutla deploy edebiliyorsunuz.

Chart.yaml metadata, values.yaml default değerler içeriyor.

helm install ile kur, helm upgrade ile güncelle, helm rollback ile geri al.

Bitnami gibi repo'lardan hazır chart'lar kullanabilirsiniz.

---

## 5. Deployment Strategies

### 5.1 Deployment Stratejileri

Deployment stratejisi seçimi risk ve hız dengesini belirliyor.

Recreate en basit ama downtime var. Rolling Update kademeli ve güvenli. Blue-Green anında switch. Canary en düşük riskli ama en yavaş.

Doğru strateji uygulamanıza ve risk toleransınıza bağlı.

---

### 5.2 Recreate Deployment

En basit strateji: Eski version'ı durdur, yenisini başlat.

Dezavantajı: Arada downtime var. Tüm pod'lar terminate olup yenileri ayağa kalkana kadar servis dışı.

Ne zaman kullanılır: Dev/test ortamları, breaking database migration'ları, veya downtime kabul edilebilir durumlarda.

---

### 5.3 Rolling Update

Kubernetes'in default stratejisi. Pod'lar kademeli olarak güncelleniyor.

maxSurge ile kaç fazla pod olabileceğini, maxUnavailable ile kaç pod'un aynı anda unavailable olabileceğini belirliyorsunuz.

Avantajı: Zero downtime. Dezavantajı: Güncelleme sırasında eski ve yeni version aynı anda çalışıyor. API uyumluluğuna dikkat etmek lazım.

---

### 5.4 Blue-Green Deployment

İki ayrı ortam: Blue aktif, Green yeni version.

Green'i deploy edip test ediyorsunuz. Her şey OK ise load balancer'ı Green'e çeviriyorsunuz. Anında switch.

Problem olursa anında Blue'ya geri dönebilirsiniz. Dezavantajı: 2 kat resource gerekiyor.

---

### 5.5 Canary Deployment

En düşük riskli strateji. Yeni version'a önce %5 trafik yönlendiriyorsunuz.

Metrikleri izliyorsunuz - error rate, latency. Her şey OK ise yüzdeyi artırıyorsunuz: %25, %50, %100.

Problem görürseniz anında %0'a çekip rollback yapıyorsunuz. Sadece küçük bir kullanıcı grubu etkileniyor.

---

### 5.6 GitOps & ArgoCD

GitOps: Git'i single source of truth olarak kullanmak. Tüm infrastructure ve config Git'te.

ArgoCD Git repo'yu izliyor. Değişiklik olunca otomatik sync yapıyor.

Avantajları: Audit trail var - kim ne zaman ne değiştirdi. Rollback kolay - git revert. Review process - PR ile değişiklik.

---

### 5.7 Özet & Best Practices

Önemli noktalar: Sık ve küçük deploy yapın. Her aşamada test olsun. Infrastructure as Code kullanın. Monitoring ve alerting şart.

Feature flags ile deployment ve release'i ayırın. Kodu deploy etmek ayrı, özelliği açmak ayrı.

Her zaman rollback planınız olsun. Bir şeyler ters gidecek, buna hazırlıklı olun.

---

## Kapanış

Bugün 5 ana konuyu ele aldık: GitHub Actions ile CI/CD otomasyonu, Vercel ve Netlify ile managed deployment, Docker ile containerization, Kubernetes ile orchestration, ve deployment stratejileri ile risk yönetimi.

Sorularınız varsa alabilirim.
