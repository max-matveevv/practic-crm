import type { Metadata } from "next";

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  template?: boolean;
}

export function createMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title = "PracticCRM",
    description = "Система управления проектами и задачами",
    keywords = ["CRM", "проекты", "задачи", "управление"],
    template = false
  } = options;

  return {
    title: template ? { default: title, template: `%s | PracticCRM` } : title,
    description,
    keywords,
    authors: [{ name: "Practic Studio" }],
    creator: "Practic Studio",
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' }
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
      other: [
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    manifest: '/site.webmanifest',
    themeColor: '#22C55E',
  };
}

// Предустановленные конфигурации для разных страниц
export const metadataConfigs = {
  root: () => createMetadata({
    title: "PracticCRM - Система управления проектами и задачами",
    template: true
  }),
  
  protected: () => createMetadata({
    title: "PracticCRM - Управление проектами и задачами",
    description: "Система управления проектами и задачами"
  }),
  
  public: () => createMetadata({
    title: "PracticCRM - Система управления проектами и задачами",
    description: "Эффективное управление проектами и задачами"
  }),
  
  auth: () => createMetadata({
    title: "Вход в систему - PracticCRM",
    description: "Войдите в свою учетную запись PracticCRM"
  }),
  
  register: () => createMetadata({
    title: "Регистрация - PracticCRM",
    description: "Создайте новую учетную запись в PracticCRM"
  }),
  
  resetPassword: () => createMetadata({
    title: "Сброс пароля - PracticCRM",
    description: "Восстановите доступ к своей учетной записи"
  }),
  
  tasks: () => createMetadata({
    title: "Задачи - PracticCRM",
    description: "Управление задачами и проектами"
  }),
  
  projects: () => createMetadata({
    title: "Проекты - PracticCRM",
    description: "Управление проектами"
  }),
  
  dashboard: () => createMetadata({
    title: "Дашборд - PracticCRM",
    description: "Обзор проектов и задач"
  })
};
