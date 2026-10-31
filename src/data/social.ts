export interface SocialLink {
  name: string;
  url: string;
  label: string;
  icon: 'github' | 'linkedin' | 'email';
}

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/augustohassel',
    label: 'Perfil de GitHub de Augusto Hassel (@augustohassel)',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/augustohassel',
    label: 'Perfil profesional de LinkedIn de Augusto Hassel',
    icon: 'linkedin',
  },
  {
    name: 'Contacto',
    url: '/#contacto',
    label: 'Ir a la sección de contacto y correo electrónico profesional',
    icon: 'email',
  },
];
