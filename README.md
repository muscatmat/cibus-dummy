# Recipe App - Lovable to Mobile CI/CD

A complete demonstration of exporting a **Lovable React app** to GitHub and packaging it into **Android/iOS mobile apps** with **Capacitor Mode B** and automated CI/CD.

## 📱 What This Does

- **Web App**: React/Vite app that fetches and displays recipes from TheMealDB API
- **Mobile Apps**: Capacitor-wrapped native iOS/Android apps (Mode B - packaged assets)
- **CI/CD**: Automated builds and deployments to App Store & Google Play
- **Security**: HTTPS enforcement, ATS rules, secure token storage

## 🏗️ Repository Structure

```
├── web/                    # Lovable React app (export target)
│   ├── src/
│   │   ├── App.tsx        # Main recipes page
│   │   ├── api.ts         # TheMealDB API client
│   │   └── main.tsx       # Entry point
│   ├── package.json       # Web dependencies
│   └── vite.config.ts     # Vite configuration
├── mobile/                 # Capacitor shell (Mode B)
│   ├── capacitor.config.ts # Points to ../web/dist
│   ├── scripts/           # Security patching scripts
│   └── package.json       # Mobile dependencies
├── .github/workflows/     # CI/CD automation
│   ├── web.yml           # Build web app, upload artifact
│   └── mobile.yml        # Build mobile, deploy to stores
├── fastlane/              # App store deployment
│   ├── Fastfile          # iOS/Android lanes
│   └── Appfile           # App configuration
```

## 🚀 Lovable Integration

This repository is designed to be the **target** of Lovable exports:

1. **Develop in Lovable**: Use the visual editor for rapid prototyping
2. **Export to GitHub**: Push changes to the `/web` directory
3. **Automatic Mobile Build**: CI/CD detects changes and builds mobile apps
4. **Deploy**: Apps are automatically deployed to TestFlight and Google Play

### How Lovable Fits In

```
┌─────────────┐    git push    ┌──────────────┐    triggers    ┌─────────────┐
│   Lovable   │   --------→    │    GitHub    │   -------→    │   CI/CD     │
│   Editor    │                │  Repository  │               │  Pipeline   │
└─────────────┘                └──────────────┘               └─────────────┘
       ↑                               │                              │
       │                               ▼                              ▼
┌─────────────┐                ┌──────────────┐               ┌─────────────┐
│  Live Edit  │                │   /web dir   │               │ Mobile Apps │
│ & Preview   │                │ (React/Vite) │               │ iOS/Android │
└─────────────┘                └──────────────┘               └─────────────┘
```

## 🔧 Local Development

### Prerequisites

- Node.js 18+
- For mobile: Xcode, Android Studio, Java 17+

### Setup

1. **Clone and install dependencies:**
```bash
git clone <this-repo>
cd recipe-app

# Web app
cd web
npm install

# Mobile shell
cd ../mobile
npm install
```

2. **Configure environment:**
```bash
cd web
cp .env.example .env
# Edit .env with your API configuration if needed
```

3. **Run locally:**
```bash
# Web development server
cd web
npm run dev

# Mobile development (after building web)
npm run build
cd ../mobile
npm run sync
npm run open:android  # or open:ios
```

## 🔒 Security Features

### Web
- **CSP Headers**: Content Security Policy in index.html
- **HTTPS Only**: All API connections enforce HTTPS
- **Secure Storage**: Capacitor Preferences for app data (not localStorage)

### Mobile
- **iOS ATS**: App Transport Security enforces HTTPS
- **Android Network Security**: Cleartext traffic disabled
- **Domain Whitelisting**: Only TheMealDB API allowed

### CI/CD
- **No Secrets in Code**: All sensitive data in GitHub Secrets
- **Automatic Cleanup**: Temporary files removed after builds
- **Security Scanning**: Claude CLI integration for code review

## ⚙️ CI/CD Pipeline

### Web Workflow (`.github/workflows/web.yml`)

1. **Trigger**: Push to `/web` directory or `main` branch
2. **Build**: Lint, build React app with Vite
3. **Inject Secrets**: Create `.env` from GitHub Secrets
4. **Artifact**: Upload `web/dist/` for mobile builds
5. **Sync**: Optional sync back to Lovable (webhook/API)

### Mobile Workflow (`.github/workflows/mobile.yml`)

1. **Trigger**: After successful web build
2. **Download**: Fetch web build artifacts
3. **Sync**: Run `cap sync` and security patches
4. **AI Tools**:
   - **Gemini CLI**: Generate release notes from commits
   - **Claude CLI**: Security scan of recent changes
5. **Build**: 
   - **Android**: AAB with signing keystore
   - **iOS**: IPA with provisioning profiles
6. **Deploy**:
   - **Android**: Upload to Google Play (internal testing)
   - **iOS**: Upload to TestFlight

## 🔑 Required GitHub Secrets

### API Configuration
```
# No secrets required for TheMealDB API (public)
```

### Android
```
ANDROID_KEYSTORE_BASE64=<base64-encoded-keystore>
ANDROID_KEYSTORE_PASSWORD=keystore-password
ANDROID_KEY_ALIAS=key-alias
ANDROID_KEY_PASSWORD=key-password
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON=<base64-service-account-json>
```

### iOS
```
APPLE_ID=your-apple-id@email.com
APPLE_ID_PASSWORD=app-specific-password
APPLE_TEAM_ID=team-id
APP_STORE_CONNECT_API_KEY_ID=key-id
APP_STORE_CONNECT_ISSUER_ID=issuer-id
APP_STORE_CONNECT_API_KEY=<base64-encoded-p8-file>
```

### Optional
```
SLACK_URL=webhook-for-notifications
LOVABLE_PROJECT_ID=for-sync-back-to-lovable
```

## 🎯 Mode B Explained

**Capacitor Mode B** packages your web assets into the native app bundle:

- ✅ **Offline**: App works without internet (after first load)
- ✅ **Performance**: No network overhead for app shell
- ✅ **Security**: All assets served from native app
- ✅ **Store Compliance**: No remote code execution concerns

The `capacitor.config.ts` points to `../web/dist`, so builds are fully self-contained.

## 📱 App Store Deployment

### Android (Google Play)
1. CI builds AAB (Android App Bundle)
2. Fastlane uploads to **Internal Testing** track
3. Manual promotion to production via Google Play Console

### iOS (App Store)
1. CI builds IPA with distribution certificates
2. Fastlane uploads to **TestFlight**
3. Manual submission to App Store after TestFlight review

## 🧪 Testing

### Web
```bash
cd web
npm run dev    # Local development
npm run build  # Production build
```

### Mobile
```bash
cd mobile
npm run sync                # Sync web build
npm run patch:security     # Apply security configs
npm run open:android       # Open Android Studio
npm run open:ios          # Open Xcode
```

## 🔄 Lovable Workflow

1. **Edit in Lovable**: Use the visual editor for UI changes
2. **Export**: Lovable exports to this repo's `/web` directory
3. **Auto-build**: GitHub Actions detects changes and builds
4. **Review**: Check mobile apps in TestFlight/Internal Testing
5. **Deploy**: Promote to production stores manually

## 📚 Documentation

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [TheMealDB API Documentation](https://www.themealdb.com/api.php)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🐛 Troubleshooting

### Build Failures
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure TheMealDB API is accessible

### Mobile Issues
- Run security patches: `npm run patch:security`
- Check Capacitor sync: `npx cap doctor`
- Verify iOS certificates and provisioning profiles

### Deployment Issues
- Check Fastlane logs in CI
- Verify App Store Connect API keys
- Ensure Google Play service account has correct permissions

---

**Built for seamless Lovable → Mobile deployment** 🚀
