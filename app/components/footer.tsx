import React from "react"
import Link from "next/link"
import AppStoreIcon from '@/components/icons/AppStore';
import PlayStoreIcon from '@/components/icons/PlayStore';

// Importa los nuevos componentes de iconos
import FacebookIcon from './icons/Facebook'
import LinkedinIcon from './icons/Linkedin'

// Definimos el objeto socialIcons con los componentes disponibles
const socialIcons = {
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  // Añade aquí más iconos cuando los tengas disponibles
}

const footerLinks = [
  { href: "/centro-legal", text: "Centro legal" },
  { href: "/privacidad", text: "Privacidad" },
  { href: "/preferencias-cookies", text: "Preferencias de cookies" },
  { href: "/accesibilidad", text: "Accesibilidad" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">© 2024 TidyTeam Inc. Todos los derechos reservados.</p>
            <div className="mt-2 space-x-2 text-sm text-muted-foreground">
              {footerLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  {index > 0 && <span>|</span>}
                  <Link href={link.href} className="hover:underline">
                    {link.text}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex space-x-4 mr-14">
              <Link href="https://apps.apple.com/app/apple-store/id123456789">
                <AppStoreIcon className="w-[120px] h-[35px]" />
              </Link>
              <Link href="https://play.google.com/store/apps/details?id=com.example.app">
                <PlayStoreIcon className="w-[120px] h-[35px]" />
              </Link>
            </div>
            <div className="flex space-x-4">
              {[
                { name: "facebook", url: "https://facebook.com/example" },
                { name: "linkedin", url: "https://linkedin.com/company/example" },
                // Añade aquí más redes sociales cuando tengas sus iconos disponibles
              ].map((social) => {
                const SocialIcon = socialIcons[social.name as keyof typeof socialIcons]
                return (
                  <Link key={social.name} href={social.url}>
                    <div className="w-6 h-6">
                      <SocialIcon className="w-full h-full" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
