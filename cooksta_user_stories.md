# cooksta_user_stories.md

## Project: Cooksta
**A recipe discovery app where users add ingredients, select a cuisine, and get matching recipes.**

---

## 1. Login & Registration
*(Screenshot this section → save as: userstories-login-registration-evidence.png)*

**US-01:** As a new user, I want to register with my full name, email, and password so that I can create a personal Cooksta account.

**US-02:** As a returning user, I want to log in with my email and password so that I can access my saved recipes and preferences.

**US-03:** As a user, I want to see clear validation error messages if I submit empty or invalid fields during login or registration so that I know exactly what to fix.

**US-04:** As a user, I want to stay logged in after closing the app so that I don't have to sign in every time I open Cooksta.

**US-05:** As a user, I want to log out of the app securely so that my account is protected on shared devices.

---

## 2. Home Screen
*(Screenshot this section → save as: userStories-homeScreen-evidence.png)*

**US-06:** As a user, I want to see a home screen with a welcome greeting and an ingredient input area so that I can quickly start finding recipes.

**US-07:** As a user, I want to type ingredients I have at home and add them as chips so that I can build my ingredient list easily.

**US-08:** As a user, I want to tap quick-add suggestion chips (Chicken, Tomato, Onion, Garlic, Rice, Pasta, Eggs) so that I can add common ingredients without typing.

**US-09:** As a user, I want to select a cuisine from a dropdown (Italian, Chinese, Thai, Indian, British, Mexican, French, Japanese, Greek, Any) so that I get recipes matching my preferred food style.

**US-10:** As a user, I want to select a dietary preference (None, Vegetarian, Vegan, Gluten-Free, Dairy-Free, Low-Carb) so that I can filter recipes that suit my diet.

**US-11:** As a user, I want to tap "Find Recipes" button to search for recipes based on my ingredients and cuisine selection so that I see relevant meal options.

---

## 3. Detail Screen
*(Screenshot this section → save as: userStories-detailScreen-evidence.png)*

**US-12:** As a user, I want to tap on a recipe card to view its full details so that I can decide if I want to cook it.

**US-13:** As a user, I want to see an Ingredients tab on the recipe detail screen showing all ingredients with measurements so that I know exactly what I need.

**US-14:** As a user, I want to see a Steps tab on the recipe detail screen showing numbered cooking instructions so that I can follow the recipe step by step.

**US-15:** As a user, I want to see an About tab with cuisine type, category, and a YouTube link (if available) so that I can learn more about the dish.

**US-16:** As a user, I want to tap a heart icon on the recipe detail screen to add or remove a recipe from my favorites so that I can save meals I love.

**US-17:** As a user, I want to share a recipe with friends using the share button so that I can recommend meals I enjoy.

---

## 4. Settings Screen
*(Screenshot this section → save as: userstories-settingscreen-evidence.png)*

**US-18:** As a user, I want to access a Settings screen from the bottom navigation bar so that I can manage my account and preferences.

**US-19:** As a user, I want to view my profile information (name and email) in the Settings screen so that I can see my account details.

**US-20:** As a user, I want to edit my profile name in the Settings screen so that I can keep my account information up to date.

---

## 5. Settings Menu
*(Screenshot this section → save as: userstories-menusettings-evidence.png)*

**US-21:** As a user, I want to toggle between dark mode and light mode in the Settings menu so that I can customize the app's appearance to reduce eye strain.

**US-22:** As a user, I want to view my saved favorite recipes from the Settings menu so that I can access them in one place.

**US-23:** As a user, I want to sign out of the app from the Settings menu so that I can securely log out when needed.

---

## 6. Notifications
*(Screenshot this section → save as: userstories-notifications-evidence.png)*

**US-24:** As a user, I want to enable daily meal reminders in the Settings screen so that the app reminds me to plan or cook a meal each day.

**US-25:** As a user, I want to choose the time for my daily meal reminder so that notifications arrive at a convenient time for me.

**US-26:** As a user, I want to disable meal reminder notifications at any time so that I have full control over alerts from the app.

---

## 7. Data Persistence
*(Screenshot this section → save as: userStories-persistent-evidence.png)*

**US-27:** As a user, I want my favorite recipes to be saved locally on my device using AsyncStorage so that I can access them even without an internet connection.

**US-28:** As a user, I want my login session to persist in local storage so that the app remembers me between sessions without requiring me to sign in again.

**US-29:** As a user, I want my theme preference (dark/light mode) to be saved locally so that my setting is remembered every time I open the app.

**US-30:** As a user, I want my notification time preference to be saved locally so that I don't have to reconfigure it every session.

---

## 8. External API Integration
*(Screenshot this section → save as: userStories-externalAPI-evidence.png)*

**US-31:** As a user, I want recipes to be fetched from the TheMealDB API based on ingredients I add so that I always get real, diverse recipe options.

**US-32:** As a user, I want recipes to be filtered by cuisine area using the TheMealDB API so that I get meals matching my selected cuisine style.

**US-33:** As a user, I want to see featured random recipes on the home screen fetched from the API so that I get daily inspiration even without searching.

**US-34:** As a user, I want to see full recipe details (ingredients, steps, image, YouTube link) fetched from the TheMealDB API so that I have complete cooking information.

---

## Summary

| User Story | Feature |
|---|---|
| US-01 to US-05 | Login & Registration |
| US-06 to US-11 | Home Screen + Ingredient Input + Cuisine Selection |
| US-12 to US-17 | Recipe Detail Screen |
| US-18 to US-20 | Settings Screen |
| US-21 to US-23 | Settings Menu |
| US-24 to US-26 | Notifications |
| US-27 to US-30 | Data Persistence (AsyncStorage) |
| US-31 to US-34 | External API Integration (TheMealDB) |

---

## GitHub Repository
- **Repo name:** cooksta
- **Visibility:** Public
- **Framework:** React Native + Expo
- **API:** TheMealDB (free, no key required)
