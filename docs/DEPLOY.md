# Deploying piyush-mptra.com

Code lives on GitHub and is mirrored to GitLab with every `git push`. GitLab CI runs the checks and
scans, then deploys to Cloudflare from `main`. GitHub Actions has the same pipeline, but leave its
`DEPLOY_ENABLED` variable unset so the two never both deploy.

## 1. Cloudflare: take over DNS

1. Sign up at dash.cloudflare.com, choose **Add a domain**, enter `piyush-mptra.com`, pick the **Free** plan.
2. On the DNS records review screen, **delete** the A/AAAA/CNAME records for `piyush-mptra.com` and `www`
   that point at Hostinger's parking page. The Worker creates its own record on first deploy.
3. Cloudflare shows two nameservers. In Hostinger hPanel: **Domains → piyush-mptra.com → Manage →
   DNS / Nameservers → Change nameservers → Use custom nameservers**, paste both, save.
   If DNSSEC is on at Hostinger, turn it off first.
4. Wait for Cloudflare's "your domain is now active" email (minutes to a few hours).

## 2. Cloudflare: harden

- **SSL/TLS → Overview:** Full (strict).
- **SSL/TLS → Edge Certificates:** Always Use HTTPS on, Minimum TLS 1.2, Automatic HTTPS Rewrites on.
  Leave Cloudflare's HSTS setting off; the site already sends its own HSTS header.
- **DNS → Settings → Enable DNSSEC.** Copy the DS values into Hostinger: **Domains → Manage → DNSSEC → Add record**.
- **Security → Bots:** Bot Fight Mode on.
- **Security → WAF → Rate limiting rules → Create:** when URI Path equals `/api/e`, 30 requests per 10 seconds
  per IP, action Block for 10 seconds.
- **Rules → Redirect Rules → Templates → Redirect from WWW to root.** Then in DNS add `AAAA www 100::`, proxied.
- **Analytics & Logs → Web Analytics → Add a site →** `piyush-mptra.com`, automatic setup.

## 3. Cloudflare: deploy credentials

- **Account ID:** Workers & Pages overview, right-hand sidebar.
- **API token:** My Profile → API Tokens → Create Token → template **Edit Cloudflare Workers**.
  Account Resources: your account. Zone Resources: Specific zone → `piyush-mptra.com`. Create, copy once.

## 4. GitLab: CI and mirror

1. Sign up at gitlab.com and verify the account (GitLab asks for a phone or card before free shared runners run).
2. **New project → Create blank project:** name `piyush-mptra`, visibility Public, untick "Initialize with a README".
3. **Settings → CI/CD → Variables:**
   - `CLOUDFLARE_API_TOKEN`: Visibility "Masked and hidden", Protect variable on.
   - `CLOUDFLARE_ACCOUNT_ID`: Protect variable on.
4. Make `git push` go to both hosts (once per clone):

   ```bash
   git remote set-url --add --push origin https://github.com/piyush-mk/piyush-mptra.git
   git remote set-url --add --push origin https://gitlab.com/<gitlab-username>/piyush-mptra.git
   git config core.hooksPath .githooks
   git push
   ```

   The first push to GitLab opens a browser sign-in through Git Credential Manager.

## 5. First deploy without waiting for CI (optional)

```bash
npx wrangler login
npm run deploy
```

## Check it

```bash
curl -sI https://piyush-mptra.com
```

Expect `200`, plus `content-security-policy` and `strict-transport-security` headers. Then run
securityheaders.com and the Mozilla Observatory against the domain.
