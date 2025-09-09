## **Product Requirements Document: Dream Pie (v1.0)**

### **1. Overview**

**Dream Pie** is a mobile AI photoshooting application designed to empower users to create stunning, professional-quality photos of themselves with minimal effort. The app addresses the common anxieties associated with photography—such as not knowing how to pose, feeling unphotogenic, or the fear of a professional photoshoot—by transforming a simple user selfie into a high-quality, model-esque photograph based on a reference pose.

This document outlines the requirements for the initial release (v1.0), focusing on the critical first-time user experience designed to deliver immediate value and build excitement.

### **2. Target Audience & Problem Statement**

**Target Audience:**
Social media users (e.g., Instagram) who wish to build a stronger online presence with more personal photos but are held back by insecurity or a lack of photography skills.

**User Persona ("The Hesitant Creator"):**

- They feel they can't take good photos of themselves.
- They are intimidated by complex editing apps.
- They don't know how to pose and feel awkward in front of a camera.
- They are "lazy" or hesitant to invest time and effort into something they aren't sure will work.

**Problem Statement:**
Users want to post beautiful photos of themselves online but lack the confidence, skills, or resources to produce them, leading to a desire for a solution that is simple, low-effort, and delivers impressive results.

**Our Solution:**
Dream Pie provides an "Instant Gratification" flow. We will show users the magic of the app using high-quality demo images *before* asking them to upload their own photo. This proves the app's value immediately, builds trust, and inspires them to create.

### **3. Core Philosophy & Goals**

**Core Philosophy: "Show, Don't Tell"**
The app's first impression must be a "wow" moment. We will start with a pre-populated demo that showcases the final result, immediately answering the user's primary question: "Will this work for me?"

**Goals for v1.0:**

1. **Maximize User Activation:** Convert a first-time user from a passive observer to an active creator within the first 60 seconds.
2. **Instantly Prove Value:** Demonstrate the app's core capability without requiring any user input or setup.
3. **Build Excitement & Trust:** Create a magical and compelling first-run experience that motivates users to try the app with their own photos.
4. **Establish an Intuitive UI:** The user should understand how the app works simply by observing the initial demo screen.

### **4. The "Instant Gratification" User Flow**

This is the primary user journey for a first-time user opening the app.

1. **App Launch:** User opens Dream Pie for the first time.
2. **Screen 1 - The "Wow" Landing Screen:** The app loads immediately to the main creation screen, pre-populated with a demo selfie and a demo pose.
3. **User Action:** The user, intrigued, taps the prominent "Create My Photoshoot" button.
4. **Screen 2 - The Generation Screen:** An engaging, animated loading screen appears, building anticipation.
5. **Screen 3 - The Demo Result Screen:** A beautiful, generated photo of the demo subject is revealed. The primary call-to-action prompts the user to try it for themselves.
6. **User Action:** The user taps "Now, Try With Your Photo!"
7. **Return to Creation:** The user is taken back to the "Wow" Landing Screen (Screen 1), but this time the "Your Photo" slot is empty and highlighted, guiding them to upload their own selfie.

### **5. Screen-by-Screen Functional Requirements**

---

### **Screen 1: The "Wow" Landing Screen**

**Purpose:** To instantly demonstrate the app's inputs and invite the user to see the result of a pre-configured demo.

**Visuals & UI Elements:**

- **Header/Title:** "Dream Pie" or a simple, welcoming headline.
- **Input Cards:** Two distinct cards placed side-by-side at the top.
    - **Left Card ("Your Photo"):**
        - **Label:** "Your Photo"
        - **Icon:** A simple person/profile icon.
        - **Initial State:** Pre-populated with a high-quality, relatable demo selfie (e.g., an average girl).
        - **Interaction:** A small "Change" or "Swap" icon overlay. Tapping this initiates the photo upload flow (see Supporting Features).
    - **Right Card ("The Pose"):**
        - **Label:** "The Pose"
        - **Icon:** A posing figure or a star icon.
        - **Initial State:** Pre-populated with a high-quality reference photo of a model in a cool, desirable pose.
        - **Interaction:** A small "Change" icon. Tapping this opens the Pose Library (see Supporting Features).
- **Primary CTA Button:**
    - **Label:** "Create My Photoshoot" ✨ (or "Reveal the Magic"). The name should be aspirational and benefit-focused.
    - **Position:** Full-width, located at the bottom of the screen for easy thumb access.
    - **Visuals:** Prominent, with a potential subtle pulse animation to attract attention.

**Functional States:**

1. **Demo State (First Launch):**
    - Both input cards are pre-populated.
    - The "Create My Photoshoot" button is **active** and ready to be tapped.
2. **User Creation State (After Demo):**
    - The "Your Photo" card is empty, with a "Tap to Add" prompt and a pulsing border to guide the user.
    - The "The Pose" card retains the last-used pose.
    - The "Create My Photoshoot" button is **disabled/greyed out** until both a user photo and a pose have been selected.

```
+-------------------------------------------+
|                                           |
|   [ YOUR PHOTO ]        [ THE POSE ]      |
|   +----------+          +----------+      |
|   | Demo     |          | Demo     |      |
|   |  Selfie  |          | Model    |      |
|   |          |          | Pose     |      |
|   +----------+          +----------+      |
|    Change ^               Change ^        |
|                                           |
|                                           |
|      [   ✨ Create My Photoshoot   ]      |
|                                           |
+-------------------------------------------+

```

---

### **Screen 2: The Generation / Loading Screen**

**Purpose:** To turn passive waiting time into an engaging and exciting part of the experience, managing user expectations and building anticipation for the result.

**Visuals & UI Elements:**

- **Dynamic Animation:** A visually compelling animation is required. This should not be a generic spinner.
    - *Concept 1:* A morphing animation where the user's selfie is artistically transformed into the outline of the new pose.
    - *Concept 2:* A "sketching" or "painting" effect, where the final image is drawn onto the screen.
- **Engaging Text Snippets:** A series of short, rotating text phrases that appear during the generation process.
    - Examples: "Finding your best light...", "Perfecting the pose...", "Styling your photoshoot...", "Get ready for your closeup..."
- **Progress Indicator (Optional):** A subtle progress bar that complements the animation.

---

### **Screen 3: The Result Screen (Demo)**

**Purpose:** To present the "wow" moment and immediately pivot the user's excitement into trying the app for themselves.

**Visuals & UI Elements:**

- **Headline:** "Your Photoshoot is Ready!"
- **Generated Image:** The main focus of the screen. A single, high-resolution, beautifully generated image of the demo girl in the new pose.
- **Primary CTA Button:**
    - **Label:** **"Now, Try With Your Photo!"**
    - **Position:** Prominently placed below the image. This is the most important action on the screen.
- **Secondary Actions:**
    - Smaller text links or icons below the main CTA.
    - **"Download Demo":** Allows the user to save the sample image.
    - **"See Another Example":** Refreshes the screen with a new combination of demo selfie/pose and the resulting generation, or takes the user back to Screen 1 with new demo images.

```
+-------------------------------------------+
|                                           |
|        Your Photoshoot is Ready!          |
|                                           |
|      +---------------------------+        |
|      |                           |        |
|      |   BEAUTIFUL DEMO PHOTO    |        |
|      |                           |        |
|      |                           |        |
|      +---------------------------+        |
|                                           |
|      [   Now, Try With Your Photo!  ]      |
|                                           |
|     Download Demo     See Another Example |
|                                           |
+-------------------------------------------+

```

---

### **Screen 4: The Result Screen (User's Photo) & Edit Gateway**

**Purpose:** After a user generates their *own* photo, this screen serves as the hub for saving, sharing, and moving to the next step: enhancement.

**Visuals & UI Elements:**

- **Headline:** "Looking Great!" or "Here's Your Photoshoot!"
- **Generated Image:** The user's own generated photo.
- **Primary CTA Button:**
    - **Label:** **"Enhance & Edit ✨"**
    - **Functionality:** This button leads to the post-generation modification flow (detailed in Future Scope).
- **Secondary Action Icons:**
    - **Download:** Saves the image to the user's device gallery.
    - **Share:** Opens the native mobile sharing options.
    - **Save to Library:** Saves the photo to the user's in-app Dream Pie library.
    - **Generate More:** (Optional) Allows the user to generate variations of the same photo.
    - **Start Over:** Takes the user back to Screen 1.

---

### **6. Supporting Features (v1.0)**

1. **The Pose Library:**
    - **Trigger:** Tapped via the "Change" button on "The Pose" card.
    - **UI:** A visually rich, scrollable grid of high-quality pose reference images.
    - **Features:**
        - **Categories:** Poses should be organized into tabs or filterable categories (e.g., "City Chic," "Beach Vibes," "Confident Power Poses," "Sweet Daily Selfies").
        - **"🎲 Surprise Me" Button:** A floating action button or prominent button that randomly selects a pose for the user, reducing decision fatigue.
2. **Smart Selfie Guidance:**
    - **Trigger:** Tapped via the "Change" button on the "Your Photo" card.
    - **UI:** Before opening the camera or photo picker, a simple screen or overlay provides tips for best results.
    - **Content:** "For the best results: \n• Use a clear, well-lit photo of your face. \n• A neutral background works best. \n• Make sure your face isn't covered."

### **7. Future Scope (Post v1.0)**

The v1.0 flow is designed to seamlessly connect to our future enhancement features.

- **Photo Modification Flow:**
    - Accessed from the "Enhance & Edit" button on the User Result Screen (Screen 4).
    - Presents users with clear, card-based options to modify their generated photo:
        - Change Outfit 👗
        - Change Background 🏞️
        - Adjust Makeup 💄
        - Tweak Pose 🤸‍♀️
        - Advanced Edit (via text prompt) ✍️
- **User Library:**
    - A dedicated section of the app to view and manage all user-generated and uploaded content.
    - **Tabs:** "My Creations," "My Uploads" (separating generated photos from input photos).
    - **Creation Details:** Tapping a generated photo reveals its "recipe": the original selfie and pose used, plus a log of any modifications made (e.g., "Outfit changed to: red dress").

### **8. Success Metrics**

- **Activation Rate:** % of new users who press "Create My Photoshoot" on the initial demo screen.
- **Conversion Rate:** % of users who upload their own photo after viewing the demo result.
- **Time to First Creation:** Average time from app open to a user generating their first photo.
- **Retention (D1/D7):** % of users who return the day/week after their first session.
- **Engagement:** Average number of photos generated per active user.
- **Share/Download Rate:** % of generated photos that are shared or downloaded, indicating user satisfaction with the result.