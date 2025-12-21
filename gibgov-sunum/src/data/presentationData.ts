export interface Slide {
  id: string;
  title: string;
  content: SlideContent[];
  duration?: string;
}

export interface SlideContent {
  type: 'text' | 'code' | 'list' | 'comparison' | 'diagram' | 'highlight';
  content: string;
  language?: string;
  items?: string[];
  columns?: { title: string; items: string[] }[];
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  slides: Slide[];
}

export const presentationData: Section[] = [
  {
    id: 'github-actions',
    title: 'GitHub Actions',
    icon: '⚙️',
    slides: [
      {
        id: 'ga-intro',
        title: 'GitHub Actions Nedir?',
        duration: '3 dk',
        content: [
          {
            type: 'text',
            content: 'GitHub Actions, GitHub reposunda doğrudan CI/CD pipeline\'ları oluşturmanızı sağlayan bir otomasyon platformudur.'
          },
          {
            type: 'list',
            content: 'Temel Özellikler',
            items: [
              'Event-driven architecture (push, pull_request, schedule, vb.)',
              'YAML tabanlı workflow tanımları',
              'Matrix builds ile paralel test çalıştırma',
              'Secrets management ile güvenli credential yönetimi',
              'GitHub Marketplace\'de 15.000+ hazır action',
              'Self-hosted runners desteği'
            ]
          }
        ]
      },
      {
        id: 'ga-architecture',
        title: 'GitHub Actions Mimarisi',
        duration: '4 dk',
        content: [
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
├─────────────────────────────────────────────────────────────┤
│  Events (Triggers)                                          │
│  ├── push, pull_request, release                            │
│  ├── schedule (cron), workflow_dispatch                     │
│  └── repository_dispatch, issues, comments                  │
├─────────────────────────────────────────────────────────────┤
│  Workflow (.github/workflows/*.yml)                         │
│  ├── Jobs (paralel veya sıralı)                             │
│  │   ├── Steps                                              │
│  │   │   ├── Actions (uses:)                                │
│  │   │   └── Commands (run:)                                │
│  │   └── Runner (ubuntu, windows, macos, self-hosted)       │
│  └── Environment & Secrets                                  │
└─────────────────────────────────────────────────────────────┘`
          }
        ]
      },
      {
        id: 'ga-workflow',
        title: 'Workflow Yapısı',
        duration: '5 dk',
        content: [
          {
            type: 'code',
            language: 'yaml',
            content: `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: 'npm'
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/`
          }
        ]
      },
      {
        id: 'ga-secrets',
        title: 'Secrets & Environment Yönetimi',
        duration: '4 dk',
        content: [
          {
            type: 'text',
            content: 'GitHub Actions\'da hassas verileri güvenli şekilde yönetmek için Secrets ve Environment Variables kullanılır.'
          },
          {
            type: 'code',
            language: 'yaml',
            content: `jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Environment protection rules
    steps:
      - name: Deploy to Production
        env:
          API_KEY: \${{ secrets.API_KEY }}
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
        run: |
          echo "Deploying with secure credentials..."
          ./deploy.sh`
          },
          {
            type: 'list',
            content: 'Secret Türleri',
            items: [
              'Repository Secrets: Tek repo için',
              'Organization Secrets: Tüm org repoları için',
              'Environment Secrets: Belirli environment için',
              'GITHUB_TOKEN: Otomatik oluşturulan token'
            ]
          }
        ]
      },
      {
        id: 'ga-matrix',
        title: 'Matrix Strategy & Caching',
        duration: '4 dk',
        content: [
          {
            type: 'code',
            language: 'yaml',
            content: `jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
        include:
          - os: ubuntu-latest
            node: 20
            coverage: true
        exclude:
          - os: macos-latest
            node: 18

    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: 'npm'

      - uses: actions/cache@v4
        with:
          path: ~/.npm
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-node-`
          },
          {
            type: 'highlight',
            content: '9 farklı kombinasyonda (3 OS × 3 Node) paralel test!'
          }
        ]
      },
      {
        id: 'ga-reusable',
        title: 'Reusable Workflows',
        duration: '4 dk',
        content: [
          {
            type: 'text',
            content: 'DRY prensibi: Tekrar eden workflow\'ları bir kez tanımlayıp, birden fazla yerde kullanın.'
          },
          {
            type: 'code',
            language: 'yaml',
            content: `# .github/workflows/reusable-deploy.yml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      node-version:
        default: '20'
        type: string
    secrets:
      deploy-key:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: \${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh
        env:
          DEPLOY_KEY: \${{ secrets.deploy-key }}`
          },
          {
            type: 'code',
            language: 'yaml',
            content: `# Kullanan workflow
jobs:
  call-deploy:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: production
    secrets:
      deploy-key: \${{ secrets.PROD_DEPLOY_KEY }}`
          }
        ]
      },
      {
        id: 'ga-best-practices',
        title: 'GitHub Actions Best Practices',
        duration: '3 dk',
        content: [
          {
            type: 'list',
            content: 'Performans',
            items: [
              'Cache kullanın (npm, pip, maven)',
              'Matrix builds ile paralel çalıştırın',
              'Gereksiz checkout\'lardan kaçının (sparse-checkout)',
              'Timeout-minutes belirleyin'
            ]
          },
          {
            type: 'list',
            content: 'Güvenlik',
            items: [
              'Action versiyonlarını SHA ile pinleyin',
              'Minimum GITHUB_TOKEN izinleri verin',
              'Pull request\'lerde secrets\'a dikkat edin',
              'Dependabot ile action\'ları güncel tutun'
            ]
          },
          {
            type: 'code',
            language: 'yaml',
            content: `permissions:
  contents: read
  pull-requests: write

steps:
  # SHA pinning - güvenli
  - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11

  # Version tag - daha az güvenli ama okunabilir
  - uses: actions/setup-node@v4`
          }
        ]
      }
    ]
  },
  {
    id: 'vercel-netlify',
    title: 'Vercel vs Netlify',
    icon: '🚀',
    slides: [
      {
        id: 'vn-intro',
        title: 'Platform Karşılaştırması',
        duration: '3 dk',
        content: [
          {
            type: 'text',
            content: 'Vercel ve Netlify, modern web uygulamalarını deploy etmek için en popüler iki platform. Her ikisi de JAMstack ve serverless mimariye odaklanır.'
          },
          {
            type: 'comparison',
            content: 'Genel Bakış',
            columns: [
              {
                title: 'Vercel',
                items: [
                  'Next.js\'in yaratıcısı',
                  'React/Next.js için optimize',
                  'Edge Functions',
                  'Vercel AI SDK',
                  'Analytics built-in'
                ]
              },
              {
                title: 'Netlify',
                items: [
                  'JAMstack öncüsü',
                  'Framework agnostic',
                  'Netlify Functions (AWS Lambda)',
                  'Forms & Identity built-in',
                  'Split Testing native'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'vn-deployment',
        title: 'Deployment Modeli',
        duration: '4 dk',
        content: [
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL DEPLOYMENT                         │
├─────────────────────────────────────────────────────────────┤
│  Git Push → Build → Deploy → Edge Network                   │
│                                                              │
│  Features:                                                   │
│  ├── Automatic Preview Deployments (PR'lar için)            │
│  ├── Instant Rollbacks                                       │
│  ├── ISR (Incremental Static Regeneration)                  │
│  ├── Edge Middleware                                         │
│  └── Serverless & Edge Functions                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   NETLIFY DEPLOYMENT                         │
├─────────────────────────────────────────────────────────────┤
│  Git Push → Build → Deploy → CDN                            │
│                                                              │
│  Features:                                                   │
│  ├── Deploy Previews (Branch deploys)                       │
│  ├── Instant Rollbacks                                       │
│  ├── DPR (Distributed Persistent Rendering)                 │
│  ├── Edge Handlers                                           │
│  └── Background Functions (15 min timeout)                  │
└─────────────────────────────────────────────────────────────┘`
          }
        ]
      },
      {
        id: 'vn-config',
        title: 'Konfigürasyon Karşılaştırması',
        duration: '4 dk',
        content: [
          {
            type: 'code',
            language: 'json',
            content: `// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "functions": {
    "api/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "redirects": [
    { "source": "/old", "destination": "/new", "permanent": true }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ]
}`
          },
          {
            type: 'code',
            language: 'toml',
            content: `# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/old"
  to = "/new"
  status = 301

[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "no-store"

[functions]
  node_bundler = "esbuild"

[context.production]
  environment = { API_URL = "https://api.prod.com" }

[context.deploy-preview]
  environment = { API_URL = "https://api.staging.com" }`
          }
        ]
      },
      {
        id: 'vn-serverless',
        title: 'Serverless Functions',
        duration: '5 dk',
        content: [
          {
            type: 'code',
            language: 'typescript',
            content: `// Vercel Edge Function
// api/hello.ts
export const config = {
  runtime: 'edge',
};

export default function handler(request: Request) {
  return new Response(JSON.stringify({ message: 'Hello from Edge!' }), {
    headers: { 'content-type': 'application/json' },
  });
}

// Vercel Serverless Function
// api/data.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const data = await fetchFromDatabase();
  res.status(200).json(data);
}`
          },
          {
            type: 'code',
            language: 'typescript',
            content: `// Netlify Function
// netlify/functions/hello.ts
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify!' }),
  };
};

// Netlify Edge Function
// netlify/edge-functions/geo.ts
export default async (request: Request, context: Context) => {
  const country = context.geo.country?.code || 'Unknown';
  return new Response(\`Hello from \${country}!\`);
};`
          }
        ]
      },
      {
        id: 'vn-pricing',
        title: 'Fiyatlandırma Karşılaştırması',
        duration: '3 dk',
        content: [
          {
            type: 'comparison',
            content: 'Free Tier',
            columns: [
              {
                title: 'Vercel (Hobby)',
                items: [
                  '100 GB bandwidth/ay',
                  '6000 build dakikası/ay',
                  'Serverless: 100 GB-hrs',
                  'Edge Functions: 500K invocations',
                  'Unlimited preview deployments',
                  'Analytics: 2500 events/ay'
                ]
              },
              {
                title: 'Netlify (Starter)',
                items: [
                  '100 GB bandwidth/ay',
                  '300 build dakikası/ay',
                  'Functions: 125K requests/ay',
                  'Edge Functions: Ücretli',
                  'Forms: 100 submissions/ay',
                  'Identity: 1000 users'
                ]
              }
            ]
          },
          {
            type: 'comparison',
            content: 'Pro Tier (~$20/user/ay)',
            columns: [
              {
                title: 'Vercel Pro',
                items: [
                  '1 TB bandwidth',
                  'Unlimited build dakikası',
                  'Serverless: 1000 GB-hrs',
                  'Password protection',
                  'Spend controls'
                ]
              },
              {
                title: 'Netlify Pro',
                items: [
                  '1 TB bandwidth',
                  '25000 build dakikası',
                  'Functions: Unlimited',
                  'Background Functions',
                  'Team management'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'vn-usecases',
        title: 'Hangi Durumda Hangisi?',
        duration: '3 dk',
        content: [
          {
            type: 'list',
            content: 'Vercel Tercih Edin',
            items: [
              'Next.js projesi geliştiriyorsanız',
              'Edge computing kritikse (düşük latency)',
              'ISR/SSR yoğun kullanacaksanız',
              'React Server Components kullanıyorsanız',
              'AI entegrasyonları planlıyorsanız'
            ]
          },
          {
            type: 'list',
            content: 'Netlify Tercih Edin',
            items: [
              'Farklı frameworkler kullanıyorsanız (Vue, Svelte, Angular)',
              'Built-in form handling gerekiyorsa',
              'A/B testing yapacaksanız',
              'Long-running functions gerekiyorsa (15 dk)',
              'CMS entegrasyonları yoğunsa (Contentful, Sanity)'
            ]
          },
          {
            type: 'highlight',
            content: 'Her iki platform da mükemmel. Proje gereksinimlerinize göre seçin!'
          }
        ]
      }
    ]
  },
  {
    id: 'docker',
    title: 'Docker',
    icon: '🐳',
    slides: [
      {
        id: 'docker-intro',
        title: 'Docker Nedir?',
        duration: '3 dk',
        content: [
          {
            type: 'text',
            content: 'Docker, uygulamaları container\'lar içinde paketleyip çalıştırmanızı sağlayan bir platformdur. "Works on my machine" problemini ortadan kaldırır.'
          },
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│              Container vs Virtual Machine                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   CONTAINERS                    VIRTUAL MACHINES            │
│   ┌─────┐ ┌─────┐ ┌─────┐      ┌─────┐ ┌─────┐ ┌─────┐     │
│   │App A│ │App B│ │App C│      │App A│ │App B│ │App C│     │
│   ├─────┤ ├─────┤ ├─────┤      ├─────┤ ├─────┤ ├─────┤     │
│   │Bins │ │Bins │ │Bins │      │Bins │ │Bins │ │Bins │     │
│   └──┬──┘ └──┬──┘ └──┬──┘      ├─────┤ ├─────┤ ├─────┤     │
│      └───────┼───────┘         │Guest│ │Guest│ │Guest│     │
│   ┌──────────┴──────────┐      │ OS  │ │ OS  │ │ OS  │     │
│   │   Container Engine  │      └──┬──┘ └──┬──┘ └──┬──┘     │
│   └──────────┬──────────┘         └───────┼───────┘        │
│   ┌──────────┴──────────┐      ┌──────────┴──────────┐     │
│   │      Host OS        │      │     Hypervisor      │     │
│   └──────────┬──────────┘      └──────────┬──────────┘     │
│   ┌──────────┴──────────┐      ┌──────────┴──────────┐     │
│   │    Infrastructure   │      │    Infrastructure   │     │
│   └─────────────────────┘      └─────────────────────┘     │
│                                                              │
│   ✓ Hafif (~MB)                ✗ Ağır (~GB)                │
│   ✓ Saniyeler içinde başlar    ✗ Dakikalar sürer           │
│   ✓ Kaynak paylaşımı           ✗ Ayrılmış kaynaklar        │
└─────────────────────────────────────────────────────────────┘`
          }
        ]
      },
      {
        id: 'docker-components',
        title: 'Docker Bileşenleri',
        duration: '4 dk',
        content: [
          {
            type: 'list',
            content: 'Temel Kavramlar',
            items: [
              'Image: Uygulamanın read-only şablonu (Dockerfile\'dan oluşur)',
              'Container: Image\'ın çalışan instance\'ı',
              'Dockerfile: Image oluşturma talimatları',
              'Registry: Image\'ların depolandığı yer (Docker Hub, ECR, GCR)',
              'Volume: Persistent data storage',
              'Network: Container\'lar arası iletişim'
            ]
          },
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                    Docker Workflow                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Dockerfile ──build──> Image ──push──> Registry             │
│                          │                  │                │
│                          │                  │                │
│                        run                pull               │
│                          │                  │                │
│                          ▼                  ▼                │
│                     Container  <────────  Image              │
│                                                              │
└─────────────────────────────────────────────────────────────┘`
          }
        ]
      },
      {
        id: 'docker-dockerfile',
        title: 'Dockerfile Best Practices',
        duration: '5 dk',
        content: [
          {
            type: 'code',
            language: 'dockerfile',
            content: `# Multi-stage build örneği (Next.js için)
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]`
          },
          {
            type: 'highlight',
            content: 'Multi-stage build: ~1GB → ~100MB image boyutu!'
          }
        ]
      },
      {
        id: 'docker-compose',
        title: 'Docker Compose',
        duration: '5 dk',
        content: [
          {
            type: 'text',
            content: 'Docker Compose, multi-container uygulamaları tanımlayıp çalıştırmanızı sağlar.'
          },
          {
            type: 'code',
            language: 'yaml',
            content: `# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  cache:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge`
          }
        ]
      },
      {
        id: 'docker-commands',
        title: 'Sık Kullanılan Komutlar',
        duration: '4 dk',
        content: [
          {
            type: 'code',
            language: 'bash',
            content: `# Image işlemleri
docker build -t myapp:1.0 .           # Image oluştur
docker images                          # Image listele
docker rmi myapp:1.0                   # Image sil
docker pull nginx:alpine               # Registry'den çek
docker push myregistry/myapp:1.0       # Registry'e gönder

# Container işlemleri
docker run -d -p 3000:3000 myapp:1.0  # Arka planda çalıştır
docker ps                              # Çalışan container'lar
docker ps -a                           # Tüm container'lar
docker stop <container_id>             # Durdur
docker rm <container_id>               # Sil
docker logs -f <container_id>          # Log takibi
docker exec -it <container_id> sh      # Shell'e bağlan

# Docker Compose
docker compose up -d                   # Tüm servisleri başlat
docker compose down                    # Durdur ve kaldır
docker compose logs -f                 # Tüm logları takip et
docker compose ps                      # Servis durumları
docker compose exec app sh             # Servise bağlan

# Temizlik
docker system prune -a                 # Kullanılmayanları temizle
docker volume prune                    # Orphan volume'ları sil`
          }
        ]
      },
      {
        id: 'docker-security',
        title: 'Docker Güvenlik',
        duration: '4 dk',
        content: [
          {
            type: 'list',
            content: 'Güvenlik Best Practices',
            items: [
              'Root kullanıcı yerine non-root user kullanın',
              'Resmi ve güvenilir base image\'lar tercih edin',
              'Image\'ları vulnerability scanner ile tarayın (Trivy, Snyk)',
              'Multi-stage build ile gereksiz dosyaları hariç tutun',
              '.dockerignore dosyası kullanın',
              'Secrets\'ı environment variable olarak geçmeyin, Docker secrets kullanın',
              'Read-only filesystem mümkünse',
              'Resource limits tanımlayın (CPU, memory)'
            ]
          },
          {
            type: 'code',
            language: 'dockerfile',
            content: `# Güvenli Dockerfile örneği
FROM node:20-alpine

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY --chown=appuser:appgroup . .

# Minimize attack surface
RUN npm ci --only=production && \\
    npm cache clean --force && \\
    rm -rf /tmp/*

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["node", "server.js"]`
          }
        ]
      },
      {
        id: 'docker-cicd',
        title: 'Docker + CI/CD',
        duration: '4 dk',
        content: [
          {
            type: 'code',
            language: 'yaml',
            content: `# GitHub Actions ile Docker build & push
name: Docker CI/CD

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/\${{ github.repository }}
          tags: |
            type=semver,pattern={{version}}
            type=sha,prefix=

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max`
          }
        ]
      }
    ]
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes',
    icon: '☸️',
    slides: [
      {
        id: 'k8s-intro',
        title: 'Kubernetes Nedir?',
        duration: '3 dk',
        content: [
          {
            type: 'text',
            content: 'Kubernetes (K8s), container\'ize edilmiş uygulamaları otomatik deploy, scale ve yönetmenizi sağlayan açık kaynak bir container orchestration platformudur.'
          },
          {
            type: 'list',
            content: 'Temel Yetenekler',
            items: [
              'Service Discovery & Load Balancing',
              'Storage Orchestration',
              'Automated Rollouts & Rollbacks',
              'Self-healing (restart, replace, reschedule)',
              'Secret & Configuration Management',
              'Horizontal Scaling (otomatik veya manuel)',
              'Batch Execution'
            ]
          }
        ]
      },
      {
        id: 'k8s-architecture',
        title: 'Kubernetes Mimarisi',
        duration: '5 dk',
        content: [
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                    KUBERNETES CLUSTER                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   CONTROL PLANE                      │    │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────────┐   │    │
│  │  │   API    │ │   etcd   │ │    Controller      │   │    │
│  │  │  Server  │ │(key-val) │ │     Manager        │   │    │
│  │  └──────────┘ └──────────┘ └────────────────────┘   │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │              Scheduler                        │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    WORKER NODES                      │    │
│  │                                                       │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │    │
│  │  │   Node 1    │  │   Node 2    │  │   Node 3    │   │    │
│  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │   │    │
│  │  │ │ kubelet │ │  │ │ kubelet │ │  │ │ kubelet │ │   │    │
│  │  │ ├─────────┤ │  │ ├─────────┤ │  │ ├─────────┤ │   │    │
│  │  │ │kube-prxy│ │  │ │kube-prxy│ │  │ │kube-prxy│ │   │    │
│  │  │ ├─────────┤ │  │ ├─────────┤ │  │ ├─────────┤ │   │    │
│  │  │ │Container│ │  │ │Container│ │  │ │Container│ │   │    │
│  │  │ │ Runtime │ │  │ │ Runtime │ │  │ │ Runtime │ │   │    │
│  │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │   │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘`
          }
        ]
      },
      {
        id: 'k8s-objects',
        title: 'Temel Kubernetes Objeleri',
        duration: '4 dk',
        content: [
          {
            type: 'list',
            content: 'Workload Resources',
            items: [
              'Pod: En küçük deploy edilebilir birim (1+ container)',
              'Deployment: Pod\'ların declarative güncellemesi',
              'ReplicaSet: Belirli sayıda Pod çalışmasını garantiler',
              'StatefulSet: Stateful uygulamalar için (DB, queue)',
              'DaemonSet: Her node\'da bir Pod çalıştırır',
              'Job/CronJob: Batch ve zamanlanmış işler'
            ]
          },
          {
            type: 'list',
            content: 'Service & Networking',
            items: [
              'Service: Pod\'lara stable network endpoint',
              'Ingress: HTTP/HTTPS routing (L7 load balancer)',
              'NetworkPolicy: Pod\'lar arası trafik kuralları'
            ]
          },
          {
            type: 'list',
            content: 'Config & Storage',
            items: [
              'ConfigMap: Non-sensitive configuration',
              'Secret: Sensitive data (base64 encoded)',
              'PersistentVolume (PV): Storage resource',
              'PersistentVolumeClaim (PVC): Storage request'
            ]
          }
        ]
      },
      {
        id: 'k8s-deployment',
        title: 'Deployment Manifest',
        duration: '5 dk',
        content: [
          {
            type: 'code',
            language: 'yaml',
            content: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myregistry/myapp:1.0.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: database-url`
          }
        ]
      },
      {
        id: 'k8s-service',
        title: 'Service & Ingress',
        duration: '4 dk',
        content: [
          {
            type: 'code',
            language: 'yaml',
            content: `# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: ClusterIP  # ClusterIP, NodePort, LoadBalancer
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80`
          }
        ]
      },
      {
        id: 'k8s-hpa',
        title: 'Horizontal Pod Autoscaler',
        duration: '4 dk',
        content: [
          {
            type: 'text',
            content: 'HPA, CPU/memory kullanımı veya custom metrics\'e göre otomatik olarak Pod sayısını scale eder.'
          },
          {
            type: 'code',
            language: 'yaml',
            content: `# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15`
          },
          {
            type: 'highlight',
            content: 'CPU %70\'i geçince otomatik scale-up, %70 altına düşünce 5 dk bekleyip scale-down'
          }
        ]
      },
      {
        id: 'k8s-commands',
        title: 'kubectl Komutları',
        duration: '4 dk',
        content: [
          {
            type: 'code',
            language: 'bash',
            content: `# Cluster bilgisi
kubectl cluster-info
kubectl get nodes
kubectl get namespaces

# Resource görüntüleme
kubectl get pods -n myapp
kubectl get deployments -o wide
kubectl get services
kubectl get ingress
kubectl describe pod <pod-name>

# Resource oluşturma/güncelleme
kubectl apply -f deployment.yaml
kubectl apply -f . --recursive
kubectl create namespace myapp

# Scaling
kubectl scale deployment myapp --replicas=5
kubectl autoscale deployment myapp --min=2 --max=10 --cpu-percent=80

# Debugging
kubectl logs <pod-name> -f
kubectl logs <pod-name> -c <container-name>
kubectl exec -it <pod-name> -- /bin/sh
kubectl port-forward <pod-name> 3000:3000

# Rollout
kubectl rollout status deployment/myapp
kubectl rollout history deployment/myapp
kubectl rollout undo deployment/myapp
kubectl rollout undo deployment/myapp --to-revision=2

# Resource silme
kubectl delete -f deployment.yaml
kubectl delete pod <pod-name>
kubectl delete namespace myapp`
          }
        ]
      },
      {
        id: 'k8s-helm',
        title: 'Helm - Kubernetes Package Manager',
        duration: '4 dk',
        content: [
          {
            type: 'text',
            content: 'Helm, Kubernetes uygulamalarını paketlemek, paylaşmak ve deploy etmek için kullanılan bir package manager\'dır.'
          },
          {
            type: 'code',
            language: 'yaml',
            content: `# Chart.yaml
apiVersion: v2
name: myapp
description: My Application Helm Chart
version: 1.0.0
appVersion: "1.0.0"

---
# values.yaml
replicaCount: 3

image:
  repository: myregistry/myapp
  tag: "1.0.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70`
          },
          {
            type: 'code',
            language: 'bash',
            content: `# Helm komutları
helm repo add bitnami https://charts.bitnami.com/bitnami
helm search repo nginx
helm install myapp ./mychart -n production
helm upgrade myapp ./mychart -n production
helm rollback myapp 1 -n production
helm uninstall myapp -n production
helm list -n production`
          }
        ]
      }
    ]
  },
  {
    id: 'deployment-strategies',
    title: 'Deployment Strategies',
    icon: '🎯',
    slides: [
      {
        id: 'ds-overview',
        title: 'Deployment Stratejileri',
        duration: '3 dk',
        content: [
          {
            type: 'text',
            content: 'Doğru deployment stratejisi seçimi, downtime\'ı minimize eder ve risk yönetimini kolaylaştırır.'
          },
          {
            type: 'list',
            content: 'Strateji Türleri',
            items: [
              'Recreate: Eskiyi durdur, yeniyi başlat',
              'Rolling Update: Kademeli güncelleme',
              'Blue-Green: Paralel ortam switch',
              'Canary: Kademeli trafik yönlendirme',
              'A/B Testing: Feature-based routing',
              'Shadow: Production trafiği kopyalama'
            ]
          }
        ]
      },
      {
        id: 'ds-recreate',
        title: 'Recreate Deployment',
        duration: '3 dk',
        content: [
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                    RECREATE DEPLOYMENT                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Before:  [v1] [v1] [v1]                                   │
│                  │                                           │
│                  ▼                                           │
│   Step 1:  [ ] [ ] [ ]  ← All v1 terminated (DOWNTIME!)     │
│                  │                                           │
│                  ▼                                           │
│   After:   [v2] [v2] [v2]                                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  ✓ Basit                     ✗ Downtime var                 │
│  ✓ Clean state               ✗ Instant rollback yok         │
│  ✓ Resource efficient        ✗ Production için uygun değil  │
└─────────────────────────────────────────────────────────────┘`
          },
          {
            type: 'code',
            language: 'yaml',
            content: `spec:
  replicas: 3
  strategy:
    type: Recreate`
          },
          {
            type: 'highlight',
            content: 'Use case: Dev/test ortamları, breaking DB migrations, legacy uygulamalar'
          }
        ]
      },
      {
        id: 'ds-rolling',
        title: 'Rolling Update',
        duration: '4 dk',
        content: [
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                    ROLLING UPDATE                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Start:    [v1] [v1] [v1]                                  │
│                  │                                           │
│                  ▼                                           │
│   Step 1:   [v1] [v1] [v2] ← 1 new pod created              │
│                  │                                           │
│                  ▼                                           │
│   Step 2:   [v1] [v2] [v2] ← 1 old terminated, 1 new up     │
│                  │                                           │
│                  ▼                                           │
│   Done:     [v2] [v2] [v2]                                  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  ✓ Zero downtime             ✗ Slow rollout                 │
│  ✓ Gradual rollout           ✗ v1 & v2 aynı anda çalışır   │
│  ✓ Resource efficient        ✗ Session affinity sorunu     │
└─────────────────────────────────────────────────────────────┘`
          },
          {
            type: 'code',
            language: 'yaml',
            content: `spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # +1 fazla pod olabilir
      maxUnavailable: 0  # 0 = her zaman 3 pod hazır`
          }
        ]
      },
      {
        id: 'ds-bluegreen',
        title: 'Blue-Green Deployment',
        duration: '5 dk',
        content: [
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                   BLUE-GREEN DEPLOYMENT                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌──────────────┐                         │
│                    │ Load Balancer│                         │
│                    └──────┬───────┘                         │
│                           │                                  │
│          ┌────────────────┼────────────────┐                │
│          │                │                │                │
│          ▼                                 ▼                │
│   ┌─────────────┐                  ┌─────────────┐          │
│   │    BLUE     │                  │    GREEN    │          │
│   │  (Current)  │   ──switch──>    │    (New)    │          │
│   │    v1.0     │                  │    v1.1     │          │
│   │ [v1][v1][v1]│                  │ [v2][v2][v2]│          │
│   └─────────────┘                  └─────────────┘          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  ✓ Instant switch            ✗ 2x resource gerekli          │
│  ✓ Instant rollback          ✗ DB migration zorluğu        │
│  ✓ Full test before switch   ✗ Daha karmaşık setup         │
└─────────────────────────────────────────────────────────────┘`
          },
          {
            type: 'code',
            language: 'yaml',
            content: `# Blue deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
---
# Green deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
---
# Service (switch by changing selector)
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
    version: blue  # Change to 'green' to switch`
          }
        ]
      },
      {
        id: 'ds-canary',
        title: 'Canary Deployment',
        duration: '5 dk',
        content: [
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                    CANARY DEPLOYMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Phase 1 (5% traffic):                                     │
│   ┌─────────────────────────────────────┐                   │
│   │     Production (v1) - 95%            │                   │
│   │  [v1] [v1] [v1] [v1] [v1] [v1]       │                   │
│   └─────────────────────────────────────┘                   │
│   ┌─────────────────────────────────────┐                   │
│   │     Canary (v2) - 5%                 │                   │
│   │  [v2]                                │                   │
│   └─────────────────────────────────────┘                   │
│                                                              │
│   Phase 2 (25% traffic):                                    │
│   [v1] [v1] [v1] [v1] [v1]  ────  [v2] [v2]                │
│                                                              │
│   Phase 3 (100% traffic):                                   │
│   [v2] [v2] [v2] [v2] [v2] [v2]                             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  ✓ Minimal risk              ✗ Slow rollout                 │
│  ✓ Real production testing   ✗ Complex traffic splitting   │
│  ✓ Metric-based decisions    ✗ Monitoring gerekli          │
└─────────────────────────────────────────────────────────────┘`
          },
          {
            type: 'code',
            language: 'yaml',
            content: `# Istio VirtualService ile Canary
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp.example.com
  http:
  - match:
    - headers:
        x-canary:
          exact: "true"
    route:
    - destination:
        host: myapp-canary
        port:
          number: 80
  - route:
    - destination:
        host: myapp-stable
        port:
          number: 80
      weight: 95
    - destination:
        host: myapp-canary
        port:
          number: 80
      weight: 5`
          }
        ]
      },
      {
        id: 'ds-gitops',
        title: 'GitOps & ArgoCD',
        duration: '5 dk',
        content: [
          {
            type: 'text',
            content: 'GitOps, Git\'i single source of truth olarak kullanarak declarative infrastructure ve application yönetimi yapar.'
          },
          {
            type: 'diagram',
            content: `
┌─────────────────────────────────────────────────────────────┐
│                      GITOPS WORKFLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Developer ──push──> Git Repo ──sync──> Kubernetes         │
│                          │                                   │
│                          │                                   │
│                    ┌─────┴─────┐                             │
│                    │  ArgoCD   │                             │
│                    │  Watches  │                             │
│                    └─────┬─────┘                             │
│                          │                                   │
│          ┌───────────────┼───────────────┐                  │
│          │               │               │                  │
│          ▼               ▼               ▼                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│   │   Dev    │    │  Staging │    │   Prod   │             │
│   │ Cluster  │    │  Cluster │    │ Cluster  │             │
│   └──────────┘    └──────────┘    └──────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘`
          },
          {
            type: 'code',
            language: 'yaml',
            content: `# ArgoCD Application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/myapp-manifests
    targetRevision: HEAD
    path: environments/production
  destination:
    server: https://kubernetes.default.svc
    namespace: myapp
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
  # Canary with Argo Rollouts
  strategy:
    canary:
      steps:
      - setWeight: 5
      - pause: {duration: 5m}
      - setWeight: 25
      - pause: {duration: 10m}
      - setWeight: 50
      - pause: {duration: 10m}`
          }
        ]
      },
      {
        id: 'ds-comparison',
        title: 'Strateji Karşılaştırması',
        duration: '3 dk',
        content: [
          {
            type: 'comparison',
            content: 'Strateji Seçim Kriterleri',
            columns: [
              {
                title: 'Düşük Risk',
                items: [
                  'Canary: En düşük risk',
                  'Blue-Green: Instant rollback',
                  'Rolling: Gradual & safe',
                  'Recreate: Highest risk'
                ]
              },
              {
                title: 'Kaynak Kullanımı',
                items: [
                  'Recreate: En az',
                  'Rolling: Moderate',
                  'Canary: Moderate-High',
                  'Blue-Green: 2x resources'
                ]
              }
            ]
          },
          {
            type: 'list',
            content: 'Öneriler',
            items: [
              'Production kritik: Blue-Green veya Canary',
              'Microservices: Rolling Update + Health checks',
              'Breaking changes: Blue-Green + DB migration strategy',
              'A/B testing gerekliyse: Canary with feature flags',
              'Startup/MVP: Rolling Update yeterli'
            ]
          }
        ]
      },
      {
        id: 'ds-summary',
        title: 'Özet & Best Practices',
        duration: '3 dk',
        content: [
          {
            type: 'list',
            content: 'CI/CD Pipeline Best Practices',
            items: [
              'Her commit build tetiklemeli (trunk-based development)',
              'Automated testing her aşamada olmalı',
              'Infrastructure as Code (IaC) kullanın',
              'GitOps ile declarative deployment',
              'Feature flags ile decouple deployment & release',
              'Observability: metrics, logs, traces',
              'Rollback planı her zaman hazır olmalı'
            ]
          },
          {
            type: 'highlight',
            content: 'Mantra: "Deploy often, deploy small, monitor everything"'
          },
          {
            type: 'list',
            content: 'Öğrendiklerimiz',
            items: [
              'GitHub Actions: CI/CD otomasyonu',
              'Vercel/Netlify: Managed deployment platformları',
              'Docker: Containerization',
              'Kubernetes: Container orchestration',
              'Deployment Strategies: Risk yönetimi'
            ]
          }
        ]
      }
    ]
  }
];

export const getTotalSlides = () => {
  return presentationData.reduce((acc, section) => acc + section.slides.length, 0);
};

export const getTotalDuration = () => {
  let totalMinutes = 0;
  presentationData.forEach(section => {
    section.slides.forEach(slide => {
      if (slide.duration) {
        const minutes = parseInt(slide.duration.replace(' dk', ''));
        totalMinutes += minutes;
      }
    });
  });
  return totalMinutes;
};
