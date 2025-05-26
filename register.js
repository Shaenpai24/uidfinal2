import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBlJWklhzP-ys7apK3jHdNydCKiHmxfrJs",
      authDomain: "signup-37e48.firebaseapp.com",
      projectId: "signup-37e48",
      storageBucket: "signup-37e48.firebasestorage.app",
      messagingSenderId: "578490476844",
      appId: "1:578490476844:web:1bc06706e2579b833b6489",
      measurementId: "G-RBYZG1VHKR"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app); // Initialize Firebase Authentication
    const analytics = getAnalytics(app); // Optional: for Google Analytics

    // Email + Password Signup
    function signUp() {
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;
      
      // Use Firebase Auth to create the user
      createUserWithEmailAndPassword(auth, email, pass)
        .then(() => {
          alert("Signed up successfully!");
          window.location.href = "Home.htm"; // Redirect to Home.htm after signup
        })
        .catch(err => document.getElementById('error-message').textContent = err.message);
    }

    // Email + Password Login
    function logIn() {
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;

      // Use Firebase Auth to sign in
      signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
          alert("Logged in successfully!");
          window.location.href = "Home.htm"; // Redirect to Home.htm after login
        })
        .catch(err => document.getElementById('error-message').textContent = err.message);
    }

    // Google Login
    function signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      
      // Use Firebase Auth to sign in with Google
      signInWithPopup(auth, provider)
        .then(() => {
          alert("Google login successful");
          window.location.href = "Home.htm"; // Redirect to Home.htm after Google login
        })
        .catch(err => document.getElementById('error-message').textContent = err.message);
    }

    // Anonymous Login
    function signInAnonymously() {
      // Use Firebase Auth for anonymous login
      signInAnonymously(auth)
        .then(() => {
          alert("Guest login successful");
          window.location.href = "Home.htm"; // Redirect to Home.htm after anonymous login
        })
        .catch(err => document.getElementById('error-message').textContent = err.message);
    }