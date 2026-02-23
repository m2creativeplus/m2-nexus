#!/bin/bash
set -e

echo "Removing corrupted Clerk publishable keys from Vercel..."
npx vercel env rm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production --yes || true
npx vercel env rm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview --yes || true
npx vercel env rm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development --yes || true

echo "Injecting hardened NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY..."
printf "pk_test_dmFsaWQtbWFuYXRlZS04MC5jbGVyay5hY2NvdW50cy5kZXYk" | npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
printf "pk_test_dmFsaWQtbWFuYXRlZS04MC5jbGVyay5hY2NvdW50cy5kZXYk" | npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
printf "pk_test_dmFsaWQtbWFuYXRlZS04MC5jbGVyay5hY2NvdW50cy5kZXYk" | npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development

echo "Removing corrupted Clerk secret keys from Vercel..."
npx vercel env rm CLERK_SECRET_KEY production --yes || true
npx vercel env rm CLERK_SECRET_KEY preview --yes || true
npx vercel env rm CLERK_SECRET_KEY development --yes || true

echo "Injecting hardened CLERK_SECRET_KEY..."
printf "sk_test_tWV0cx0tqrx44mfYog5y0i7AGStZ8AZjSyQsuRsqlK" | npx vercel env add CLERK_SECRET_KEY production
printf "sk_test_tWV0cx0tqrx44mfYog5y0i7AGStZ8AZjSyQsuRsqlK" | npx vercel env add CLERK_SECRET_KEY preview
printf "sk_test_tWV0cx0tqrx44mfYog5y0i7AGStZ8AZjSyQsuRsqlK" | npx vercel env add CLERK_SECRET_KEY development

echo "Triggering Vercel production rebuild..."
npx vercel --prod --yes
