# LocalTools 🛠️

A privacy-focused multiple tool platform offering various utilities to make your daily tasks easier.

**Live Website:** [https://localtools.app](https://localtools.app)  
**Admin Panel:** [https://admin.localtools.app](https://admin.localtools.app)

## 🌟 Overview

LocalTools is a comprehensive web-based platform that provides multiple productivity tools while keeping user privacy at the forefront. Built with modern technologies, it offers a seamless experience for various daily tasks.

## ✨ Features

### Current Tools
- **PDF Tools** - Comprehensive PDF manipulation utilities
- **Invoice Generator** - Create professional invoices quickly
- **JWT Tools** - JSON Web Token encoder/decoder and validator
- **Public API Response Viewer** - Test and view API responses
- And many more tools...

### Admin Panel
- **Subscription Management** - Manage user subscriptions and billing
- **Dashboard** - View basic analytics and system overview
- **User Management** - Track and manage user accounts

### Upcoming Features
- 🤖 **Telegram Bot Integration** - Use tools directly through Telegram
- 📡 **API Endpoints** - Programmatic access to all tools
- 🔄 **Regular Tool Updates** - New tools added frequently

## 🚀 Tech Stack

- **Frontend Framework:** Next.js & React
- **Language:** TypeScript
- **Authentication:** Supabase
- **Database:** PostgreSQL (for subscription plans)
- **Email Service:** Nodemailer (for notifications)
- **Admin Panel:** Custom dashboard at [admin.localtools.app](https://admin.localtools.app)
- **Deployment:** Live at [localtools.app](https://localtools.app)

## 🔐 Privacy First

LocalTools is built with privacy as a core principle. Your data security and privacy are our top priorities.

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/arreharsh/LocalTools.git

# Navigate to project directory
cd LocalTools

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Set up environment variables
# Create a .env.local file with required credentials:
# - Supabase credentials
# - PostgreSQL database connection
# - Nodemailer configuration

# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📦 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostgreSQL
DATABASE_URL=your_postgres_connection_string

# Nodemailer
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new tools
- Submit pull requests
- Improve documentation

## 🗺️ Roadmap

- [x] PDF Tools
- [x] Invoice Generator
- [x] JWT Tools
- [x] Public API Response Viewer
- [x] Admin Panel for Subscription Management
- [x] [Telegram Bot Integration](https://t.me/localtools_bot)
- [ ] Public API Endpoints
- [ ] More tools (continuously updated)

## 📧 Contact

For questions, suggestions, or feedback, feel free to reach out!

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Website:** [https://localtools.app](https://localtools.app)
- **Admin Panel:** [https://admin.localtools.app](https://admin.localtools.app)
- **Repository:** [https://github.com/arreharsh/LocalTools](https://github.com/arreharsh/LocalTools)

---

Made with ❤️ for privacy-conscious users
