export default ({ env }: { env: any }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-cloudflare',
      providerOptions: {
        account_id: env('CLOUDFLARE_ACCOUNT_ID'),
        api_token: env('CLOUDFLARE_API_TOKEN'),
        variant: 'public', // Cloudflare Images variant for optimization
      },
    },
  },
});
