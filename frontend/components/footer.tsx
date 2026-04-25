import { Shield } from "lucide-react"

export function Footer() {
  const footerLinks = {
    Features: [
      "Chain of Custody",
      "Evidence Vault",
      "Integrity Audit",
      "Access Logs",
      "Hash Verification",
      "Alerts",
      "Mobile",
    ],
    Product: [
      "Pricing",
      "Documentation",
      "Integrations",
      "Changelog",
      "API",
      "Download",
      "Migrate",
    ],
    Company: ["About", "Careers", "Partners", "Blog", "Press", "Quality", "Brand"],
    Resources: [
      "Developers",
      "Status",
      "Security",
      "Report Issue",
      "DPA",
      "Privacy",
      "Terms",
    ],
    Connect: ["Contact", "Community", "X (Twitter)", "GitHub", "LinkedIn"],
  }

  return (
    <footer className="border-t border-zinc-800 py-16 px-6" style={{ backgroundColor: "#09090B" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Shield className="w-6 h-6 text-blue-500" />
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-medium text-sm mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
