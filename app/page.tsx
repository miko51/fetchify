import { redirect } from 'next/navigation';

export default function RootPage() {
  // Rediriger vers la langue par défaut (anglais)
  redirect('/en');
}
