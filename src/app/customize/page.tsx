import type { Metadata } from 'next';
import { Suspense } from 'react';
import CustomizePage from './CustomizePage';

export const metadata: Metadata = {
  title: 'Customize Your Cushion',
  description: 'Build your perfect custom cushion with our step-by-step configurator. Choose size, shape, fabric and more.',
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CustomizePage />
    </Suspense>
  );
}
