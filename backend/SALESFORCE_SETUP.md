# Salesforce Connected App Setup Guide

This document walks you through getting the credentials needed to connect the Northstar dashboard backend to your Salesforce CRM.

---

## What you need

| Environment variable | Where to find it |
|---|---|
| `SF_USERNAME` | Your Salesforce login e-mail |
| `SF_PASSWORD` | Your Salesforce password |
| `SF_SECURITY_TOKEN` | Setup → My Personal Information → Reset Security Token |
| `SF_CONSUMER_KEY` | Connected App → Manage Consumer Details |
| `SF_CONSUMER_SECRET` | Connected App → Manage Consumer Details |
| `SF_DOMAIN` | `login` (production) or `test` (sandbox) |

---

## Step 1 — Enable API access for your user

1. Log into Salesforce as an administrator.
2. Go to **Setup** (gear icon, top right) → **Users** → **Profiles**.
3. Open your profile (e.g., "System Administrator" or "Sales Rep").
4. Scroll to **Administrative Permissions** → make sure **"API Enabled"** is checked.
5. Click **Save**.

---

## Step 2 — Get your Security Token

> Skip this step if your server's IP address is already in your org's **Trusted IP Ranges**.

1. Click your **avatar / name** (top right) → **Settings**.
2. In the left sidebar: **My Personal Information** → **Reset My Security Token**.
3. Click **Reset Security Token**.
4. Salesforce emails a new token to your registered address.
5. Copy the token into `SF_SECURITY_TOKEN` in your `.env` file.

> **Note:** Every time you change your Salesforce password, your security token resets automatically. Update `.env` accordingly.

---

## Step 3 — Create a Connected App

1. Go to **Setup** → **App Manager** (search "App Manager" in the Quick Find box).
2. Click **New Connected App** (top right).
3. Fill in the form:

   | Field | Value |
   |---|---|
   | Connected App Name | `Northstar Dashboard` |
   | API Name | `Northstar_Dashboard` |
   | Contact Email | your admin e-mail |
   | Enable OAuth Settings | ✅ checked |
   | Callback URL | `http://localhost:8000/oauth/callback` (not used, but required) |
   | Selected OAuth Scopes | `Full access (full)` — or at minimum: `Access and manage your data (api)` + `Perform requests on your behalf at any time (refresh_token, offline_access)` |

4. Click **Save**, then **Continue**.
5. Wait 2–10 minutes for the Connected App to activate.

---

## Step 4 — Get Consumer Key and Secret

1. Go back to **Setup** → **App Manager**.
2. Find **Northstar Dashboard** in the list.
3. Click the dropdown arrow on the right → **View**.
4. Click **Manage Consumer Details** (requires re-authentication).
5. Copy:
   - **Consumer Key** → `SF_CONSUMER_KEY`
   - **Consumer Secret** → `SF_CONSUMER_SECRET`

---

## Step 5 — Set the IP relaxation policy (recommended)

1. In the Connected App details page, click **Manage** → **Edit Policies**.
2. Under **IP Relaxation**, select **"Relax IP restrictions"**.
3. Click **Save**.

This prevents "Invalid login: IP restricted" errors when the backend runs on a dynamic IP.

---

## Step 6 — Configure your `.env` file

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
SF_USERNAME=your.name@yourcompany.com
SF_PASSWORD=YourSalesforcePassword
SF_SECURITY_TOKEN=AbCdEf1234567890
SF_CONSUMER_KEY=3MVG9...long_key...
SF_CONSUMER_SECRET=ABC123...long_secret...
SF_DOMAIN=login          # or 'test' for sandbox
```

---

## Step 7 — Test the connection

Start the backend:

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

Then check connectivity:

```bash
curl http://localhost:8000/api/v1/sync/status
```

Expected response when credentials are correct:

```json
{
  "connected": true,
  "org_id": "yourorg.my.salesforce.com",
  "api_version": "59.0",
  "sobjects_count": 1024
}
```

---

## Step 8 — Run a sync

**Full sync** (reps + opportunities + accounts + activities):

```bash
curl -X POST http://localhost:8000/api/v1/sync/salesforce
```

**Opportunities only** (incremental, since a date):

```bash
curl -X POST "http://localhost:8000/api/v1/sync/salesforce/opportunities?since_date=2025-01-01"
```

**Accounts only:**

```bash
curl -X POST http://localhost:8000/api/v1/sync/salesforce/accounts
```

Or use the interactive API docs at **http://localhost:8000/docs**.

---

## Sandbox vs Production

| Setting | Production | Sandbox / Developer |
|---|---|---|
| `SF_DOMAIN` | `login` | `test` |
| Login URL | `https://login.salesforce.com` | `https://test.salesforce.com` |
| Username format | `user@company.com` | `user@company.com.sandboxname` |

---

## Troubleshooting

| Error | Fix |
|---|---|
| `INVALID_LOGIN: Invalid username, password, security token; or user locked out` | Wrong password or token — reset security token in Salesforce Settings |
| `AUTHENTICATION_FAILURE: Authentication failure` | Consumer Key/Secret wrong, or Connected App not yet activated (wait 10 min) |
| `IP restricted` | Set IP Relaxation to "Relax IP restrictions" on the Connected App, OR add your server IP to Trusted IP Ranges |
| `simple-salesforce is not installed` | Run `pip install simple-salesforce==1.12.5` |
| `SF_USERNAME not configured` | Check your `.env` file exists in the `backend/` directory and has the SF_* vars set |

---

## Data flow

```
Salesforce CRM
     │
     │  SOQL queries (simple-salesforce)
     ▼
backend/app/services/salesforce.py   ← field mapping / normalisation
     │
     │  upsert
     ▼
SQLite / PostgreSQL (local DB)
     │
     │  REST API
     ▼
northstar_dashboard/app.js           ← dashboard renders live data
```

---

*Made with IBM Bob*
