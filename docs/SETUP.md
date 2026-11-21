# Local and GitHub Pages setup

This project is a static HTML, CSS and JavaScript application. It uses one Supabase project for anonymous sessions and game data. The browser only needs the Supabase project URL and the public anon key. **Never put a Supabase `service_role` key in this project.**

## What you need

- A Supabase account and project.
- A GitHub repository for the project.
- Python 3 for the local static server, or another static-file server.
- The repository checked out locally.

Supabase and GitHub account changes must be made by the project owner in those providers' dashboards. They cannot be completed by editing this repository alone.

## 1. Create the Supabase project

**You must do this in your own Supabase dashboard.**

1. Open the [Supabase dashboard](https://supabase.com/dashboard) and create a new project.
2. Choose the organization, project name, database password and region.
3. Wait for the project to finish provisioning.
4. Open **Project Settings → API** and keep these two values available:
   - **Project URL**, for example `https://your-project-ref.supabase.co`.
   - **Publishable key / anon key**, depending on the dashboard label.

Only the project URL and public anon key belong in the front end. The database password and `service_role` key stay private and must not be copied into `config.js`, committed to Git, or pasted into browser code.

## 2. Enable anonymous sign-in

**You must do this in your own Supabase dashboard.**

1. Open **Authentication → Providers**.
2. Find **Anonymous sign-ins** (it may appear under the email/password or anonymous provider settings).
3. Enable anonymous sign-ins and save the change.

The application calls `signInAnonymously()` when a visitor has no saved session. Supabase stores the resulting session in the browser so a refresh on the same device can restore the player.

### Optional CAPTCHA protection

Anonymous sign-in can be abused by automated scripts. If this project needs that protection, configure CAPTCHA in **Authentication → Providers** or the corresponding **Authentication → Security / CAPTCHA** settings in your Supabase dashboard, then save the provider configuration there.

CAPTCHA is optional for local development. If it is enabled, follow Supabase's dashboard instructions for the selected CAPTCHA provider and register the local and published site origins that the provider requires. Do not put CAPTCHA secret keys in this repository.

## 3. Configure the Supabase Site URL

**You must do this in your own Supabase dashboard.**

1. Open **Authentication → URL Configuration**.
2. Set **Site URL** to the URL where the app will be published.
   - For a GitHub Pages project site, use `https://<github-owner>.github.io/<repository-name>/`.
   - For local-only testing, use `http://localhost:8000/` temporarily, then replace it with the published URL before sharing the game.
3. Save the change.

Use the exact published origin and path. This project uses hash routes such as `#/`, `#/room/<room-id>` and `#/join/<token>`, so the path before the hash is the Site URL. Hash routes do not need server-side rewrites.

## 4. Create the local configuration file

From the repository root, copy the committed example file:

```sh
cp config.example.js config.js
```

Edit `config.js` and replace both placeholders with the values from **Project Settings → API**:

```js
export const SUPABASE_URL = 'https://your-project-ref.supabase.co';
export const SUPABASE_ANON_KEY = 'your-public-anon-key';
```

`config.js` is listed in `.gitignore` and is intended for local development. Keep the public anon key only in this file. Never use the database password or `service_role` key.

For a GitHub Pages deployment, the published branch also needs a `config.js` containing only these two public runtime values. Because the file is git-ignored for local safety, add it to the deployment branch deliberately if that is how the repository publishes its static files. Do not copy any private Supabase credential into that branch.

## 5. Apply the database setup when the SQL files are available

The backend milestone supplies the schema, RLS policies, RPCs and outcome seed files. **You must run those SQL files in your own Supabase dashboard:** open **SQL Editor**, create a query for each file, run them in the documented order, and confirm that each query completes successfully.

The planned order is:

1. `01_schema.sql`
2. `02_rls.sql`
3. `03_rpc.sql`
4. `04_compute_ending.sql`
5. `seed_outcomes.sql`
6. Any clearly marked optional P1 SQL blocks, only if those features are being enabled.

Do not run this step until the corresponding files exist in the repository. The browser must never receive direct table-write permissions; writes go through the documented RPCs and reads are protected by RLS.

## 6. Run the app locally

From the repository root, start a static server:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/> in a browser. Keep the server running while testing. Use a static server rather than opening `index.html` with `file://`; ES modules, the configuration import and Supabase requests require an HTTP origin.

Stop the server with `Ctrl-C`.

## 7. Publish with GitHub Pages

**You must do these steps in your own GitHub repository and GitHub Pages dashboard.**

1. Push the project to the GitHub repository.
2. Ensure the branch and folder selected for Pages contain `index.html`, the `css/` and `js/` directories, and the deployment `config.js` described above.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, then choose the intended branch and `/ (root)` folder. Save the setting.
5. Wait for GitHub to publish the site and open the URL shown in the Pages settings.
6. Copy that exact URL, including the repository path and trailing slash where applicable, into Supabase **Authentication → URL Configuration → Site URL**.
7. Test the opening screen and an anonymous sign-in from the published URL.

GitHub Pages hosts static files and does not run a build command for this project. All asset paths must remain relative so the site works when it is published below `/<repository-name>/`.

## Dashboard ownership checklist

| Action | Who must perform it | Dashboard |
| --- | --- | --- |
| Create the Supabase project | Project owner | Supabase |
| Enable Anonymous sign-ins | Project owner | Supabase → Authentication → Providers |
| Optionally configure CAPTCHA | Project owner | Supabase → Authentication security/provider settings |
| Set the Supabase Site URL | Project owner | Supabase → Authentication → URL Configuration |
| Run schema, RLS, RPC and seed SQL | Project owner | Supabase → SQL Editor |
| Choose the Pages branch and folder | Repository owner | GitHub → Repository Settings → Pages |
| Publish and verify the Pages URL | Repository owner | GitHub Pages |

The repository provides the client code and `config.example.js`; it cannot change either provider's dashboard settings for you.
