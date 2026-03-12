Hotel Management System
===============

Overview
--------
This system allows administrators to manage the weekly opening and closing hours of a hotel. The admin can set opening time, closing time, or mark a day as closed for each day of the week.


Setup
-----
1. **Clone the repository** (if you haven’t already):
   ```bash
   git clone <your-repo-url>
   cd rest_backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment variables**
   Create a `.env` file in the project root with the following keys (values are examples):
   ```dotenv
   DBConnectionstring=mongodb+srv://<user>:<password>@cluster0.mongodb.net/Restaurantwebsite?retryWrites=true&w=majority
   JWT_SECRET=superkey2026
   ```
   *Do not commit `.env` to source control; it’s already ignored via `.gitignore`.*

4. **Run locally**:
   ```bash
   npm run dev    # requires nodemon installed, or
   npm start
   ```
   Visit `http://localhost:3000` to confirm the server is running.


Deployment to Render
--------------------
Render is a simple platform-as-a-service where you can deploy directly from your GitHub repository.

1. **Create a Render account** and connect it to GitHub.
2. **New Web Service**
   - Click **New** → **Web Service**.
   - Select your repository and the `main` branch (or whichever branch is current).
   - For **Build Command** use:
     ```bash
     npm install
     ```
   - For **Start Command** use:
     ```bash
     npm start
     ```
   - Leave **Environment** as Node.js (Render will detect `package.json`).
3. **Add environment variables** on the service dashboard under the **Environment** tab:
   - `DBConnectionstring` → _your production MongoDB URI_
   - `JWT_SECRET` → _a secure random string_
   - (Any other vars required by your code)
4. **Port configuration**
   - Your app already reads `process.env.PORT` (Render sets this automatically). No additional changes are needed.
5. **Deploy**
   - After saving the service, Render will build and deploy your app.
   - You can view logs on the dashboard. The service will expose a public URL accessible in the browser.

6. **Post-deploy**
   - Test the endpoints via the Render-provided URL (e.g. `https://your-app.onrender.com`).
   - If you need to update code, push to `main` and Render will trigger a new deploy automatically.


Other notes
-----------
* If you ever need to run migrations, seed data, or other setup tasks you can use Render’s [Shell feature](https://render.com/docs/shell).
* If using a custom domain, set it up in the **Settings → Custom Domains** section.
* Keep your `.env` file up-to-date locally but never commit it.

Good luck with your assessment! Send the GitHub URL (and the Render URL if deployed) to HR so they can review the working backend.