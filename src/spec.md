# Specification

## Summary
**Goal:** Add a login button to the header for unauthenticated users that triggers Internet Identity authentication.

**Planned changes:**
- Add a "Login" or "Sign In" button to the Header component in the top-right corner before the theme toggle
- Connect the button to the existing useInternetIdentity hook's login function
- Show the login button only when the user is not authenticated
- Hide the login button and display existing logout/profile controls after successful authentication
- Ensure the button is responsive across mobile, tablet, and desktop screen sizes

**User-visible outcome:** Unauthenticated users will see a prominent login button in the header that, when clicked, initiates the Internet Identity authentication flow. After successful login, the button is replaced with the existing user profile and logout controls.
