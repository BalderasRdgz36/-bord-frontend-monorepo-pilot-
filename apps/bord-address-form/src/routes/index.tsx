import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/validacion-info-usuario', search: { token: '' } });
  },
  component: () => null,
});
